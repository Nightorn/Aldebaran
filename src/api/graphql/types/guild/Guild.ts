import { Request } from "express";
import DiscordStructWithSettings from "../common/DiscordStructWithSettings";
import UsersConnection from "../user/UsersConnection";
import fetchDSMValue from "../../utils/fetchDSMValue";
import GenericDatabaseProvider from "../../../../handlers/GenericDatabaseProvider";

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
	async createdTimestamp(_: any, request: Request) {
		const query = `this.guilds.cache.get("${this.ID}")`;
		return fetchDSMValue((request.app as any).dsm, query, 2, "createdTimestamp");
	}

	/**
	 * Returns the avatar URL of the current guild.
	 * @param {*} request Request object
	 * @returns {string}
	 */
	async iconURL(_: any, request: Request) {
		const query = `const guild = this.guilds.cache.get("${this.ID}"); guild ? guild.iconURL({ format: 'png', size: 64 }) : null;`;
		return fetchDSMValue((request.app as any).dsm, query, 2);
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
	async name(_: any, request: Request) {
		const query = `this.guilds.cache.get("${this.ID}")`;
		return fetchDSMValue((request.app as any).dsm, query, 2, "name");
	}

	/**
	 * Fetches the settings of the current guild from the database.
	 * @param {*} db The DatabaseProvider of the application
	 */
	async querySettings(db: GenericDatabaseProvider) {
		const results = await db.query(`SELECT settings FROM guilds WHERE guildid="${this.ID}"`);
		return results.length > 0 ? JSON.parse(results[0].settings) : null;
	}
};
