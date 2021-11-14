import { Request } from "express";
import GenericDatabaseProvider from "../../../../handlers/GenericDatabaseProvider.js";

export default abstract class DiscordStructWithSettings {
	ID: string;

	constructor(id: string) {
		const check = id.match(/\d{17,19}/);
		if (check === null)
			throw new TypeError("The specified ID does not match the format of a ID.");
		else this.ID = check[0];
	}

	/**
	 * Returns the ID of the current structure.
	 * @returns {string}
	 */
	async id() {
		return this.ID;
	}

	/**
	 * Returns the settings of the current structure, if any.
	 * @param {object} args Request arguments
	 * @param {string[]} args.keys Request arguments
	 * @param {*} request Request object
	 * @returns {string[]}
	 */
	async settings({ keys }: { keys: string[] }, request: Request) {
		const u = await this.querySettings(request.app.db);
		return u ? keys.reduce(
			(acc: (string | number | undefined)[], cur: string) => [...acc, u[cur]],
			[]
		) : [];
	}

	abstract querySettings(
		db: GenericDatabaseProvider
	): Promise<{ [key: string]: string }>;
};
