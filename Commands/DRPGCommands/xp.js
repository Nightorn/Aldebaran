exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    var level = args[0];
    if (level >= 1){
        var formula1 = Math.floor((1249297 * (level * level)) /61200000);
        var formula2 = Math.floor((1778779 * level) / 306000);
        var formula3 = Math.floor(11291 / 51);
        var finalnoring = Math.floor((formula1 + formula2 + formula3) / 1.5);
        var finalxpring = Math.floor(((formula1 + formula2 + formula3) / 1.5) * 1.25);
        var finaldonorring = Math.floor((formula1 + formula2 + formula3));
        
        const embed = new Discord.RichEmbed()
            .setTitle(`Average Xp Kill At Lvl. ${level}`)
            .setAuthor(message.author.username,message.author.avatarURL)
            .setColor(0x00AE86)
            .setDescription(`**Please note all infomation about xp are strictly estimates!!**\n*Estimates are based on FULL xpboost build, while grinding Dynomobs.*`)
            .addField(`**__With Ring of XP (1.25X)__**`,` Estimated ${finalxpring}xp Per Kill`,true)
            .addField(`**__With Donor XP Ring (1.5X)__**`,` Estimated ${finaldonorring}xp Per Kill`,true)
            .addField(`**__Without XP Ring__**`,` Estimated ${finalnoring}xp Per Kill`,false)
        
        message.channel.send({embed})
    
    }else message.reply(`You must specify a level.`)

}
