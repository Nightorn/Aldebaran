const moment = require("moment-timezone");
exports.run = async function (bot, message, args) {
    const poolQuery = require(`${process.cwd()}/functions/database/poolQuery.js`);
    let user; //id
    let username; //storing for later
    if (args.length >= 1 && message.mentions.users.size >= 1) {
        // GEEZ THE DAMN CHAIN
        const mentionedUser = message.mentions.users.values().next().value;
        user = mentionedUser.id;
        username = mentionedUser.username;
    }
    else {
        user = message.author.id;
        username = message.author.username;
    }
    try {
        const query = await poolQuery(`SELECT settings FROM users WHERE userid=${user}`);
        const userSettings = JSON.parse(query[0].settings);
    

        let timezone = userSettings.timezone;
        if (/^GMT(\+|-)\d{1,2}/i.test(timezone)) {
            //timezone database drafter is retarded
            timezone = "ETC/"+(timezone.search(/\+/i) ? timezone.replace("+", "-"): timezone.replace("-", "+"));
        }
        if (moment.tz.zone(timezone) === null) {
            message.channel.send({embed: {
                title: ":x: Ooof!",
                description: `The timezone setting for ${username} seems to be invaild! Tell them to set it again with &uconfig timezone!`,
                fields: [
                    {
                        name: ':information_source:',
                        value: `${username}'s timezone is set to ${usersettings?timezone:unset}.
                        Make sure the timezone is a vaild [tz timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), or in the format: GMT+ or - <number>`
                    }
                ]
            }});
        }
        else {
            const time = moment().tz(timezone);
            message.channel.send({embed: {
                title: `:clock: Time for ${username}`,
                description: `The time for ${username} is \`${time.format("hh:mm:ss A Do of MMMM, dddd")}\`!`,
                footer: {
                    text: "Tip: if this in inaccurate, try setting an tz timezone instead of an GMT+ or GMT- timezone!"
                }
            }})
        }
    }
    catch (err) {
        console.log("Caught error "+err+". This error probably isn't a problem, the user has been notified");
        message.channel.send({embed: {
            title: ":x: Ooof!",
            description: "An error occured, or I couldn't load your settings!\nMost of the time, **\`&uconfig timezone <timezone>\`** will fix this.",
            color: 0xff0000,
            footer: {
                text: "If this is persistant, report this: &bugreport"
            }
        }});
        return;
    }
}

exports.infos = {
    category: "General",
    description: "Prints a user's time based on their uset timezone.",
    usage: "&time <user> or &time",
    example: "&time @Aldebaran or &time"
}

exports.timezones = moment.tz.names();