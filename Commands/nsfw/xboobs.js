const { MessageEmbed } = require("discord.js");
const Client = require("nekos.life");
const NSFWCommand = require("../../structures/commands/NSFWCommand");

module.exports = class XBoobsCommand extends NSFWCommand {
  constructor(client) {
    super(client, {
      name: "xboobs",
      description: "Displays a hentai picture or GIF showing boobs"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(bot, message) {
    const neko = new Client();
    const data = await neko.getNSFWBoobs();
    const embed = new MessageEmbed()
      .setAuthor("NSFW  |  Boobs", bot.user.avatarURL())
      .setDescription(`${message.author} You want boobs? I give you... BOOBS!`)
      .setImage(data.url)
      .setColor("#A55000")
      .setFooter("Powered by nekos.life");
    message.channel.send({ embed });
  }
};
