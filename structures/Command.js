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
        this.commandFile.run(bot, message, args);
    }
}