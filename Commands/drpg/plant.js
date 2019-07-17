const { MessageEmbed } = require('discord.js');
exports.run = (bot, message, args) => {
    const request = require('request');
    const itemlist = require(`${process.cwd()}/Data/drpgitemlist.json`).data;
    const locationdb = require(`${process.cwd()}/Data/drpglocationlist.json`);
    require(`${process.cwd()}/functions/action/userCheck.js`)(bot, message, args).then(usrid => {
        request({uri:`https://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization" : bot.config.drpg_apikey} }, async function(err, response, body) {
            if (err) throw err;
            if (response.statusCode === 404) {
                return message.reply(`it looks like the user you specified has not started his adventure on DiscordRPG yet.`);
            } else if (response.statusCode === 200) {
                var data = JSON.parse(body);
                data = data.data;
                const user = await bot.users.fetch(usrid);
                if (data.location === undefined) return message.channel.send(`Hey **${data.name}**, travel somewhere and set a trap on your way!`);
                if (data.location.saplings === null || data.location.saplings === undefined) return message.channel.send(`Hey **${data.name}**, please plant some saplings at your purchased fields before!`);
                //if (Object.values(data.location.saplings).indexOf(null) != -1) return message.channel.send(`**Error** No Currently Planted Saplings Found`);  
                    //Caused errors when any location was "null" would then show complete message and ignore all other locations was removed fixing error.
                const embed = new MessageEmbed()
                    .setAuthor(`${user.username}  |  Plant Informations`, user.avatarURL())
                    .setColor(0x00AE86)
                    .setFooter(`Please note that all amounts of items shown here are estimations.`)
                    
                
                const f = (data) => { return String(data).length === 1 ? `0${data}` : data }
                const getDate = (time) => {
                    const date = new Date(time);
                    return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
                }
    
                for (let [key, value] of Object.entries(data.location.saplings)) {
                    if (value !== null) {
                        var currentreap = data.attributes.reaping !== 0 ? data.attributes.reaping : 1;
                        var maxreap = Math.round(data.level * 5);
                        var plantdate = new Date(value.time);
                        var planttime = Math.round((new Date()-value.time)/86400000);
                        var checktime = Math.round((new Date()-value.time)/1000);
                        var lootamountcurrentmin = Math.floor(1+((Math.floor(currentreap))*(checktime/25)/15000));
                        var lootamountcurrentmax = Math.floor(1+((Math.floor(currentreap))*(checktime/25)/14000));
                        var lootamountmaxmin = Math.floor(1+(maxreap*(checktime/25)/15000));
                        var lootamountmaxmax = Math.floor(1+(maxreap*(checktime/25)/14000));
    
                        for (var i = 0; i < itemlist.length; i++){
                            if (itemlist[i].id == value.id){
                                plantname = itemlist[i].name  
                            }
                        }
                        var locationname = locationdb[`${key}`] !== undefined ? locationdb[`${key}`].name : "???"
                        embed.addField(`${plantname} @ ${locationname} - ${planttime} days old`,`Planted the ${getDate(plantdate)}.\nWith your **current** reaping skills, you would get between **${lootamountcurrentmin}** and **${lootamountcurrentmax}** items.\nWith the **highest** reaping skills, you would get between **${lootamountmaxmin}** and **${lootamountmaxmax}** items.`, false);
                    }
                }
                message.channel.send({embed});
            } else {
                return message.reply(`the DiscordRPG API seems down, please retry later.`);
            }
        });
    }).catch(() => {
        message.reply("**Error** you must enter a valid UserID or User Mention");
    });
};
exports.infos = {
    category: "DRPG",
    description: "Displays users plant information and estimated loots.",
    usage: "\`&plant\` or \`&plant <usermention>\` or \`&plant <userid>\`",
    example: "\`&plant\` or \`&plant @aldebaran\` or \`&plant 246302641930502145\`",
    cooldown: {
        time: 5000,
        rpm: 25,
        resetTime: 60000,
        commandGroup: "drpg"
    }
}    