module.exports = class Command {
    /**
     * Builds the Command object
     * @param {string} command Command Name
     */
    constructor(name, commandFile) {
        this.name = name;
        this.commandFile = commandFile;
    }

    getInfo () {
        return this.commandFile.infos;
    }

    /**
     * Executes the Command
     * @param {Client} bot Discord Client
     * @param {Message} message Message Object
     * @param {string[]} args Command Ags
     */
    execute(bot, message, args) {
        if ((this.commandFile.infos.category === 'NSFW' && message.channel.nsfw) || this.commandFile.infos.category !== 'NSFW') {
            this.commandFile.run(bot, message, args);
        } else {
            message.reply("Tsk tsk! This command is only usable in a NSFW channel.");
        }
    }
}