const { Command, Embed } = require("./Command");

module.exports.Command = class OsuCategory extends Command {
	constructor(client, metadata) {
		super(client, {
			...metadata,
			cooldown: {
				group: "osu",
				amount: 60,
				resetInterval: 60000
			}
		});
		this.category = "osu!";
		this.color = "#ff66aa";
	}

	registerCheck() {
		return this.client.config.apikeys["osu!"] !== undefined
			&& this.client.config.apikeys["osu!"] !== null;
	}
};

module.exports.Embed = Embed;
