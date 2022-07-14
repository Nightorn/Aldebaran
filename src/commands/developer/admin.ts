import MessageContext from "../../structures/contexts/MessageContext.js";
import Command from "../../groups/DeveloperCommand.js";

import mod from "./admin/mod.js";
import serverlist from "./admin/serverlist.js";
import setperm from "./admin/setperm.js";
import view from "./admin/view.js";

export default class AdminCommand extends Command {
	constructor() {
		super({
			description: "Admin Portal Command",
			perms: { aldebaran: ["EDIT_USERS"] },
			platforms: ["DISCORD"]
		});
		this.registerSubcommands(
			mod,
			serverlist,
			setperm,
			view
		);
	}

	async run(ctx: MessageContext) {
		const embed = this.createEmbed(ctx)
			.setTitle("Warning")
			.setDescription("The admin action specified is invalid.")
			.setColor("ORANGE");
		ctx.reply(embed);
	}
}
