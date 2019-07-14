const { MessageEmbed } = require("discord.js");
const Client = require("nekos.life");
const NSFWCommand = require("../../structures/commands/NSFWCommand");

module.exports = class XRandomCommand extends NSFWCommand {
  constructor(client) {
    super(client, {
      name: "xrandom",
      description: "Displays a random hentai picture or GIF"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(bot, message) {
    const neko = new Client();
    const data = await neko.getNSFWRandomHentaiGif();
    const embed = new MessageEmbed()
      .setAuthor(`NSFW  |  Random`)
      .setDescription(
        `${message.author}, you wanted something random? Here you go!`
      )
      .setImage(data.url)
      .setFooter("Powered by nekos.life");
    message.channel.send({ embed });
  }
};
