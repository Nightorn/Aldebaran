import { Guild as DJSGuild } from "discord.js";
import { Request } from "express";
import fetchDSMValue from "../../utils/fetchDSMValue.js";
import GuildsConnectionEdge from "./GuildsConnectionEdge.js";
import PageInfo from "../PageInfo.js";

export default class GuildsConnection {
	user: string;
	first: number | null;
	last: number | null;
	after: string | null;
	before: string | null;
	totalCount!: number;
	endCursor!: string;
	startCursor!: string;

	/**
	 * A Connection for guilds, as specified by the GraphQL specification.
	 * @param {object} args Filters for the connection
	 * @param {string} args.user Specific user to fetch the mutual guilds from using its ID
	 * @param {number} args.first The number of guilds to return, starting from the beginning of the filtered guilds' list
	 * @param {number} args.last The number of guilds to return, starting from the end of the filtered guilds' list
	 * @param {number} args.after The ID of the guild after which the filtered guilds' list has to begin
	 * @param {number} args.before The ID of the guild before which the filtered guilds' list has to end
	 */
	constructor(
		{ user, first = null, last = null, after = null, before = null }: {
			user: string,
			first: number | null,
			last: number | null,
			after: string | null,
			before: string | null
		}
	) {
		if (user) this.user = user;
		else throw new TypeError("The user ID is invalid.");
		this.first = last ? null : Math.min(first!, 20);
		this.last = first ? null : Math.min(last!, 20);
		this.after = after;
		this.before = before;
	}

	/**
	 * Returns the requested users
	 * @returns {[User]}
	 */
	edges(_: any, request: Request) {
		return new Promise(resolve => {
			let numberFilter = ".first(10)";
			let indexing = "";
			if (this.first)
				numberFilter = `.first(${this.first})`;
			else if (this.last)
				numberFilter = `.last(${this.last})`;
			if (this.before || this.after) {
				const timestamp = Buffer.from(this.before || this.after!, "base64").toString("ascii");
				indexing = `.filter(g => g.createdTimestamp ${this.before ? "<" : ">"} Number("${timestamp}"))`;
			}
			const check = `let result = null; const user = this.users.cache.get("${this.user}"); if (user) { const guilds = this.guilds.cache.filter(g => g.members.cache.has(user.id)); result = [guilds.sort((a, b) => a.createdTimestamp - b.createdTimestamp)${indexing}${numberFilter}, guilds${indexing}.size] }; result;`;
			fetchDSMValue((request.app as any).dsm, check, indexing ? 6 : 2)
				.then(async (data: any) => {
					const guilds = data[0] as DJSGuild[];
					this.totalCount = data[1];
					const Guild = (await import("./Guild")).default;
					this.endCursor = Buffer.from(guilds[guilds.length - 1].id).toString("base64");
					this.startCursor = Buffer.from(guilds[0].id).toString("base64");
					const e = (g: string) => new GuildsConnectionEdge(new Guild(g));
					resolve(guilds.reduce(
						(acc: GuildsConnectionEdge[], cur) => [...acc, e(cur.id)], []
					));
				});
		});
	}

	/**
	 * Returns data about the current page.
	 */
	pageInfo() {
		return new PageInfo(this.endCursor, this.startCursor, this.totalCount);
	}
};
