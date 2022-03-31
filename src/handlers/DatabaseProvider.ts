import { escape as esc } from "mysql2";
import AldebaranClient from "../structures/djs/Client.js";
import GenericDatabaseProvider from "./GenericDatabaseProvider.js";

export default class DatabaseProvider extends GenericDatabaseProvider {
	client: AldebaranClient;
	guilds: { [key: string]: Function };
	socialprofile: { [key: string]: Function };
	users: { [key: string]: Function };

	/**
	 * Returns a MySQL pool connection to the Aldebaran's database
	 */
	constructor(client: AldebaranClient) {
		super();
		this.client = client;
		this.users = {
			/**
			 * Returns the data of the user specified from the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (
				id: string, columns?: string[]
			) => (await this.query(
				`SELECT ${columns !== undefined ? columns.join(", ") : "*"
				} FROM users WHERE userId='${id}'`
			))[0],
			/**
			 * Returns the data of all users from the database
			 */
			selectAll: async () => this.query("SELECT * FROM users"),
			/**
			 * Updates the data of the user specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {Map} changes Changes to make to the user, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateOneById: async (id: string, ch: Map<string, string | number>) => {
				const updates = DatabaseProvider.convertChangesMapToString(ch);
				return this.query(
					`UPDATE users SET ${updates.join(", ")} WHERE userId='${id}'`
				);
			},
			/**
			 * Deletes the data of the user specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			deleteOneById: async (id: string) => this.query(
				`DELETE FROM users WHERE userId='${id}'`
			),
			/**
			 * Inserts a user in the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			createOneById: async (id: string) => this.query(
				`INSERT INTO users (userId, settings) VALUES ('${id}', '{}')`
			)
		};
		this.guilds = {
			/**
			 * Returns the data of the guild specified from the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (
				id: string, columns?: string[]
			) => (await this.query(
				`SELECT ${columns !== undefined ? columns.join(", ") : "*"
				} FROM guilds WHERE guildid='${id}'`
			))[0],
			/**
			 * Returns the data of all users from the database
			 */
			selectAll: async () => this.query("SELECT * FROM guilds"),
			/**
			 * Updates the data of the guild specified on the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {Map} changes Changes to make to the guild, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateOneById: async (id: string, ch: Map<string, string | number>) => {
				const updates = DatabaseProvider.convertChangesMapToString(ch);
				return this.query(
					`UPDATE guilds SET ${updates.join(", ")} WHERE guildid='${id}'`
				);
			},
			/**
			 * Deletes the data of the guild specified on the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 */
			deleteOneById: async (id: string) => this.query(
				`DELETE FROM guilds WHERE guildid='${id}'`
			),
			/**
			 * Inserts a guild in the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 */
			createOneById: async (id: string) => this.query(
				`INSERT INTO guilds (guildid, settings, commands) VALUES ('${id}', '{}', '{}')`
			)
		};
		this.socialprofile = {
			/**
			 * Returns the data of the profile specified from the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (
				id: string, columns?: string[]
			) => (await this.query(
				`SELECT ${columns !== undefined ? columns.join(", ") : "*"
				} FROM socialprofile WHERE userId='${id}'`
			))[0],
			/**
			 * Returns the data of all users from the database
			 */
			selectAll: async () => this.query("SELECT * FROM socialprofile"),
			/**
			 * Updates the data of the profile specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 * @param {Map} changes Changes to make to the profile, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateOneById: async (id: string, ch: Map<string, string | number>) => {
				return this.changesQuery(`UPDATE socialprofile SET ? WHERE userId='${id}'`, ch);
			},
			/**
			 * Deletes the data of the profile specified on the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			deleteOneById: async (id: string) => this.query(
				`DELETE FROM socialprofile WHERE userId='${id}'`
			),
			/**
			 * Inserts a profile in the database
			 * @param {string} id Snowflake ID of the Discord User
			 */
			createOneById: async (id: string) => this.query(
				`INSERT INTO socialprofile (userId) VALUES ('${id}')`
			)
		};
	}

	changesQuery(query: string, changes: Map<string, string | number>) {
		let updates = [];
		for (const [k, v] of changes.entries()) {
			updates.push(`${k} = ${esc(v)}`);
		}
		return this.query(query.replace("?", updates.join(", ")));
	}

	static checkUpdateOneById(changes: Map<string, string | number>) {
		if (changes.size === 0)
			return new RangeError("You need to specify at least one change.");
		return true;
	}

	static convertChangesMapToString(changes: Map<string, string | number>) {
		const updates = [];
		for (const [key, value] of changes)
			updates.push(
				`${key}=${typeof value === "number" ? value : `'${value}'`}`
			);
		return updates;
	}
}
