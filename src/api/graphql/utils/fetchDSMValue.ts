import { Client, Serialized, ShardingManager } from "discord.js";

/**
 * Fetches a value from the Discord Sharding Manager.
 * @param {*} dsm The Discord Sharding Manager
 * @param {*} check The query to check if the queried property parent exists
 */
export default <T, P> (
	dsm: ShardingManager,
	check: (client: Client<boolean>, context: Serialized<P>) => T,
	options: { context: P }
): Promise<T | undefined> => new Promise<T>(
	async (resolve: (v: T) => void) => resolve(
		(await dsm.broadcastEval<T, P>(check, options)).filter(r => r)[0] as T
	)
);
