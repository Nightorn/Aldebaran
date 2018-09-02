const CooldownManager = require(`${process.cwd()}/structures/Aldebaran/CooldownManager`);
module.exports = class Command {
    /**
     * Builds the Command object
     * @param {string} command Command Name
     */
    constructor(client, name, commandFile) {
        this.client = client;
        this.commandFile = commandFile;
        this.cooldownManager = new CooldownManager(this);
        this.name = name;
        for (let [key, value] of Object.entries(this.commandFile.infos)) this[key] = value;
    }

    log(cooldown, message, args) {
        console.log(`User ${message.author.id} (${message.author.tag}) | Command ${this.name}${args.length === 0 ? '' : ` | Args - ${args}`} | Cooldown : ${cooldown ? 'GOOD' : `BAD (${cooldown}ms)`}`);
    }
    
    /**
     * Executes the Command
     * @param {Client} bot Discord Client
     * @param {Message} message Message Object
     * @param {string[]} args Command Ags
     */
    execute(bot, message, args) {
        const canPass = this.cooldownManager.canPass(message.author);
        this.log(canPass, message, args);
        if (canPass) {
            return this.commandFile.run(bot, message, args);
        } else {
            return new Error('Exceeded Command Cooldown');
        }
    }
}