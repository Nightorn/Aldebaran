const { MessageEmbed } = require("discord.js");
const { Command } = require("../../groups/Command");

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Shows your Aldebaran's profile",
			usage: "UserMention|UserID",
			example: "320933389513523220",
			args: { user: { as: "user" } }
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		bot.users.fetch(args.user || message.author.id).then(async user => {
			const profile = await user.getProfile();
			if (profile.existsInDB) {
				let userDetails = "";
				if (profile.name) userDetails += `**Name**: ${profile.name}\n`;
				if (profile.country) userDetails += `**Country**: ${profile.country}\n`;
				if (profile.timezone) userDetails += `**Timezone**: ${profile.timezone}\n`;
				if (profile.birthday) userDetails += `**Birthday**: ${profile.birthday}\n`;
				if (profile.zodiacName) userDetails += `**Zodiac Sign**: ${profile.zodiacName}\n`;
				if (profile.age) userDetails += `**Age**: ${profile.age}\n`;
				if (profile.gender) userDetails += `**Gender**: ${profile.gender}\n`;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}'s Profile`, user.avatarURL())
					.setColor(profile.profileColor)
					.setFooter(`${/yes/i.test(profile.dmFriendly) ? "My DMs are open." : "My DMs are not open."} | Currently has ${profile.fortunePoints} Fortune points.`);
				if (profile.profilePictureLink) embed.setImage(`${profile.profilePictureLink}`);
				if (profile.flavorText)
					embed.setDescription(profile.flavorText);
				if (userDetails !== "") embed.addField("__**User Details**__", userDetails);
				if (profile.aboutMe) embed.addField("__**About me**__", profile.aboutMe);
				if (profile.favoriteGames) embed.addField("__**Favorite Game(s)**__", profile.favoriteGames);
				if (profile.favoriteMusic) embed.addField("__**Favorite Music(s)/Artist(s)**__", profile.favoriteMusic);
				if (profile.socialLinks) embed.addField("__**Social Network(s) Link**__", profile.socialLinks);
				message.channel.send({ embed });
			} else {
				const embed = new MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL())
					.setTitle("No Profile Found")
					.setDescription(`Please use \`${message.guild.prefix}setprofile name <yournamehere>\` to create your profile`)
					.setColor("RED");
				message.channel.send({ embed });
			}
		}).catch(() => {
			message.reply("the user specified does not exist.");
		});
	}
};
