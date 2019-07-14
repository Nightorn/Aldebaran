const { MessageEmbed } = require("discord.js");
const userCheck = require("../../functions/action/userCheck");
const Command = require("../../structures/commands/Command");

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      description: "Displays the avatar of the specified user",
      usage: "UserMention/UserID",
      example: "320933389513523220",
      aliases: ["pfp"]
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(bot, message, args) {
    userCheck(bot, message, args)
      .then(async usrid => {
        const user = await bot.users.fetch(usrid);
        const embed = new MessageEmbed()
          .setAuthor(user.username, user.avatarURL())
          .setTitle(`${user.username}'s Avatar`)
          .setImage(user.avatarURL({ size: 2048 }));
        message.channel.send({ embed });
      })
      .catch(() => {
        message.reply(
          "The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID."
        );
      });
  }
};