import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

export default class CommandSetprofile extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Changes your profile informations",
			usage: "Section Input",
			example: "aboutme My name is Xxx_FortnitePro_xxX!"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(_: AldebaranClient, message: Message, args: any) {
		const availableSections = ["name", "country", "timezone", "birthday", "profilePictureLink", "favoriteGames", "profileColor", "favoriteMusic", "socialLinks", "zodiacName", "flavorText"];
		const sectionMatches = {
			profilepicturelink: "profilePictureLink",
			favoritegames: "favoriteGames",
			profilecolor: "profileColor",
			favoritemusic: "favoriteMusic",
			sociallinks: "socialLinks",
			zodiacname: "zodiacName",
			flavortext: "flavorText"
		};
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.pfp())
			.setDescription("Please specify a section and value")
			.setColor("Red")
			.addField("**__Available Sections__**", `${availableSections.join(" | ")}`, false);
		if (args.length <= 0) return message.channel.send((embed));

		const section = args.shift().toLowerCase();
		const profiletarget = sectionMatches[section as keyof typeof sectionMatches] || section;
		const inputdata = args.join(" ");

		message.author.profile.changeProperty(profiletarget, inputdata).then(() => {
			message.channel.send(`Your ${profiletarget} has been updated to \`${inputdata}\`.`);
		}).catch(() => {
			const error = new MessageEmbed()
				.setAuthor(message.author.username, message.author.pfp())
				.setTitle("Unknown Profile Section")
				.setDescription("Please check to ensure this is a correct profile section. If you think the specified profile section was valid, please make sure the value is too.")
				.setColor("RED");
			message.channel.send({ embed: error });
		});
		return true;
	}
};
