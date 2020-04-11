const { MessageEmbed } = require("discord.js");

module.exports = BaseTextChannel => class TextChannel extends BaseTextChannel {
	constructor(client, data) {
		super(client, data);
		this.drpgRecentADVs = new Map();

		setInterval(
			drpgRecentADVs => {
				for (const [username, adventure] of drpgRecentADVs) {
					if (adventure.date + 300000 < Date.now())
						drpgRecentADVs.delete(username);
				}
			},
			60000,
			this.drpgRecentADVs
		);
	}

	addAdventure(user) {
		this.drpgRecentADVs.set(user.username, {
			user,
			date: Date.now()
		});
	}

	error(type, desc, value) {
		const errors = {
			API_ERROR: () => "This API has thrown an error.",
			API_RATELIMIT: () => "We have hit the ratelimit of (the endpoint of) this API.",
			CUSTOM: res => res,
			IMPOSSIBLE: () => "You are asking the impossible",
			INCORRECT_CMD_USAGE: () => "This command has been used incorrectly.",
			INVALID_USER: () => "The user specified does not exist.",
			MISSING_ARGS: () => "Some arguments are missing.",
			NOT_FOUND: res => `The requested ${res || "resource"} has not been found.`,
			UNALLOWED_OPERATION: () => "You are not allowed to do this.",
			UNALLOWED_COMMAND: () => "You are not allowed to use this command.",
			UNEXPECTED_BEHAVIOR: () => "Something went wrong.",
			WRONG_USAGE: () => "You are doing something wrong."
		};
		const title = errors[type] !== undefined ? errors[type](value) : "An error has occured.";
		const embed = new MessageEmbed()
			.setTitle(title)
			.setColor("RED");
		if (type === "UNEXPECTED_BEHAVIOR")
			embed.setDescription(`${desc}\nPlease contact the developers or fill a bug report with \`${this.guild.prefix}bugreport\`.`);
		else if (type === "INVALID_USER")
			embed.setDescription("The user ID you have supplied is invalid, or the user you have mentionned does not exist. Make sure your user ID or your mention is correct.");
		else embed.setDescription(desc);
		this.send({ embed });
	}
};
