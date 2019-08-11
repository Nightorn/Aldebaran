const { MessageEmbed } = require("discord.js");
const { Command } = require("../../structures/categories/GeneralCategory");

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: "invite",
			description: "Displays the bot and server invites"
		});
	}

	run(bot, message) {
		const embed = new MessageEmbed()
			.setTitle("Invite Links")
			.setDescription("[__**Add Bot To Your Server**__](https://discordapp.com/api/oauth2/authorize?client_id=437802197539880970&permissions=126016&scope=bot)\n*Let the fun commands start*\n[__**Join Support Server**__](https://discord.gg/3x6rXAv)\n*Stay updated with the newest features and commands*")
			.setColor(this.color);
		message.channel.send({ embed });
	}
};
