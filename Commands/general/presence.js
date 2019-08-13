const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class PresenceCommand extends Command {
	constructor(client) {
		super(client, {
			name: "presence",
			description: "Access the community-driven bot's activity feature"
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		if (args[0] === "view") {
			const embed = new MessageEmbed()
				.setAuthor(
					"Community Driven Bot's Activity  |  Entries Listing",
					bot.user.avatarURL()
				)
				.setDescription(bot.CDBA.toString())
				.setColor("BLUE");
			message.channel.send({ embed });
		} else if (args[0] === "add") {
			if (args.length > 2) {
				args.shift();
				if (
					["watching", "playing", "listening"].includes(args[0].toLowerCase())
				) {
					const res = bot.CDBA.add(
						args.shift(),
						args.join(" "),
						message.author
					);
					if (res instanceof Error) {
						message.channel.send("You already added or voted for this entry.");
					} else {
						message.channel.send(
							res
								? "You asked to add an entry, but someone else already added it, so we made you vote it instead."
								: "Your entry has been added!"
						);
					}
				} else {
					message.channel.send("The action you specified is invalid.");
				}
			} else {
				message.channel.send(
					"You need to specify what you actually want to submit."
				);
			}
		} else if (args[0] === "vote") {
			if (args.length === 2) {
				args.shift();
				const res = bot.CDBA.vote(
					bot.CDBA.getEntryById(args[0]),
					message.author
				);
				if (res instanceof Error) {
					message.channel.send("You already voted for this entry");
				} else {
					message.channel.send("You successfully voted for this entry.");
				}
			} else {
				message.channel.send(
					"You need to correctly specify what you want to vote for."
				);
			}
		} else if (args[0] === "delete") {
			if (!message.author.checkPerms("MODERATOR")) return;
			if (args[1] !== undefined) {
				bot.CDBA.entries.delete(bot.CDBA.getEntryById(args[1]));
				message.channel.send("The specified entry has been deleted.");
			} else {
				message.channel.send("You need to specify an entry ID.");
			}
		} else {
			const { prefix } = message.guild;
			const embed = new MessageEmbed()
				.setAuthor("Community-Driven Bot's Activity", bot.user.avatarURL())
				.setDescription(
					`The community-driven bot's activity is a feature where Aldebaran users can choose and vote for a sentence which will be sometimes displayed in the bot's presence (the one saying "**Listening to** Spotify"). This choice is effective for an hour and will be shown among the default sentences, this means a vote will occur each hour to decide on a new setence. To view current entries, use \`${prefix}presence view\`, to add one, use \`${prefix}presence add\` and to vote for one use \`${prefix}presence vote <Entry ID>\`.\n\nThis feature supports variables. They allow you make so your sentence can change a bit over time. For example one default sentence shows "**Watching** ${
						bot.guilds.size
					} servers playing", the number of servers is a variable, but the original sentence is "**Watching** {NSERVERS} servers playing" where "NSERVERS" is the variable, and you can use that for your own sentences. The available variables are listed below, if you need something not available, please suggest it using &suggest describing it as a variable for this feature.\n\nWhen submitting your entries, make sure to use good sense, it must not be disrespectful towards anyone nor break the Discord ToS. All entries are moderated, if yours is unappropriate, you may be banned from using the bot, thanks for your understanding.`
				)
				.addField(
					"Available Variables",
					"`**{NSERVERS}**` - Number of servers the bot is in\n`**{NUSERS}**` - Number of users the bot sees\n`**{VERSION}**` - The bot's version",
					true
				)
				.addField("Availale Actions", "Playing\nWatching\nListening to", true)
				.setColor("BLUE");
			message.channel.send({ embed });
		}
	}
};
