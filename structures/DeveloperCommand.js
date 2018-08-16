const Command = require(`${process.cwd()}/structures/Command.js`);
const config = require(`${process.cwd()}/config.json`)
class DeveloperCommand extends Command {
    constructor (name, commandFile) {
        super(name, commandFile);
    }
    execute (bot, message, args) {
        if (config.admins.indexOf(message.author.id) === -1) {
            message.channel.send({embed:
                {
                    title: ":x: Not authorized",
                    description: "You are not an Aldebaran developer. You are not allowed to do that.",
                    color: 0xff0000,
                    author: {
                        name: message.author.name,
                        icon_url: message.author.avatarURL
                    }
                }
            })
        }
        else {
            this.commandFile.run(bot, message, args, config);
        }
    }
}
module.exports = DeveloperCommand;