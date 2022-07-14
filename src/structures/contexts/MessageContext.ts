import { GuildMember, Message, MessageEmbed, TextBasedChannel } from "discord.js";
import { ErrorString, Errors, CommandMode, If } from "../../utils/Constants.js";
import Client from "../Client.js";
import Command from "../../groups/Command.js";
import User from "../../interfaces/ContextUser.js";
import Server from "../../interfaces/ContextServer.js";

export default abstract class MessageContext<InGuild extends boolean = false> {
	public abstract author: User;
	public abstract server?: If<InGuild, Server>;

	protected _args?: string[] | { [key: string]: string | boolean; };
	public abstract client: Client;
	public abstract command?: Command;

	abstract get args(): string[] | {
		[key: string]: string | number | boolean | undefined;
	};
	abstract get channel(): TextBasedChannel;
	abstract get createdTimestamp(): number;
	abstract get member(): If<InGuild, GuildMember>;
	abstract get mode(): CommandMode;
	abstract get prefix(): string;

	abstract delete(delay?: number): Promise<Message<boolean> | false>;
	abstract fetchServer(id: number | string): Promise<Server>;
	abstract fetchUser(id: number | string): Promise<User>;
	abstract reply(content: string | MessageEmbed): unknown;

	argsCheck() {
		if (this.command && this.command.metadata.args) {
			const args = this.command.metadata.args;
			const mandatory = Object.keys(args).filter(k => !args[k].optional);
			const mandatoryFound = Object.keys(this.args)
				.filter(a => mandatory.includes(a));
			return mandatory.length === mandatoryFound.length;
		}
		return true;
	}

	async error(type: ErrorString, desc?: string, value?: string) {
		const title = Errors[type] && value
			? Errors[type](value)
			: "An error has occured.";
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
}
