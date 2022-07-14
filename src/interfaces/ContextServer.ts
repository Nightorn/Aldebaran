import Server from "../structures/models/Server";

export default interface ContextServer {
	base: Server;

	get name(): string;
}
