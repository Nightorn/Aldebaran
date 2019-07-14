const { MessageEmbed } = require("discord.js");
const lewds = require("../../Data/imageurls.json");
const NSFWCommand = require("../../structures/commands/NSFWCommand");

module.exports = class LewdCommand extends NSFWCommand {
  constructor(client) {
    super(client, {
      name: "lewd",
      description: "Performs a lewd action on the specified user",
      usage: "UserMention",
      example: "<@437802197539880970>"
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(bot, message) {
    const sendlewds = `${
      lewds.lewds[Math.floor(Math.random() * lewds.lewds.length)]
    }`;
    if (message.mentions.users.first()) {
      const target = message.mentions.users.first();
      const embed = new MessageEmbed()
        .setAuthor(`NSFW  |  Lewd`, bot.user.avatarURL())
        .setDescription(`${message.author} is being lewd towards ${target}`)
        .setImage(sendlewds);
      message.channel.send({ embed });
    } else {
      message.reply("Please mention someone :thinking:");
    }
  }
};