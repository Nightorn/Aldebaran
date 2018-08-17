exports.run = (bot, message, args, apiratelimit) => {
    const Discord = require("discord.js");
    const apikey = require(`${process.cwd()}/config.json`);
    const request = require('request');
    const locationdb = require(`${process.cwd()}/Data/drpglocationlist.json`);
    var usrid = message.author.id;
    if (args.length > 0) usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
    if (apiratelimit == 0) return message.channel.send(`This Command is globally ratelimited, please try again in 1min.`);
    bot.fetchUser(usrid).then(() => {
        try {
            request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
                if (err) return;
                const data = JSON.parse(body);
                if (data.error !== undefined) return message.channel.send(`**Error** No User Profile Found`);

                const format = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") };

                var skills = [], attributes = [];
                for (let [key, value] of Object.entries(data.skills)) skills.push(`**${key[0].toUpperCase() + key.slice(1)}** Lv${value.level}`);
                if (data.attributes !== undefined) for (let [key, value] of Object.entries(data.attributes)) if (value !== 0) attributes.push(`**${key[0].toUpperCase() + key.slice(1)}** ${format(value)} Points`);
                const embed = new Discord.RichEmbed()
                    .setAuthor(data.name, bot.users.get(usrid).avatarURL)
                    .setColor(data.donate ? 'GOLD' : 0x00AE86)
                    .setDescription(`${data.location !== undefined ? `Currently In **${locationdb[`${data.location.current}`] !== undefined ? `${locationdb[`${data.location.current}`].name}**` : 'The Abyss**'}` : ''}`)
                    .addField(`Level ${format(data.level)}`,`**Progression** - ${format(data.kills)} **Kills** | ${data.deaths} **Deaths** | ${format(data.xp)} **XP**\n**Currency** - ${format(data.gold)} **Gold** | ${data.lux !== undefined ? format(data.lux) : '0'} **Lux**`, false)
                    .addField(`Specifications`, `**Skills** - ${skills.join(', ')}\n**Attributes** - ${attributes.length !== 0 ? attributes.join(', ') : 'None'}`)
                    //.setFooter(`${response.headers["x-ratelimit-remaining"]} Global Uses Remain Before Ratelimited | Usages Reset In ${Math.floor(parseInt(response.headers["x-ratelimit-reset"] - (Date.now()/1000)))} seconds.`);
                    .setFooter(`${data.donate ? 'Donator, ' : ''}Last seen ${Math.floor((new Date() - data.lastseen) / 60000)} mins ago`);
                if (data.quest !== '' && data.quest !== undefined) embed.addField(`Quests`, `${data.quest.current !== null ? `**Current** : ${data.quest.current.name}\n` : ''}${data.quest.completed !== undefined ? `**Completed (${data.quest.completed.length})** : ${data.quest.completed.join(`, `)}` : ''}`, false);
                if (data.pet !== undefined) if (data.pet.xp !== undefined) embed.addField(`Pet (${data.pet.type})`, `**Name** : ${data.pet.name} | **Level** ${format(data.pet.level)}\n${format(data.pet.xp)} **XP** (XP Rate : ${data.pet.xprate}%) | **Damages** : [${format(data.pet.damage.min)} - ${format(data.pet.damage.max)}]`, false);
                message.channel.send({embed});
            });
        } catch(err) {
            message.channel.send('So bad, an error occured with the stats of the user you wanted to see, but it is unknown.');
        }
    }).catch(() => {
        message.reply("The ID of the user you specified is invalid. Please retry by mentionning him or by getting their right ID.");
    });
};

exports.infos = {
    category: "DRPG",
    description: "Displays users character and pet infos.",
    usage: "\`&stats\` or \`&stats <usermention>\` or \`&stats <userid>\`",
    example: "\`&stats\` or \`&stats @aldebaran\` or \`&stats 246302641930502145\`",
    cooldown: {
        time: 5000,
        rpm: 25,
        resetTime: 60000,
        commandGroup: "drpg"
    }
}