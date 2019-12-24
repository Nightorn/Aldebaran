const origin = require("../../structures/categories/ActionCategory");
const { Command, Embed } = require("../../structures/categories/multi/NekoslifeSubcategory")(origin);

module.exports = class PokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "poke",
			description: "Poke someone!",
			usage: "UserMention",
			example: "<@437802197539880970>"
		});
	}

	async run(bot, message) {
		if (message.mentions.users.first()) {
			const target = message.mentions.users.first();
			const embed = new Embed(this,
				`${message.author} is poking ${target}`);
			embed.send(message, this.nekoslife.getSFWPoke);
		} else {
			message.reply("Please mention someone :thinking:");
		}
	}
};
