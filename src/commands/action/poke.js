import { Command as C, Embed as E } from "../../groups/ActionCommand.js";
import subCategory from "../../groups/multi/NekoslifeSubcategory.js";

const { Command, Embed } = subCategory(C, E);

export default class PokeCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Poke someone!",
			example: "<@437802197539880970>",
			args: { target: { as: "user", desc: "The person to poke" } }
		});
	}

	async run(bot, message, args) {
		bot.users.fetch(args.target).then(target => {
			const embed = new Embed(this, `${message.author} is poking ${target}`);
			embed.send(message, this.nekoslife.getSFWPoke);
		}).catch(() => { message.reply("Please mention someone :thinking:"); });
	}
};
