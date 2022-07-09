import { GuildMember, Message, MessageEmbed, MessageOptions, TextBasedChannel } from "discord.js";
import { ErrorString, Errors, CommandMode } from "../../utils/Constants.js";
import Client from "../Client.js";
import Command from "../../groups/Command.js";
import ContextAuthor from "../../interfaces/ContextAuthor.js";
import ContextServer from "../../interfaces/ContextServer.js";

export default abstract class MessageContext {
    public abstract author: ContextAuthor;
    public abstract server?: ContextServer;

	protected _args?: string[] | { [key: string]: string | boolean; };
	public client: Client;
	public abstract command?: Command;

	constructor(client: Client) {
		this.client = client;
	}

	abstract get args(): string[] | {
		[key: string]: string | number | boolean | undefined;
	};
	abstract get channel(): TextBasedChannel;
	abstract get createdTimestamp(): number;
	abstract get member(): GuildMember | null;
	abstract get mode(): CommandMode;
	abstract get prefix(): string;

	abstract delete(delay?: number): Promise<Message<boolean> | false>;
	
	argsCheck() {
		if (this.command && this.command.metadata.args) {
			const mandatory = Object.keys(this.command.metadata.args)
				.filter(k => !this.command!.metadata.args![k].optional);
			const mandatoryFound = Object.keys(this.args)
				.filter(k => mandatory.includes(k));
			return mandatory.length === mandatoryFound.length;
		}
		return true;
	}

	async error(type: ErrorString, desc?: string, value?: string) {
		const title = Errors[type] ? Errors[type](value!) : "An error has occured.";
		const embed = new MessageEmbed()
			.setTitle(title)
			.setColor("RED");
		if (type === "UNEXPECTED_BEHAVIOR") {
			embed.setDescription(`${desc}\nPlease contact the developers or fill a bug report using the \`bugreport\` command.`);
		} else if (type === "INVALID_USER") {
			embed.setDescription("The user ID you have supplied is invalid, or the user you have mentionned does not exist. Make sure your user ID or your mention is correct.");
		} else if (desc) {
			embed.setDescription(desc);
		}
		return this.reply(embed);
	}

	abstract reply(content: string | MessageEmbed): any;
}
