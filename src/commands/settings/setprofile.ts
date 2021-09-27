import { MessageEmbed } from "discord.js";
import { Command } from "../../groups/SettingsCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import { SocialProfileProperty } from "../../utils/Constants.js";

export default class CommandSetprofile extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Changes your profile informations",
			usage: "Section Input",
			example: "aboutme My name is Xxx_FortnitePro_xxX!"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const args = ctx.args as string[];
		const profile = await (await ctx.author()).profile();
		const availableSections = ["aboutMe", "dmFriendly", "age", "gender", "name", "country", "timezone", "birthday", "profilePictureLink", "favoriteGames", "profileColor", "favoriteMusic", "socialLinks", "zodiacName", "flavorText"];
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
			.setAuthor(
				ctx.message.author.username,
				ctx.message.author.displayAvatarURL()
			)
			.setDescription("Please specify a section and value")
			.setColor("RED")
			.addField("**__Available Sections__**", `${availableSections.join(" | ")}`, false);
		if (args.length <= 0) return ctx.reply(embed);

		const section = args.shift()!.toLowerCase();
		const profiletarget = sectionMatches[section as keyof typeof sectionMatches]
			|| section as SocialProfileProperty;
		const inputdata = args.join(" ");

		profile.changeProperty(profiletarget as SocialProfileProperty, inputdata).then(() => {
			ctx.reply(`Your ${profiletarget} has been updated to \`${inputdata}\`.`);
		}).catch(() => {
			const error = new MessageEmbed()
				.setAuthor(
					ctx.message.author.username,
					ctx.message.author.displayAvatarURL()
				)
				.setTitle("Unknown Profile Section")
				.setDescription("Please check to ensure this is a correct profile section. If you think the specified profile section was valid, please make sure the value is too.")
				.setColor("RED");
			ctx.reply({ embeds: [error] });
		});
		return true;
	}
};
