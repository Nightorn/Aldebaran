const fs = require('fs');
module.exports = class Command {
    /**
     * Builds the Command object
     * @param {string} command Command Name
     */
    constructor(command) {
        this.name = command;
        var files = fs.readdirSync('./Commands/');
        if (files.indexOf(`${command}.js`) !== -1) {
            for (let [key, value] of Object.entries(require(`./../Commands/${command}`))) this[key] = value;
        } else {
            for (let fileName of files) {
                if (fs.statSync(`./Commands/${fileName}`).isDirectory()) {
                    files = fs.readdirSync(`./Commands/${fileName}/`);
                    if (files.indexOf(`${command}.js`) != -1) for (let [key, value] of Object.entries(require(`./../Commands/${fileName}/${command}`))) this[key] = value;
                }
            }
        }
        if (this.infos === undefined) throw new RangeError('Unknown Command');
    }

    /**
     * Executes the Command
     * @param {Client} bot Discord Client
     * @param {Message} message Message Object
     * @param {string[]} args Command Ags
     */
    execute(bot, message, args) {
        if ((this.infos.category === 'NSFW' && message.channel.nsfw) || this.infos.category !== 'NSFW') {
            this.run(bot, message, args);
        } else {
            message.reply("Tsk tsk! This command is only usable in a NSFW channel.");
        }
    }
}