const { MessageEmbed } = require("discord.js");
const Client = require("nekos.life");
const NSFWCommand = require("../../structures/commands/NSFWCommand");

module.exports = class XNekoCommand extends NSFWCommand {
  constructor(client) {
    super(client, {
      name: "xneko",
      description: "Displays a hentai neko picture or GIF"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(bot, message) {
    const neko = new Client();
    const data = await neko.getNSFWNekoGif();
    const embed = new MessageEmbed()
      .setAuthor(`NSFW  |  Neko`)
      .setDescription(`${message.author}, here is your naughty neko.`)
      .setImage(data.url)
      .setFooter("Powered by Nekos.life");
    message.channel.send({ embed });
  }
};
