const { MessageEmbed } = require("discord.js");
const Client = require("nekos.life");
const NSFWCommand = require("../../structures/commands/NSFWCommand");

module.exports = class XKittyCommand extends NSFWCommand {
  constructor(client) {
    super(client, {
      name: "xkitty",
      description: "Displays a hentai picture or a GIF with a kitty"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(bot, message) {
    const neko = new Client();
    const data = await neko.getNSFWPussy();
    const embed = new MessageEmbed()
      .setAuthor(`NSFW  |  Kitty`, bot.user.avatarURL())
      .setDescription(`${message.author}, here is your kitty!`)
      .setImage(data.url)
      .setFooter("Powered by nekos.life");
    message.channel.send({ embed });
  }
};
