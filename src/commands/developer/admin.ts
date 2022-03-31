import MessageContext from "../../structures/contexts/MessageContext.js";
import Command from "../../groups/DeveloperCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";

import mod from "./admin/mod.js";
import restart from "./admin/restart.js";
import serverlist from "./admin/serverlist.js";
import setperm from "./admin/setperm.js";
import timeout from "./admin/timeout.js";
import view from "./admin/view.js";

export default class AdminCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description: "Admin Portal Command",
			perms: { aldebaran: ["EDIT_USERS"] },
			platforms: ["DISCORD"]
		});
		this.registerSubcommands(
			mod,
			restart,
			serverlist,
			setperm,
			timeout,
			view
		);
	}

	// eslint-disable-next-line class-methods-use-this
	async run(ctx: MessageContext) {
		const embed = this.createEmbed(ctx)
			.setTitle("Warning")
			.setDescription("The admin action specified is invalid.")
			.setColor("ORANGE");
		ctx.reply(embed);
	}
}
