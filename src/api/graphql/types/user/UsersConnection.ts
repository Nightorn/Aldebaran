import { Client, Collection, GuildMember as DJSMember } from "discord.js";
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
	edges(_: object, request: Request) {
		return new Promise(resolve => {
			const check = async (c: Client, {
				guildId, before, after, first, last
			}: {
				guildId: string,
				before: string | null,
				after: string | null,
				first: number | null,
				last: number | null
			}) => {
				let list: Collection<string, DJSMember> | DJSMember[] | null = null;
				const guild = await c.guilds.fetch(guildId);
				if (guild) {
					list = guild.members.cache
						.sort((a, b) => a.joinedTimestamp! - b.joinedTimestamp!);

					let timestamp = 0;
					if (before || after) {
						timestamp = Number(Buffer.from(before || after!, "base64").toString("ascii"));
						if (before) {
							list = list.filter(m => m.joinedTimestamp! < timestamp);
						} else if (last) {
							list = list.filter(m => m.joinedTimestamp! > timestamp);
						}
					}

					if (first) {
						list = list.first(first);
					} else if (last) {
						list = list.last(last);
					} else {
						list = Array.from(list.values());
					}
				}
				return list;
			};

			fetchDSMValue(request.app.dsm, check, { context: {
				guildId: this.guild,
				before: this.before,
				after: this.after,
				first: this.first,
				last: this.last
			} }).then(async (data?) => {
				const users = await data;
				if (users) {
					this.totalCount = users.length;
					this.endCursor = Buffer.from(users[users.length - 1].id).toString("base64");
					this.startCursor = Buffer.from(users[0].id).toString("base64");
					const user = (u: DJSMember) => new User(u.id, u.joinedTimestamp!);
					const e = (u: DJSMember) => new UsersConnectionEdge(user(u));
					resolve(users.reduce(
						(acc: UsersConnectionEdge[], cur) => [...acc, e(cur)], []
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
}
