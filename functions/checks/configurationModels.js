module.exports = {
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
            support: (value) => { return ['on', 'off'].indexOf(value) != -1 || (parseInt(value) > 0 && parseInt(value) < 100)}, 
            help: "DRPG Health Monitor - [on | off | healthPercentage ]"
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