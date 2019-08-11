const { Command } = require("./GeneralCategory");

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
};
