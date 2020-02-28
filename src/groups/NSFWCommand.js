const { Command, Embed } = require("./Command");

module.exports.Command = class NSFWCategory extends Command {
	constructor(client, metadata) {
		super(client, metadata);
		this.category = "NSFW";
		this.color = "#ff66aa";
		this.hidden = true;
	}

	execute(message) {
		if (!message.channel.nsfw) throw new Error("NOT_NSFW_CHANNEL");
		super.execute(message);
	}
};

module.exports.Embed = Embed;
