import { ColorResolvable, MessageEmbed } from "discord.js";
import moment from "moment";
import Command from "../../groups/Command.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import { zodiacName } from "../../utils/Methods.js";

export default class ProfileCommand extends Command {
	constructor(client: Client) {
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
		ctx.client.users.fetchDiscord(args.user || ctx.author.id)
			.then(async user => {
                const profile = await user.base.getProfile();
				if (profile.name) {
                    const timezone = user.base.getSetting("timezone");
					let userDetails = "";
					if (profile.name) userDetails += `**Name**: ${profile.name}\n`;
					if (profile.country) userDetails += `**Country**: ${profile.country}\n`;
                    if (timezone) userDetails += `**Timezone**: ${timezone}\n`;
					if (profile.birthday) {
                        const age = moment().diff(moment(profile.birthday), "years");
                        const zodiac = zodiacName(profile.birthday);
                        userDetails += `**Birthday**: ${profile.birthday}\n`;
                        userDetails += `**Age**: ${age}\n**Zodiac Sign**: ${zodiac}\n`;
                    }
					if (profile.gender) userDetails += `**Gender**: ${profile.gender}\n`;
					const embed = new MessageEmbed()
						.setAuthor({
							name: `${user.username}'s Profile`,
							iconURL: user.avatarURL
						})
						.setColor(profile.profileColor as ColorResolvable);
					if (profile.dmFriendly) embed.setFooter({
						text: `${profile.dmFriendly ? "My DMs are open." : "My DMs are not open."} | Currently has ${profile.fortunePoints} Fortune points.`
					});
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
					const embed = this.createEmbed(ctx)
						.setTitle("No Profile Found")
						.setDescription(`Please use \`${ctx.prefix}setprofile name <yournamehere>\` to create your profile`)
						.setColor("RED");
					ctx.reply(embed);
				}
			}).catch(() => {
				ctx.reply("the specified user does not exist.");
			});
	}
}
