const Client = require("nekos.life");

module.exports = Origin => ({
	Command: class NekoSubcategory extends Origin.Command {
		constructor(...args) {
			super(...args);
			this.nekoslife = new Client();
		}
	},
	Embed: class NewEmbed extends Origin.Embed {
		constructor(command, description) {
			super(command);
			this.setDescription(description);
			this.setFooter("Powered by nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4");
		}

		send(message, endpoint) {
			endpoint().then(data => {
				this.setImage(data.url);
				message.channel.send({ embed: this });
			});
		}
	}
});
