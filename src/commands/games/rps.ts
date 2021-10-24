import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { Command } from "../../groups/GamesCommand.js";
import MessageContext from "../../structures/aldebaran/MessageContext.js";
import AldebaranClient from "../../structures/djs/Client.js";

export default class RpsCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, { description: "Rock. Paper. Scissors!" });
	}

	// eslint-disable-next-line class-methods-use-this
	run(ctx: MessageContext) {
		const args = ctx.args as string[];
		if (args[0] !== undefined) {
			if (ctx.message.mentions.users.size > 0) {
				const target = ctx.message.mentions.users.first()!;
				if (target.id === ctx.client.user.id) {
					ctx.reply("Sorry, but I don't want to play right now...");
				} else if (!ctx.message.author.bot) {
					const introEmbed = new MessageEmbed()
						.setAuthor("Rock. Paper. Scissors.", ctx.client.user.avatarURL()!)
						.setDescription(`**The person you want to play with has to accept your invitation by clicking the emoji on this message.**\nHere is how this game is going to work with you: once the other have accepted the invitation, **you will both receive a message** in your private messages from ${ctx.client.name}. You will have to **type either \"rock\", either \"paper\", either \"scissors\"** within 15 seconds (you can also type the first letter of each if you are too lazy to type the full word). **The results will be sent to the channel where the game has begun.**`)
						.setColor(this.color);
					ctx.reply(introEmbed).then(msg => {
						msg.react("✅");
						const reactionsFilter = (reaction: MessageReaction, user: User) => reaction.emoji.name === "✅" && user.id === target.id;
						const messagesFilter = (msgTest: Message) => ["r", "p", "s", "rock", "paper", "scissors"]
							.includes(msgTest.content);
						msg.awaitReactions({ filter: reactionsFilter, time: 60000, max: 1 })
							.then(async collected => {
								if (collected.size !== 0) {
									ctx.reply("The game will begin shortly.");
									ctx.message.author.send(
										"Please type your choice here. \"rock\" or \"r\", \"paper\" or \"p\", or \"scissors\" or \"s\"."
									);
									target.send(
										"Please type your choice here. \"rock\" or \"r\", \"paper\" or \"p\", or \"scissors\" or \"s\"."
									);
									const options = { filter: messagesFilter, time: 15000, max: 1 };
									const authorDM = await ctx.message.author.createDM();
									const targetDM = await target.createDM();
									Promise.all([
										authorDM.awaitMessages(options),
										targetDM.awaitMessages(options)
									]).then(([authorPlay, targetPlay]) => {
										if (authorPlay.size && targetPlay.size) {
											const win = {
												r: "s",
												p: "r",
												s: "p"
											};
											const words = {
												r: "rock",
												p: "paper",
												s: "scissors"
											};
											const authorResponse = authorPlay
												.first()!.content[0] as keyof typeof win;
											const targetResponse = targetPlay
												.first()!.content[0] as keyof typeof win;
											if (authorResponse !== targetResponse) {
												if (win[authorResponse] === targetResponse) {
													const embed = new MessageEmbed()
														.setAuthor(`${ctx.message.author.username} won!`, ctx.message.author.displayAvatarURL())
														.setDescription(`They played ${words[authorResponse]}, while **${target.username}** played ${words[targetResponse]}.`)
														.setColor(this.color);
													ctx.reply(embed);
												} else if (win[targetResponse] === authorResponse) {
													const embed = new MessageEmbed()
														.setAuthor(`${target.username} won!`, target.displayAvatarURL())
														.setDescription(`They played ${words[targetResponse]}, while ${ctx.message.author.username} played ${words[authorResponse]}.`)
														.setColor(this.color);
													ctx.reply(embed);
												}
											} else {
												ctx.reply(`Both users played ${targetResponse}, retry!`);
											}
										}
									});
								} else {
									ctx.reply("the person you want to play with has not accepted your invitation.");
								}
							}).catch(error => {
								ctx.reply("An error occured with this RPS game.");
								throw error;
							});
					});
				} else {
					ctx.reply(`You cannot play against a bot that is not ${ctx.client.name}.`);
				}
			} else {
				ctx.reply("You have to ping a valid user in order to play this game.");
			}
		} else {
			ctx.reply("You can choose to play against a bot or against someone else by pinging him. But you need to choose if you want to play!");
		}
	}
};
