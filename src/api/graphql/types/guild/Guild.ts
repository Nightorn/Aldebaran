import { Client } from "discord.js";
import { Request } from "express";
import DiscordStructWithSettings from "../common/DiscordStructWithSettings.js";
import UsersConnection from "../user/UsersConnection.js";
import fetchDSMValue from "../../utils/fetchDSMValue.js";
import GenericDatabaseProvider from "../../../../handlers/GenericDatabaseProvider.js";

export default class Guild extends DiscordStructWithSettings {
	ID: string;

	constructor(id: string) {
		super(id);
		this.ID = id;
	}

	/**
	 * Returns the timestamp representing the date of creation of the guild.
	 * @param {*} request Request object
	 * @returns {Promise<number>}
	 */
	async createdTimestamp(_: object, request: Request) {
		const query = (c: Client, { id }: { id: string }) => c
			.guilds.cache.get(id)!.createdTimestamp;
		return fetchDSMValue(request.app.dsm, query, { context: { id: this.ID } });
	}

	/**
	 * Returns the avatar URL of the current guild.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async iconURL(_: object, request: Request) {
		const query = (c: Client, { id }: { id: string }) => {
			const guild = c.guilds.cache.get(id);
			return guild ? guild.iconURL({ format: "png", size: 64 }) : null;
		};
		return fetchDSMValue(request.app.dsm, query, { context: { id: this.ID } });
	}

	/**
	 * Returns the members of this guild.
	 */
	members({ first, last, after, before }: {
		first: number | null,
		last: number | null,
		after: string | null,
		before: string | null
	}) {
		return new UsersConnection({ guild: this.ID, first, last, after, before });
	}

	/**
	 * Returns the username of the current user.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async name(_: object, request: Request) {
		const query = (c: Client, { id }: { id: string }) => c
			.guilds.cache.get(id)?.name;
		return fetchDSMValue(request.app.dsm, query, { context: { id: this.ID } });
	}

	/**
	 * Fetches the settings of the current guild from the database.
	 * @param {*} db The DatabaseProvider of the application
	 */
	async querySettings(db: GenericDatabaseProvider) {
		const results = await db.query(`SELECT settings FROM guilds WHERE guildid="${this.ID}"`);
		return results.length > 0 ? JSON.parse(results[0].settings) : null;
	}
}
