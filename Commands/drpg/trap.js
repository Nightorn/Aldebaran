exports.run = (bot, message, args, apiratelimit) => {
    const Discord = require(`discord.js`);
    const apikey = require(`${process.cwd()}/config.json`);
    const request = require(`request`);
    var usrid = message.author.id;
    if (args.length > 0) {
        usrid = (message.mentions.members.size > 0) ? message.mentions.members.first().id : args[0];
    };
    if (apiratelimit == 0)return message.channel.send(`This Command is globally ratelimited, please try again in 1min.`);
    bot.fetchUser(usrid).then((user) => {
        request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body){
            if (err) return;
            const data = JSON.parse(body);
            apiratelimit = response.headers["x-ratelimit-remaining"]
            var ratelimitrest = Math.floor(parseInt(response.headers["x-ratelimit-reset"] - (Date.now()/1000)))
            if (data.trap == undefined || data.trap.time == "" ) return message.channel.send(`No Trap Set`);//Checking for data.trap in json
            var trapsetdate = new Date(data.trap.time);//changing date code from UTC to actual date
            var trapelapsedraw = Math.floor((new Date()-data.trap.time) / 1000);
            var traptimeelapsed = (Math.floor((new Date()-data.trap.time)/3600000) > 24) ? (Math.floor((new Date()-data.trap.time)/86400000)) : (Math.floor((new Date()-data.trap.time)/3600000));
            var hourorday = (Math.floor((new Date()-data.trap.time)/3600000) > 24) ? true : false;
            var hour = (hourorday == false) ? `Hours` : `Days`;
            var currentsalvage = 1;
            if (data.attributes.salvaging != undefined){
                currentsalvage = (data.attributes.salvaging == 0) ? 1 : data.attributes.salvaging;
            };
            var maxsalvage = Math.floor(data.level * 5);
            var currentid79min = (trapelapsedraw >= 300) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var currentid79max = (trapelapsedraw >= 300) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/14000))) : 0;
            var currentid78min = (trapelapsedraw >= 1200) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var currentid78max = (trapelapsedraw >= 1200) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/14000))) : 0;
            var currentid81min = (trapelapsedraw >= 3600) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var currentid81max = (trapelapsedraw >= 3600) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/14000))) : 0;
            var currentid80min = (trapelapsedraw >= 86400) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var currentid80max = (trapelapsedraw >= 86400) ? Math.floor(1+(Math.floor(Math.sqrt(currentsalvage)*(trapelapsedraw/25)/14000))) : 0;
            //^^Is With current Stats Below With Max Stats.
            var maxsalid79min = (trapelapsedraw >= 300) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var maxsalid79max = (trapelapsedraw >= 300) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/14000))) : 0;
            var maxsalid78min = (trapelapsedraw >= 1200) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var maxsalid78max = (trapelapsedraw >= 1200) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/14000))) : 0;
            var maxsalid81min = (trapelapsedraw >= 3600) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var maxsalid81max = (trapelapsedraw >= 3600) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/14000))) : 0;
            var maxsalid80min = (trapelapsedraw >= 86400) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/15000))) : 0;
            var maxsalid80max = (trapelapsedraw >= 86400) ? Math.floor(1+(Math.floor(Math.sqrt(maxsalvage)*(trapelapsedraw/25)/14000))) : 0;
            //Bears are only awared 1 min & max after 7 days.
            var id462 = (trapelapsedraw >= 604800) ? 1 : 0;
            //Embed Stuffs
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + "'s Trap Info")
                .setAuthor(message.author.username,message.author.avatarURL)
                .setColor(0x00AE86)
                .setDescription(`Bear Trap - Set ${traptimeelapsed} ${hour} Ago`)
                .addField(`__Current Trap Rewards__`,`You will recieve **${currentid79min}-${currentid79max}** **Raven Feathers**.\nYou will recieve **${currentid78min}-${currentid78max}** **Balls of Wool**.\nYou will recieve **${currentid81min}-${currentid81max}** **Golden Feathers**.\nYou will recieve **${currentid80min}-${currentid80max}** **Meats**.\nYou will recieve **${id462}** **bear**.`,false)                
                .addField(`__Max Salvaging Trap Rewards__`,`You will recieve **${maxsalid79min}-${maxsalid79max}** **Raven Feathers**.\nYou will recieve **${maxsalid78min}-${maxsalid78max}** **Balls of Wool**.\nYou will recieve **${maxsalid81min}-${maxsalid81max}** **Golden Feathers**.\nYou will recieve **${maxsalid80min}-${maxsalid80max}** **Meats**.\nYou will recieve **${id462}** **bear**.`,false)
                .setFooter(`Trap Set - ${trapsetdate}\n${apiratelimit} Global Uses Remain Before Ratelimited | Usages Reset In ${ratelimitrest} seconds.`)
                message.channel.send({embed})    

        })
    }).catch(err => {
        message.reply(`Error you must enter a valid UserID or Mention User.`)
    });
};
exports.infos = {
    category: "DRPG",
    description: "Displays users trap information and estimated loots.",
    usage: "\`&trap\` or \`&trap <usermention>\` or \`&trap <userid>\`",
    example: "\`&trap\` or \`&trap @aldebaran\` or \`&trap 246302641930502145\`",
    cooldown: {
        time: 5000,
        rpm: 25,
        resetTime: 60000,
        commandGroup: "drpg"
    }
}