import AldebaranClient from "../structures/djs/Client.js";
import GenericDatabaseProvider from "./GenericDatabaseProvider.js";
import Message from "../structures/djs/Message.js";

export default class DatabaseProvider extends GenericDatabaseProvider {
	client: AldebaranClient;
	commands: any;
	guilds: any;
	photogallery: any;
	socialprofile: any;
	users: any;

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
				const updates = DatabaseProvider.convertChangesMapToString(ch);
				return this.query(
					`UPDATE socialprofile SET ${updates.join(", ")} WHERE userId='${id}'`
				);
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
		this.photogallery = {
			/**
			 * Returns the data of the photo specified from the database
			 * @param {string} id ID of the photo
			 * @param {string[]} columns Columns to retrieve in the returned data
			 */
			selectOneById: async (id: string, columns?: string[]) => (
				await this.query(`SELECT ${
					columns !== undefined ? columns.join(", ") : "*"
				} FROM photogallery WHERE id='${id}'`)
			)[0],
			/**
			 * Returns a random photo from the database
			 * @param {boolean} nsfw Return NSFW Content
			 * @param {string[]} columns Columns to retrieve in the returned data
			 * @param {number} limit Number of photos to return
			 */
			selectRandom: async (
				nsfw: boolean, columns: string[] = [], limit: number = 1
			) => this.query(
				`SELECT ${
					columns.length > 0 ? columns.join(", ") : "*"
				} FROM photogallery WHERE nsfw=${
					nsfw ? 1 : 0
				} ORDER BY RAND() LIMIT ${limit}`
			),
			/**
			 * Updates the data of the photo specified on the database
			 * @param {string} id ID of the photo
			 * @param {Map} changes Changes to make to the photo, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
			 */
			updateById: async (id: string, ch: Map<string, string | number>) => {
				const updates = DatabaseProvider.convertChangesMapToString(ch);
				return this.query(
					`UPDATE photogallery SET ${updates.join(", ")} WHERE id='${id}'`
				);
			},
			/**
			 * Deletes the data of the photo specified on the database
			 * @param {string} id ID of the photo
			 */
			deleteById: async (id: string) => {
				this.query(`DELETE FROM photogallery WHERE id='${id}'`);
			},
			/**
			 * Inserts a photo in the database
			 * @param {string} id Snowflake ID of the Discord Guild
			 * @param {string} link URL of the Image
			 * @param {string} linkname Title of the Image
			 * @param {string[]} tags Tags of the Image
			 * @param {boolean} nsfw NSFW Content
			 */
			create: async (
				id: string,
				link: string,
				linkname: string,
				tags: string[],
				nsfw: boolean
			) => {
				this.query(`INSERT INTO photogallery (userId, links, linkname, tags, nsfw) VALUES ('${id}', '${link}', '${linkname}', '${tags}', ${nsfw})`);
			}
		};
		this.commands = {
			create: async (
				command: string, args: any, message: Message
			) => this.query(
				`INSERT INTO commands (command, userId, channelId, guildId, args) VALUES ('${command}', '${
					message.author.id
				}', '${message.channel.id}', '${message.guild.id}', '${JSON.stringify(
					args
				)}')`
			)
		};
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
};
