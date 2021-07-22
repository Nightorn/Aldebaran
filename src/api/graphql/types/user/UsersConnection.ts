import { GuildMember as DJSMember } from "discord.js";
import { Request } from "express";
import fetchDSMValue from "../../utils/fetchDSMValue.js";
import PageInfo from "../PageInfo.js";
import User from "./User.js";
import UsersConnectionEdge from "./UsersConnectionEdge.js";

export default class UsersConnection {
	guild: string;
	first: number | null;
	last: number | null;
	after: string | null;
	before: string | null;
	totalCount!: number;
	endCursor!: string;
	startCursor!: string;

	/**
	 * A Connection for users, as specified by the GraphQL specification.
	 * @param {object} args Filters for the connection
	 * @param {string} args.guild Specific guild to fetch the users from using its ID
	 * @param {number} args.first The number of users to return, starting from the beginning of the filtered users' list
	 * @param {number} args.last The number of users to return, starting from the end of the filtered users' list
	 * @param {number} args.after The ID of the user after which the filtered users' list has to begin
	 * @param {number} args.before The ID of the user before which the filtered users' list has to end
	 */
	constructor(
		{ guild, first = null, last = null, after = null, before = null }: {
			guild: string,
			first: number | null,
			last: number | null,
			after: string | null,
			before: string | null
		}
	) {
		if (guild) this.guild = guild;
		else throw new TypeError("The guild ID is invalid.");
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
				indexing = `.filter(u => u.joinedTimestamp ${this.before ? "<" : ">"} Number("${timestamp}"))`;
			}
			const check = `const guild = this.guilds.cache.get("${this.guild}"); guild ? [guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)${indexing}${numberFilter}, guild.members.cache${indexing}.size] : [null, 0];`;
			fetchDSMValue((request.app as any).dsm, check, indexing ? 6 : 2)
				.then((data: any) => {
					const users = data[0] as DJSMember[];
					this.totalCount = data[1];
					this.endCursor = Buffer.from(users[users.length - 1].id).toString("base64");
					this.startCursor = Buffer.from(users[0].id).toString("base64");
					const user = (u: DJSMember) => new User(u.id, u.joinedTimestamp!);
					const e = (u: DJSMember) => new UsersConnectionEdge(user(u));
					resolve(users.reduce(
						(acc: UsersConnectionEdge[], cur) => [...acc, e(cur)], []
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
