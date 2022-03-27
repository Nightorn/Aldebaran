import { ColorResolvable, MessageEmbed } from "discord.js";
import { Command } from "../../groups/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

export default class ProfileCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Shows your Aldebaran social profile",
			example: "320933389513523220",
			args: { user: {
				as: "user",
				desc: "The user whose social profile you want to see",
				optional: true
			} }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as { user: string };
		ctx.client.customUsers.fetch(args.user || ctx.author.id)
			.then(async user => {
				const profile = (await user.profile()).profile;
				if (profile.name) {
					let userDetails = "";
					if (profile.name) userDetails += `**Name**: ${profile.name}\n`;
					if (profile.country) userDetails += `**Country**: ${profile.country}\n`;
					if (profile.timezone) userDetails += `**Timezone**: ${profile.timezone}\n`;
					if (profile.birthday) userDetails += `**Birthday**: ${profile.birthday}\n`;
					if (profile.zodiacName) userDetails += `**Zodiac Sign**: ${profile.zodiacName}\n`;
					if (profile.age) userDetails += `**Age**: ${profile.age}\n`;
					if (profile.gender) userDetails += `**Gender**: ${profile.gender}\n`;
					const embed = new MessageEmbed()
						.setAuthor(`${user.username}'s Profile`, user.user.displayAvatarURL())
						.setColor(profile.profileColor as ColorResolvable);
					if (profile.dmFriendly) embed.setFooter(`${/yes/i.test(profile.dmFriendly) ? "My DMs are open." : "My DMs are not open."} | Currently has ${profile.fortunePoints} Fortune points.`);
					if (profile.profilePictureLink) embed.setImage(`${profile.profilePictureLink}`);
					if (profile.flavorText)
						embed.setDescription(profile.flavorText);
					if (userDetails !== "") embed.addField("__**User Details**__", userDetails);
					if (profile.aboutMe) embed.addField("__**About me**__", profile.aboutMe);
					if (profile.favoriteGames) embed.addField("__**Favorite Game(s)**__", profile.favoriteGames);
					if (profile.favoriteMusic) embed.addField("__**Favorite Music(s)/Artist(s)**__", profile.favoriteMusic);
					if (profile.socialLinks) embed.addField("__**Social Network(s) Link**__", profile.socialLinks);
					ctx.reply(embed);
				} else {
					const embed = new MessageEmbed()
						.setAuthor(
							ctx.author.username,
							ctx.author.avatarURL
						)
						.setTitle("No Profile Found")
						.setDescription(`Please use \`${ctx.prefix}setprofile name <yournamehere>\` to create your profile`)
						.setColor("RED");
					ctx.reply(embed);
				}
			}).catch(() => {
				ctx.reply("the specified user does not exist.");
			});
	}
};
