const { MessageEmbed } = require("discord.js");
const os = require("os");
const Command = require("../../structures/commands/Command");

module.exports = class BUStats extends Command {
  constructor(client) {
    super(client, {
      name: "bustats",
      description: "Displays the bot usage statistics since the last start"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(bot, message) {
    const processMemory = process.memoryUsage().heapTotal;
    const mem = Math.round((100 * processMemory) / 1048576) / 100;
    const memTTL = Math.round(100 * (mem + os.freemem() / 1048576)) / 100;
    const memPRC = Math.round((10 * (mem * 100)) / memTTL) / 10;

    console.log(os.loadavg());
    const cpu = Math.round(100 * (os.loadavg()[0] * 25)) / 100;

    const getTimeString = timeInMs => {
      const days = Math.floor(timeInMs / 86400000);
      let hours = Math.floor((timeInMs / 3600000) % 60);
      let minutes = Math.floor((timeInMs / 60000) % 60);
      let seconds = Math.floor((timeInMs / 1000) % 60);

      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${days} day(s), ${hours}:${minutes}:${seconds}`;
    };

    const embed = new MessageEmbed()
      .setAuthor(`Aldebaran  |  Bot Statistics`, bot.user.avatarURL())
      .setDescription(
        "On this page multiple informations about Aldebaran are shown, mainly the used ressources and the global usage statistics."
      )
      .addField(`Memory Usage (${memPRC}%)`, `${mem} MB / ${memTTL} MB`, true)
      .addField("System CPU Usage", `${cpu}%`, true)
      .addField("Uptime", getTimeString(bot.uptime), true)
      .addField(
        "Active Users",
        Number.formatNumber(bot.databaseCounts.users),
        true
      )
      .addField(
        "Active Servers",
        Number.formatNumber(bot.databaseCounts.guilds),
        true
      )
      .setColor(this.color);
    message.channel.send({ embed });
  }
};
