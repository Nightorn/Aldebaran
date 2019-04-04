const Command = require(`./Command.js`);
const config = require(`../../../config.json`);
class DeveloperCommand extends Command {
  static check(message) {
    return config.admins.indexOf(message.author.id) !== -1;
  }

  static errorEmbed(message) {
    return {
      title: ":x: Not authorized",
      description:
        "You are not an Aldebaran developer. You are not allowed to do that.",
      color: 0xff0000,
      author: {
        name: message.author.name,
        icon_url: message.author.avatarURL()
      }
    };
  }
}
module.exports = DeveloperCommand;
