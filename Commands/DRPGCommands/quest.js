exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    const questlist = require("./../../Data/drpgquestinfo.json");

    var questrequest = args.join(' ').toLowerCase(), found = false;
    if (args != '') {
        for (let [name, quest] of Object.entries(questlist)) {
            if (name == questrequest) {
                found = true;
                var walktrough = '', itemsNeeded = '', rewards = '';
                for (let [step, details] of Object.entries(quest.steps)) walktrough += `**${step}:** ${details}\n`;
                for (let [id, details] of Object.entries(quest.itemsNeeded)) itemsNeeded += `**${id}:** **${details.item}** (${details.qty}) - ${details.buyable ? `Buyable for ${details.price}` : `Not buyable, or only on global market`}\n`;
                for (let [id, reward] of Object.entries(quest.rewards)) rewards += `**${id}:** ${reward}\n`
                var embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setTitle(`${quest.name} Quest`)
                    .setColor(0xff6699)
                    .setDescription(`Details for the ${quest.name} Quest`)
                if (quest.warning != undefined) embed.addField('**__Warnings__**', quest.warning, false);
                    embed.addField('**__Starting Location__**', quest.startPoint, true)
                    embed.addField('**__Starting NPC__**', quest.startNpc, true)
                if (walktrough != '') embed.addField('**__Walktrough__**', walktrough, false);
                if (itemsNeeded != '') embed.addField('**__Items Needed__**', itemsNeeded, false);
                if (rewards != '') embed.addField('**__Rewards__**', rewards, true);
                message.channel.send({embed});
            }
        }
        if (!found) message.channel.send(`**Error** No Quest Found`);
    } else {
        const embed = new Discord.RichEmbed()
        .setTitle("DRPG Quest List")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(0x00AE86)
        .setDescription(`Use &quest <questname> to view walkthrough.`)
        .addField(`**__Non-Members Quest__**`,`🔺Cult of MOUKN                 🔺Fickle Fishing           🔺The Cold North\n🔺The quest about wood?   🔺Meditative Magic   🔺Exotic Eggnog\n🔺The Land Above`,false)
        .addField(`**__Members Only Quest__**`,`🔺Baffling Baking                  🔺Dragon Slayer          🔺Menu Specials\n🔺Bakoushi's Bunny              🔺Mystic Gravestone`,false)
        .setFooter(`Work in progress`);
        message.channel.send({embed});
    }
}