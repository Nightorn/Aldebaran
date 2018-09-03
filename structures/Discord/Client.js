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
                'MESSAGE_REACTION_ADD',
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
        this.database = new DatabasePool();
        this.login(process.argv[2] !== 'dev' ? this.config.token : this.config.tokendev);
        this.models = {
            settings: {
                common: {
                    adventureTimer: {
                        support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, 
                        help: "DiscordRPG Adventure Timer - [on | off]"
                    }, sidesTimer: {
                        support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, 
                        help: "DiscordRPG Sides Timer - [on | off]"
                    }, travelTimer: {
                        support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, 
                        help: "DiscordRPG Travel Timer - [on | off]"
                    }, healthMonitor: {
                        support: (value) => { return ['on', 'off'].indexOf(value) != -1}, 
                        help: "DRPG Health Monitor - [on | off]"
                    }
                },
                user: {
                    individualHealthMonitor: {
                        support: (value) => { return ['off', "character", "pet"].indexOf(value) != -1 }, 
                        help: "Lets you choose whether you want to display the health of your character or your pet with the health monitor - [off | character | pet]" 
                    }, timezone: {
                        support: require(`${process.cwd()}/functions/checks/timezoneSupport.js`), 
                        help: "Sets your timezone - [GMT+/-, or [tz database timezone (required for DST detection)](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)]"
                    }
                },
                guild: {
                    autoDelete: {
                        support: (value) => { return ['on', 'off'].indexOf(value) != -1}, 
                        help: "Auto Delete Sides & Adv Commands - [on | off]"
                    },  aldebaranPrefix: {
                        support: () => { return true }, 
                        help: "Aldebaran's Prefix - [& | Guild Customized]", 
                        postUpdate: (value) => { message.guild.prefix = value; }
                    }, discordrpgPrefix: {
                        support: () => { return true }, 
                        help: "DiscordRPG Prefix"
                    }
                }
            }
        }
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