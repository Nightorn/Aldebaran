const { MessageEmbed } = require("discord.js");

exports.run = (bot, message) => {
  let adminMentions = "";
  for (const [id, member] of Object.entries(bot.config.aldebaranTeam))
    if (member.acknowledgements.includes("DEVELOPER"))
      adminMentions += `<@${id}>\n`;
  const minutesUptime = `${String(
    Math.floor((bot.uptime % 3600000) / 60000)
  )}m`;
  const embed = new MessageEmbed()
    .setAuthor(bot.user.username, bot.user.avatarURL())
    .setTitle(`Version ${bot.version}`)
    .addField("__Developers__", adminMentions, true)
    .addField(
      "__Statistics__",
      `**Servers** : ${bot.guilds.size}\n**Channels** : ${
        bot.channels.size
      }\n**Users** : ${bot.users.size}`,
      true
    )
    .addField(
      "__Resources__",
      `**Memory Usage** : ${Math.round(
        (100 * process.memoryUsage().heapTotal) / 1000000
      ) / 100} MB\n**Uptime** : ${Math.floor(bot.uptime / 3600000)}h${
        minutesUptime.length === 2 ? `0${minutesUptime}` : minutesUptime
      }`,
      true
    )
    .addField(
      "__Powered By__",
      `VPS Host **DigitalOcean**\nEnvironment **Node.js** v10.16.0\nAPI Library **discord.js** v12.0.0-dev`,
      true
    )
    .addField(
      "__Note__",
      `Aldebaran uses but is not affiliated with the following:\n - **[DiscordRPG](https://discorddungeons.me)** : [Discord Server](https://discordapp.com/invite/xy3UbVb), support@discorddungeons.me\n - **[TheCatAPI](https://thecatapi.com)** : aden.forshaw@gmail.com\n - **[Dog API](https://dog.ceo/)** : dog@dog.ceo\n - **[nekos.life](https://nekos.life/)** : subspaceinteractivestudios@gmail.com\n - **[Giphy](https://giphy.com)** : [Support](https://support.giphy.com/hc/en-us/requests/new)\n - **[osu!](https://osu.ppy.sh)** : support@ppy.sh;\n - **[Some Random Api](https://some-random-api.ml/)**`
    )
    .setFooter(`The prefix in this guild is "${message.guild.prefix}".`)
    .setThumbnail(message.guild.iconURL())
    .setColor(`GREEN`);
  message.channel.send({ embed });
};

exports.infos = {
  category: "General",
  description: "Displays Into About Aldebaran",
  usage: "`&info`",
  example: "`&info`"
};
