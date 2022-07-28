import Server from "../structures/models/Server.js";

export default interface ContextServer {
	base: Server;

	get name(): string;
}
