import { Client } from "discord.js";
import { Request } from "express";
import DiscordStructWithSettings from "../common/DiscordStructWithSettings.js";
import GuildsConnection from "../guild/GuildsConnection.js";
import SocialProfile from "../SocialProfile.js";
import fetchDSMValue from "../../utils/fetchDSMValue.js";
import GenericDatabaseProvider from "../../../../handlers/GenericDatabaseProvider.js";

export default class User extends DiscordStructWithSettings {
	joinedTimestamp: number | null;

	constructor(id: string, joinedTimestamp?: number) {
		super(id);
		this.joinedTimestamp = joinedTimestamp || null;
	}

	/**
	 * Returns the avatar URL of the current user.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async pfp(_: object, request: Request) {
		const query = async (client: Client) => {
			const user = await client.users.fetch(this.ID);
			return user ? user.displayAvatarURL() : null;
		};
		return fetchDSMValue(request.app.dsm, query);
	}

	/**
	 * Returns the guilds both Aldebaran and the current user are in.
	 */
	mutualServers({ first, last, after, before }: {
		first: number | null,
		last: number | null,
		after: string | null,
		before: string | null
	}) {
		return new GuildsConnection({ user: this.ID, first, last, after, before });
	}

	/**
	 * Returns the profile associated with this user.
	 */
	async profile() {
		return new SocialProfile(this.ID);
	}

	/**
	 * Returns the username of the current user.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async username(_: object, request: Request) {
		const query = async (c: Client) => (await c.users.fetch(this.ID)).username;
		return fetchDSMValue(request.app.dsm, query);
	}

	/**
	 * Fetches the settings of the current user from the database.
	 * @param {*} db The DatabaseProvider of the application
	 */
	async querySettings(db: GenericDatabaseProvider) {
		const results = await db.query(`SELECT settings FROM users WHERE userId="${this.ID}"`);
		return results.length > 0 ? JSON.parse(results[0].settings) : null;
	}
};
