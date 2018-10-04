const CommandHandler = require(`${process.cwd()}/structures/Aldebaran/CommandHandler.js`);
const DatabasePool = require(`${process.cwd()}/structures/Aldebaran/DatabasePool.js`);
const { Client } = require('discord.js');
const fs = require('fs');
module.exports = class AldebaranClient extends Client {
    constructor() {
        super({
            disabledEvents: [
                'GUILD_UPDATE',
                'GUILD_MEMBER_ADD',
                'GUILD_MEMBER_REMOVE',
                'GUILD_MEMBER_UPDATE',
                'GUILD_MEMBERS_CHUNK',
                'GUILD_ROLE_CREATE',
                'GUILD_ROLE_DELETE',
                'GUILD_ROLE_UPDATE',
                'GUILD_BAN_ADD',
                'GUILD_BAN_REMOVE',
                'CHANNEL_CREATE',
                'CHANNEL_DELETE',
                'CHANNEL_UPDATE',
                'CHANNEL_PINS_UPDATE',
                'MESSAGE_DELETE',
                'MESSAGE_UPDATE',
                'MESSAGE_DELETE_BULK',
                'MESSAGE_REACTION_REMOVE',
                'MESSAGE_REACTION_REMOVE_ALL',
                'USER_UPDATE',
                'USER_NOTE_UPDATE',
                'USER_SETTINGS_UPDATE',
                'PRESENCE_UPDATE',
                'VOICE_STATE_UPDATE',
                'TYPING_START',
                'VOICE_SERVER_UPDATE'
            ]
        });
        this.commandGroups = {};
        this.commandHandler = new CommandHandler(this);
        this.config = require(`${process.cwd()}/config.json`);
        this.config.aldebaranTeam = require(`${process.cwd()}/Data/aldebaranTeam.json`);
        this.database = new DatabasePool();
        this.debugMode = process.argv[2] === 'dev';
        this.login(this.debugMode ? this.config.tokendev : this.config.token);
        this.models = {
            settings: require(`${process.cwd()}/functions/checks/configurationModels.js`)
        }
        if (process.argv[3] !== undefined && this.debugMode) this.config.prefix = process.argv[3];
        for (let [key, value] of Object.entries(this.models.settings.common)) {
            this.models.settings.user[key] = value;
            this.models.settings.guild[key] = value;
        }
        if (!fs.existsSync(`./cache/`)) fs.mkdirSync(`./cache/`);
        
        fs.readdir("./events/", (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                let eventFunction = require(`${process.cwd()}/events/${file}`);
                let eventName = file.split(".")[0];
                this.on(eventName, (...args) => eventFunction.run(this, ...args));
            });
        });
    }
}