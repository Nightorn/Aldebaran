const { MessageEmbed } = require("discord.js");

exports.run = (bot, message, args) => {
  const level = parseInt(args[0], 10);
  const xpboostperc = args[1] !== undefined ? parseInt(args[1], 10) : 0;
  if (!Number.isNaN(level) && !Number.isNaN(xpboostperc)) {
    const formula1 = Math.floor((1249297 * (level * level)) / 61200000);
    const formula2 = Math.floor((1778779 * level) / 306000);
    const formula3 = Math.floor(11291 / 51);
    const finalnoring = Math.floor(
      ((formula1 + formula2 + formula3) / 1.5) * (1 + xpboostperc / 100)
    );
    const finalxpring = Math.floor(
      ((formula1 + formula2 + formula3) / 1.5) * (1.25 + xpboostperc / 100)
    );
    const finaldonorring = Math.floor(
      (formula1 + formula2 + formula3) * (1 + xpboostperc / 100)
    );

    const embed = new MessageEmbed()
      .setTitle(`Average Xp Kill At Lvl. ${level}`)
      .setAuthor(message.author.username, message.author.avatarURL())
      .setColor(0x00ae86)
      .setDescription(
        `**Please note all infomation about XP are estimations!**\n*Estimations are based on full XP boost build, while grinding dynamobs.*\nYou have a +${xpboostperc}% XP Boost on your equipment.`
      )
      .addField(
        "**With a ring of XP (x1.25)**",
        `Around ${finalxpring} XP per kill`,
        true
      )
      .addField(
        "**With a donor ring of XP (x1.5)**",
        `Around ${finaldonorring} XP per kill`,
        true
      )
      .addField(
        "**Without a ring of XP**",
        `Around ${finalnoring} XP per kill`
      );
    message.channel.send({ embed });
  } else {
    message.reply(
      "You need to specify a level and the XP Boost percentage the used equipment has (if you want to take it in account)."
    );
  }
};

exports.infos = {
  category: "DRPG",
  description: "Displays estimated xp per kill at a certain level.",
  usage: "&xp `<level> <xpboost bonus percentage>`",
  example: "&xp `600 6`"
};
