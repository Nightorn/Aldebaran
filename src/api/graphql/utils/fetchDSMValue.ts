import { Client, ShardingManager } from "discord.js";

/**
 * Fetches a value from the Discord Sharding Manager.
 * @param {*} dsm The Discord Sharding Manager
 * @param {*} check The query to check if the queried property parent exists
 */
export default <T> (
	dsm: ShardingManager,
	check: (client: Client<boolean>) => T
): Promise<T | undefined> => new Promise<T>(
	async (resolve: (v: T) => void) => resolve(
		(await dsm.broadcastEval<T>(check)).filter(r => r)[0] as T
	)
);
