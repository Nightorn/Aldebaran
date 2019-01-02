const { MessageEmbed } = require('discord.js');
exports.run = (bot, message, args) => {
    const request = require('request');
    const itemlist = require(`${process.cwd()}/Data/drpgitemlist.json`);
    const locationdb = require(`${process.cwd()}/Data/drpglocationlist.json`);
    require(`${process.cwd()}/functions/action/userCheck.js`)(bot, message, args).then(usrid => {
        request({uri:`https://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization" : bot.config.drpg_apikey} }, function(err, response, body) {
            if (err) return;
            const data = JSON.parse(body).data;
            if (data.location === undefined) return message.channel.send(`Hey **${data.name}**, travel somewhere and set a trap on your way!`);
            if (data.location.saplings === null || data.location.saplings === undefined) return message.channel.send(`Hey **${data.name}**, please plant some saplings at your purchased fields before!`);
            //if (Object.values(data.location.saplings).indexOf(null) != -1) return message.channel.send(`**Error** No Currently Planted Saplings Found`);  
                //Caused errors when any location was "null" would then show complete message and ignore all other locations was removed fixing error.
            const embed = new MessageEmbed()
                .setTitle(data.name + "'s Planting Info")
                .setAuthor(message.author.username,message.author.avatarURL())
                .setColor(0x00AE86)
                .setDescription(`**Please note all infomation about amounts are strictly estimates!!**`)
                
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
            message.channel.send({embed});
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