import { Client, Collection, Guild as DJSGuild } from "discord.js";
import { Request } from "express";
import fetchDSMValue from "../../utils/fetchDSMValue.js";
import Guild from "./Guild.js";
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
	 * Returns the requested guilds
	 * @returns {[Guild]}
	 */
	edges(_: object, request: Request) {
		return new Promise(resolve => {
			const check = async (c: Client<true>, {
				userId, before, after, first, last
			}: {
				userId: string,
				before: string | null,
				after: string | null,
				first: number | null,
				last: number | null
			}) => {
				let list: Collection<string, DJSGuild> | DJSGuild[] | null = null;
				const user = await c.users.fetch(userId);
				const guilds = c.guilds.cache
					.filter(g => g.members.cache.has(user.id));

				list = guilds.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

				let timestamp = 0;
				if (before || after) {
					timestamp = Number(Buffer.from(before || after!, "base64").toString("ascii"));
					if (before) {
						list = list.filter(g => g.createdTimestamp < timestamp);
					} else if (last) {
						list = list.filter(g => g.createdTimestamp > timestamp);
					}
				}

				if (first) {
					list = list.first(first);
				} else if (last) {
					list = list.last(last);
				} else {
					list = Array.from(list.values());
				}
				return list;
			};

			fetchDSMValue(request.app.dsm, check, { context: {
				userId: this.user,
				before: this.before,
				after: this.after,
				first: this.first,
				last: this.last
			} }).then(async (data?) => {
				const guilds = await data;
				if (guilds) {
					this.totalCount = guilds.length;
					this.endCursor = Buffer.from(guilds[guilds.length - 1].id).toString("base64");
					this.startCursor = Buffer.from(guilds[0].id).toString("base64");
					const e = (g: string) => new GuildsConnectionEdge(new Guild(g));
					resolve(guilds.reduce(
						(acc: GuildsConnectionEdge[], cur) => [...acc, e(cur.id)], []
					));
				} else {
					resolve([]);
				}
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
