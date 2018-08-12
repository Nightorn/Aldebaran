exports.run = (bot, message, args, apiratelimit) => {
    const Discord = require("discord.js");
    const apikey = require(`${process.cwd()}/config.json`);
    const request = require('request');
    const itemlist = require(`${process.cwd()}/Data/drpgitemlist.json`);
    const locationdb = require(`${process.cwd()}/Data/drpglocationlist.json`);
    var usrid = message.author.id;
    if (args.length > `0`){
        usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
    };
    if (apiratelimit == 0)return message.channel.send(`This Command is globally ratelimited, please try again in 1min.`);
    bot.fetchUser(usrid).then((user) => {
        request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body, headers) {
            if (err) return;
            const data = JSON.parse(body);
            apiratelimit = response.headers["x-ratelimit-remaining"]
            if (data.location === undefined) return message.channel.send(`**Error** No Purchased Fields Found`);
            if (data.location.saplings === null) return message.channel.send(`**Please plant at purchased feilds first**`);
            //if (Object.values(data.location.saplings).indexOf(null) != -1) return message.channel.send(`**Error** No Currently Planted Saplings Found`);  
                //Caused errors when any location was "null" would then show complete message and ignore all other locations was removed fixing error.
            var ratelimitrest = Math.floor(parseInt(response.headers["x-ratelimit-reset"] - (Date.now()/1000)))
            console.log(response.headers["x-ratelimit-reset"])
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s Planting Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`**Please note all infomation about amounts are strictly estimates!!**`)
                .setFooter(`${apiratelimit} Global Uses Remain Before Ratelimited | Usages Reset In ${ratelimitrest} seconds.`)
                
            for (let [key, value] of Object.entries(data.location.saplings)){
                var planttime = 0
                var checktime = 0
                var plantname = `Nothting`
                var plantdate = `Not yet planted`
                var lootamountcurrentmin = `NA`
                var lootamountcurrentmax = `NA`
                var lootamountmaxmin = `NA`
                var lootamountmaxmax = `NA`
                var currentreap = data.attributes.reaping !== 0 ? data.attributes.reaping : 1;
                var maxreap = Math.round(data.level * 5);

                if (value !== null){
                    plantdate = new Date(value.time);
                    planttime = Math.round((new Date()-value.time)/86400000);
                    checktime = Math.round((new Date()-value.time)/1000);
                    lootamountcurrentmin = Math.floor(1+((Math.floor(currentreap))*(checktime/25)/15000));
                    lootamountcurrentmax = Math.floor(1+((Math.floor(currentreap))*(checktime/25)/14000));
                    lootamountmaxmin = Math.floor(1+(maxreap*(checktime/25)/15000));
                    lootamountmaxmax = Math.floor(1+(maxreap*(checktime/25)/14000));
                    var plantid = value.id 
                    for (var i = 0; i < itemlist.length; i++){
                        if (itemlist[i].id == value.id){
                            plantname = itemlist[i].name  
                        }
                    }
                };    
                var locationname = locationdb[`${key}`] !== undefined ? locationdb[`${key}`].name : "???"
                embed.addField(`__${locationname} - Set ${planttime} days ago.__`,`Seed Planted: **${plantname}**\nPlanted Since: ${plantdate}\nChecked with **Current** reaping would give you **${lootamountcurrentmin} - ${lootamountcurrentmax} items**.\nChecked with **Max** reaping would give you **${lootamountmaxmin} - ${lootamountmaxmax} items**.`,false);
            }
            message.channel.send({embed})
        }) 
    }).catch(err => {
        message.reply("Error you must enter a valid UserID or User Mention")
    })
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