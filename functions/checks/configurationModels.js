module.exports = {
    common: {
        adventureTimer: {
            support: (value) => { return value === 'on' || value === 'off' }, 
            help: "DiscordRPG Adventure Timer - [on | off]",
            showOnlyIfBotIsInGuild: "170915625722576896"
        }, sidesTimer: {
            support: (value) => { return value === 'on' || value === 'off' }, 
            help: "DiscordRPG Sides Timer - [on | off]",
            showOnlyIfBotIsInGuild: "170915625722576896"
        }, travelTimer: {
            support: (value) => { return value === 'on' || value === 'off' }, 
            help: "DiscordRPG Travel Timer - [on | off]",
            showOnlyIfBotIsInGuild: "170915625722576896"
        }, healthMonitor: {
            support: (value) => { return value === 'on' || value === 'off' || (parseInt(value) > 0 && parseInt(value) < 100)}, 
            help: "DRPG Health Monitor - [on | off | healthPercentage ]",
            showOnlyIfBotIsInGuild: "170915625722576896"
        }, polluxBoxPing: {
            support: (value) => { return value === 'on' || value === 'off' }, 
            help: "Pollux Box Ping - [on | off]",
            postUpdateCommon: (value, user, guild) => { 
                if (value === 'on')  guild.polluxBoxPing.set(user.id, user);
                else guild.polluxBoxPing.delete(user.id);
                return [user, guild];
            },
            showOnlyIfBotIsInGuild: "271394014358405121"
        }
    },
    user: {
        individualHealthMonitor: {
            support: (value) => { return ['off', "character", "pet"].indexOf(value) != -1 }, 
            help: "Lets you choose whether you want to display the health of your character or your pet with the health monitor - [off | character | pet]" ,
            showOnlyIfBotIsInGuild: "170915625722576896"
        }, timezone: {
            support: require(`${process.cwd()}/functions/checks/timezoneSupport.js`), 
            help: "Sets your timezone - [GMT, UTC, or [tz database timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)]"
        }
    },
    guild: {
        autoDelete: {
            support: (value) => { return value === 'on' || value === 'off' }, 
            help: "Auto Delete Sides & Adv Commands - [on | off]",
            showOnlyIfBotIsInGuild: "170915625722576896"
        },  aldebaranPrefix: {
            support: () => { return true }, 
            help: "Aldebaran's Prefix - [& | Guild Customized]", 
            postUpdate: (value, guild) => { guild.prefix = value; return guild; }
        }, discordrpgPrefix: {
            support: () => { return true }, 
            help: "DiscordRPG Prefix",
            showOnlyIfBotIsInGuild: "170915625722576896"
        }
    }
}