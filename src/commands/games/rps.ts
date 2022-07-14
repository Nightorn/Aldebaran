import { MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import Command from "../../groups/GamesCommand.js";
import DiscordContext from "../../structures/contexts/DiscordContext.js";
import DiscordMessageContext from "../../structures/contexts/DiscordMessageContext.js";
import DiscordSlashMessageContext from "../../structures/contexts/DiscordSlashMessageContext.js";

const win = {
	"🪨": "✂️",
	"🧻": "🪨",
	"✂️": "🧻"
};

const words = {
	"🪨": "rock",
	"🧻": "paper",
	"✂️": "scissors"
};

export default class RpsCommand extends Command {
	constructor() {
		super({ 
			description: "Rock. Paper. Scissors!",
			args: {
				user: { as: "user", desc: "The user you want to play with" }
			},
			platforms: ["DISCORD", "DISCORD_SLASH"]
		});
	}

	async run(ctx: DiscordContext) {
		const args = ctx.args as { user: string };
		const target = await ctx.fetchUser(args.user);

		if (target.user.bot) {
			return ctx.reply("You can't play this game against a bot.");
		}

		const introEmbed = this.createEmbed(ctx)
			.setAuthor({
				name: "Rock. Paper. Scissors.",
				iconURL: ctx.author.avatarURL
			})
			.setDescription("The person you want to play with has to accept your invitation by clicking the **Accept** button on this message.\nHere is how this game is going to go: once your opponent accepts your invitation, three buttons will appear; choose the winning one. The results will be sent to the channel where the game has begun.");
		
		const acceptButton = new MessageButton()
			.setStyle("SUCCESS")
			.setLabel("Accept")
			.setCustomId("ok");
		const row = new MessageActionRow().setComponents([acceptButton]);
		const opt = { embeds: [introEmbed], components: [row] };
		const msg = ctx instanceof DiscordSlashMessageContext
			? await ctx.reply(opt, false, true)
			: await (ctx as DiscordMessageContext).reply(opt);

		const filter = (i: MessageComponentInteraction) => i.user.id === target.id;
		msg.awaitMessageComponent({ filter }).then(async interaction => {
			interaction.deferUpdate();

			const startEmbed = this.createEmbed(ctx)
				.setAuthor({
					name: "Rock. Paper. Scissors.",
					iconURL: ctx.author.avatarURL
				})
				.setDescription("And the fun begins now! Use the buttons below, and discover the winner once both of you have made their choice!");
			
			const emojiButton = (emoji: string) => new MessageButton()
				.setStyle("SECONDARY")
				.setEmoji(emoji)
				.setCustomId(emoji);
			const [rock, paper, scissors] = ["🪨", "🧻", "✂️"].map(emojiButton);
			const actionRow = new MessageActionRow()
				.setComponents([rock, paper, scissors]);
			
			const startOpt = { embeds: [startEmbed], components: [actionRow] };
			const game = ctx instanceof DiscordSlashMessageContext
				? await ctx.followUp(startOpt, false, true)
				: await (ctx as DiscordMessageContext).reply(startOpt);

			const [authorPlay, targetPlay] = await Promise.all([
				game.awaitMessageComponent({ filter: i => i.user.id === ctx.author.id }),
				game.awaitMessageComponent({ filter: i => i.user.id === target.id })
			]);

			authorPlay.deferUpdate();
			targetPlay.deferUpdate();
			const authorResponse = authorPlay.customId as keyof typeof win;
			const targetResponse = targetPlay.customId as keyof typeof win;

			let content;
			if (authorResponse === targetResponse) {
				content = `Both users played ${targetResponse}, retry!`;
			} else if (win[authorResponse] === targetResponse) {
				content = this.createEmbed(ctx)
					.setAuthor({
						name: `${ctx.author.username} won!`,
						iconURL: ctx.author.avatarURL
					})
					.setDescription(`They played ${words[authorResponse]}, while **${target.username}** played ${words[targetResponse]}.`);
			} else {
				content = this.createEmbed(ctx)
					.setAuthor({
						name: `${target.username} won!`,
						iconURL: target.avatarURL
					})
					.setDescription(`They played ${words[targetResponse]}, while ${ctx.author.username} played ${words[authorResponse]}.`);
			}

			ctx instanceof DiscordSlashMessageContext
				? ctx.followUp(content, false, true)
				: ctx.reply(content);
		}).catch(error => {
			ctx.reply("An error occured with this RPS game.");
			throw error;
		});
	}
}
