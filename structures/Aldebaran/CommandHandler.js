const Command = require(`${process.cwd()}/structures/Aldebaran/commands/Command`);
const fs = require('fs');
module.exports = class CommandHandler {
    constructor(client) {
        this.client = client;
        this.commands = this.logAllCommands();
    }

    logAllCommands() {
        const commands = new Map();
        const exploreFolder = function(path, client) {
            const files = fs.readdirSync(path);
            for (let file of files) {
                if (fs.statSync(path + file).isDirectory()) {
                    exploreFolder(`${path}${file}/`, client);
                } else {
                    const command = require(`${process.cwd()}/${path + file}`);
                    const fileName = file.replace('.js', '');
                    if (command.infos !== undefined) commands.set(fileName, new Command(client, fileName, command));
                }
            }
        }
        exploreFolder(`Commands/`, this.client);
        return commands;
    }

    /**
     * Executes the specified command
     * @param {string} command Command name to execute
     * @param {object} bot Discord Client
     * @param {object} message Message
     * @param {string[]} args Command Args
     */
    execute(command, bot, message, args) {
        try {
            const result = this.commands.get(command);
            if (result !== undefined) {
                return result.execute(bot, message, args);
            } else {
                throw new RangeError('Unknown Command')
            }
        } catch(err) {
            throw err;
        }
    }
}