<<<<<<< HEAD
const { MessageEmbed } = require("discord.js");
exports.run = async function(bot, message, args) {
    const parametersAvailable = bot.models.settings.user;
=======
const poolQuery = require(`${process.cwd()}/functions/database/poolQuery`);
const config = require(`${process.cwd()}/config.json`);
const Discord = require("discord.js");
const timeNames = require(`${process.cwd()}/Commands/general/time.js`).timezones;
const mysql = require("mysql");
exports.run = function(bot, message, args) {
    function timezoneSupport (value) {
        if (/^GMT(\+|-)\d{1,2}/i.test(value)) {
            //interpreted as GMT +/-
            return true;
        }
        //yup, it's a zone
        if (timeNames.indexOf(value) !== -1) {
            return true;
        }
    }
    const parametersAvailable = {
        healthMonitor: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 || (parseInt(value) > 0 && parseInt(value) < 100) }, help: "Tells you when you or your pet's health is low - [on | off | healthPercentage]"},
        adventureTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "Tells you when your DiscordRPG adventure cooldown has passed - [on | off]"},
        sidesTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "Tells you when your DiscordRPG sides cooldown has passed  - [on | off]"},
        travelTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "Alerts you that you have finished traveling.  - [on | off]"},
        individualHealthMonitor: {support: (value) => { return ['off', "character", "pet"].indexOf(value) != -1 }, help: "Lets you choose whether you want to display the health of your character or your pet with the health monitor - [off | character | pet]" },
        timezone: {support: timezoneSupport, help: "Sets your timezone - [GMT+/-, or [tz database timezone (required for DST detection)](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)]"}
    }
>>>>>>> 137f977f43512afcdf8ebd7057b230c9866cb724
    if (args.length == 0 || args.indexOf('help') != -1) {
        var description = '';
        for (let [key, data] of Object.entries(parametersAvailable)) description += `**${key}** - ${data.help}\n`;
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle('Config Command Help Page')
            .setDescription(`Here are the different parameters you can change to have a better experience of ${bot.user.username}\n(Note: If setting is disabled in &gconfig by guild owner, these settings will be ignored.\n**__Usage Example__** : \`&uconfig healthMonitor off\`\n${description}\n`)
            .setColor('BLUE');
        message.channel.send({embed});
    } else {
        if (Object.keys(parametersAvailable).indexOf(args[0]) != -1) {
            if (parametersAvailable[args[0]].support(args[1])) {
                if (!message.author.existsInDb) await message.author.create();
                message.author.changeSetting(args[0], args[1]).then(() => {
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle(`Settings successfully changed`)
                        .setDescription(`The property **${args[0]}** has successfully been changed to the value **${args[1]}**.`)
                        .setColor(`GREEN`);
                    message.channel.send({embed});
                }).catch(err => {
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle(`An Error Occured`)
                        .setDescription(`An error occured and we could not change your settings. Please retry later.`)
                        .setColor(`RED`);
                    message.channel.send({embed});
                    throw err;
                });
            } else {
                message.channel.send({embed: {color: 0xff0000, title: "Not supported", description: "This value is not vaild. Please check \`&uconfig help\` for the vaild values for this setting."}});
            }
        } else {
            message.channel.send({embed: {color: 0xff0000, title: "Invaild key", description: "This key does not exist. Check \`&uconfig help\` for the keys accepted.."}});
        }
    }
}
exports.infos = {
    category: "Settings",
    description: "Changes User Configurations For Aldebaran Features",
    usage: "\`&uconfig <parameter> <setting>\`",
    example: "\`&uconfig adventureTimer on\`",
}