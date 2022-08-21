import SettingsCommand from "../../groups/SettingsCommand.js";
import MessageContext from "../../structures/contexts/MessageContext.js";
import Embed from "../../structures/Embed.js";
import DiscordUser from "../../structures/models/DiscordUser.js";
import RevoltUser from "../../structures/models/RevoltUser.js";
import User from "../../structures/models/User.js";

function associatedAccount(u: DiscordUser | RevoltUser) {
	const id = u instanceof DiscordUser ? u.snowflake : u.id;
	return {
		id,
		createdAt: u.getDataValue("createdAt"),
		updatedAt: u.getDataValue("updatedAt")
	};
}

export default class MydataCommand extends SettingsCommand {
	constructor() {
		super({
			description: "Displays your Aldebaran user metadata and more"
		});
	}

	async run(ctx: MessageContext) {
		const userId = ctx.author.base.id;
		const discordAccs = await DiscordUser.findAll({ where: { userId } });
		const revoltAccs = await RevoltUser.findAll({ where: { userId } });

		let associated = "";
		discordAccs.forEach(user => {
			associated += `**Discord** (\`${user.snowflake}\`)\n`;
		});
		revoltAccs.forEach(user => {
			associated += `**Revolt** (\`${user.id}\`)\n`;
		});

		const user = await User.findByPk(userId, { include: { all: true } }) as User;
		const json = JSON.stringify({
			id: userId,
			permissions: user.permissions,
			createdAt: user.getDataValue("createdAt"),
			updatedAt: user.getDataValue("updatedAt"),
			profile: user.profile,
			settings: user.settings,
			associatedDiscordAccounts: discordAccs.map(associatedAccount),
			associatedRevoltAccounts: revoltAccs.map(associatedAccount)
		}, null, 4);
		ctx.author.send(`Here is your data.\n\`\`\`json\n${json}\n\`\`\``);

		const embed = new Embed()
			.setTitle("Aldebaran User Metadata")
			.setDescription(`*Your data has been sent into your DMs for privacy reasons.*\n**User ID**: \`${userId}\``)
			.addField("Associated accounts", associated);
		ctx.reply(embed);
	}
}
