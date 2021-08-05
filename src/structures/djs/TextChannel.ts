import { MessageEmbed, TextChannel as DJSTextChannel } from "discord.js";
import { ErrorString, Error as MError } from "../../utils/Constants.js";
import Guild from "./Guild.js";
import User from "./User.js";

export default class TextChannel extends DJSTextChannel {
	drpgRecentADVs: Map<string, { user: User, date: number }>;
	guild!: Guild;

	constructor(guild: Guild, data: any) {
		super(guild, data);
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

	addAdventure(user: User) {
		this.drpgRecentADVs.set(user.username, {
			user,
			date: Date.now()
		});
	}

	error(type: ErrorString, desc?: string, value?: string) {
		const title = MError[type] !== undefined ? MError[type](value!) : "An error has occured.";
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
