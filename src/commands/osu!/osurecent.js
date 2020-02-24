const Nodesu = require("nodesu");
const ojsama = require("ojsama");
const ppv2Results = require("../../utils/osu!/ppv2Results");
const { Command, Embed } = require("../../groups/OsuCommand");

module.exports = class OsubestCommand extends Command {
	constructor(client) {
		super(client, {
			description: "Displays the most recent play of the specified user",
			help: "Run the command with the osu! username of the user you want to see the stats of, or maybe their user ID and the according mode (osu, mania, taiko, ctb).\n**Supported Modes** : **osu!standard** : (by default), --osu; **osu!taiko**: --taiko; **osu!ctb**: --ctb; **osu!mania**: --mania.",
			usage: "Username/ID",
			example: "Ciborn",
			aliases: ["osurs"]
		});
	}

	// eslint-disable-next-line class-methods-use-this
	run(bot, message, args) {
		const client = new Nodesu.Client(bot.config.apikeys["osu!"]);
		const ranks = {
			SH: "S+",
			X: "SS",
			XH: "SS+"
		};
		let mode = message.author.settings.osuMode || "osu";
		for (const element of args) { if (element.indexOf("--") === 0) mode = element.replace("--", ""); }
		if (Nodesu.Mode[mode] !== undefined) {
			client.user.getRecent(args[0] || message.author.settings.osuUsername,
				Nodesu.Mode[mode], 1)
				.then(async data => {
					const user = await client.user
						.get(data[0].user_id, Nodesu.Mode[mode]);
					const f = number => String(number).length === 1 ? `0${number}` : number;
					const getDate = time => {
						const date = new Date(time);
						return `${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())} at ${f(date.getHours())}:${f(date.getMinutes())} UTC`;
					};
					const map = (await client.beatmaps.getByBeatmapId(
						data[0].beatmap_id, Nodesu.Mode[mode], 1, true,
						ojsama.modbits.from_string(data[0].enabled_mods)
					))[0];
					let score = null;
					if (mode === "osu") {
						score = await ppv2Results(data[0].beatmap_id,
							data[0].enabled_mods, Number(data[0].maxcombo), undefined,
							Number(data[0].countmiss), Number(data[0].count300),
							Number(data[0].count100), Number(data[0].count50));
					}
					const mods = ojsama.modbits.string(Number(data[0].enabled_mods));
					const embed = new Embed(this)
						.setAuthor(`${user.username}  |  Most Recent osu!${mode !== "osu" ? mode : ""} Play`,
							`https://a.ppy.sh/${user.user_id}`,
							`https://osu.ppy.sh/users/${user.user_id}`)
						.setTitle(`__${map.artist} - **${map.title}**__ [${map.version}] (${map.creator}) [**${Number(map.difficultyrating).toFixed(2)}★${mods !== "" ? ` +${mods}` : ""}]**`)
						.setURL(`https://osu.ppy.sh/b/${data[0].beatmap_id}`)
						.setDescription(`**\`[${ranks[data[0].rank] || data[0].rank}]\`** (${mode === "osu" ? `**${score.accuracy}%**, ` : ""}**x${data[0].maxcombo}**${["osu", "ctb"].includes(mode) ? `/${map.max_combo}` : ""}) -${mode === "osu" ? ` **${score.pp.toFixed(2)}pp** -` : ""} \`${data[0].count300}\` 300, \`${data[0].count100}\` 100, \`${data[0].count50}\` 50, \`${data[0].countmiss}\` miss${data[0].rank === "F" ? `\n**${((Number(data[0].count300) + Number(data[0].count100) + Number(data[0].count50) + Number(data[0].countmiss)) * 100 / (Number(map.count_normal) + Number(map.count_slider) + Number(map.count_spinner))).toFixed(2)}%** Map Completion` : ""}`)
						.setFooter(`Score set on ${getDate(data[0].date)}.`);
					message.channel.send({ embed });
				}).catch(() => {
					message.reply(
						"the user you specified does not exist, or at least in the mode specified."
					);
				});
		} else {
			message.reply(
				"the mode you specified does not exist. Check `&?osu` for more informations."
			);
		}
	}
};
