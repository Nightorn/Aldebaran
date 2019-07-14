const { MessageEmbed } = require("discord.js");
const Client = require("nekos.life");
const NSFWCommand = require("../../structures/commands/NSFWCommand");

module.exports = class XLesbianCommand extends NSFWCommand {
  constructor(client) {
    super(client, {
      name: "xlesbian",
      description: "Displays a lesbian hentai picture or GIF"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(bot, message) {
    const neko = new Client();
    const data = await neko.getNSFWLesbian();
    const embed = new MessageEmbed()
      .setAuthor(`NSFW  |  Lesbian`, bot.user.avatarURL())
      .setDescription(`${message.author}  LEZ be Honest!`)
      .setImage(data.url)
      .setFooter("Powered by nekos.life");
    message.channel.send({ embed });
  }
};
