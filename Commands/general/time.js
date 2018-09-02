const moment = require("moment-timezone");
exports.run = async function (bot, message, args) {
    const user = message.mentions.users.size >= 1 ? message.mentions.users.first() : message.author;
    const timezone = user.settings.timezone;
    if (timezone !== undefined) {
        if (/^GMT(\+|-)\d{1,2}/i.test(timezone)) timezone = "ETC/" + (timezone.search(/\+/i) ? timezone.replace("+", "-") : timezone.replace("-", "+"));
        if (moment.tz.zone(timezone) === null) {
            message.channel.send({embed: {
                title: ":x: Ooof!",
                description: `The timezone setting for ${user.username} seems to be invaild! Tell them to set it again with &uconfig timezone!`,
                fields: [{
                    name: ':information_source:',
                    value: `${user.username}'s timezone is set to ${timezone}.\nMake sure the timezone is a vaild [tz timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or in the format: GMT+ or - <number>`
                }]
            }});
        } else {
            const time = moment().tz(timezone);
            message.channel.send({embed: {
                title: `:clock: Time for ${user.username}`,
                description: `The time for ${user.username} is \`${time.format("hh:mm:ss A Do of MMMM, dddd")}\`!`,
                footer: {
                    text: "Tip: if this in inaccurate, try setting an tz timezone instead of an GMT+ or GMT- timezone!"
                }
            }})
        }
    } else {
        message.reply(`it seems that the user specified or you does not have configured his timezone. Please check \`${message.guild.prefix}uconfig\` before retrying.`);
    }
}

exports.infos = {
    category: "General",
    description: "Prints a user's time based on their uset timezone.",
    usage: "&time <user> or &time",
    example: "&time @Aldebaran or &time"
}