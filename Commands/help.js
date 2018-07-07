exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    var category = (args[0] != undefined) ? args[0].toLowerCase() : `none`
    if (category == `drpg`){
        const embed = new Discord.RichEmbed()
        .setTitle("DRPG Commands Help")
        .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
        .setDescription("You can find command list and usage example for DRPG related commands below.")
        .addField(`**__Plant__**`,`**Description**: Used to show users current fields and esitmates if harvested.\n*Useage: \`&plant\` , \`&plant <user mention>\` , \`&plant <userid>\`*`)
        .setTimestamp ()
        message.channel.send({embed});
    }
        else if (category == `action`) {
            const embed = new Discord.RichEmbed()
            .setTitle("Action Commands Help")
            .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
            .setDescription("You can find command list and usage example for action commands below.")
            .setTimestamp ()
            message.channel.send({embed});
        }
            else if (category == `image`) {
                const embed = new Discord.RichEmbed()
                .setTitle("Image Commands Help")
                .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
                .setDescription("You can find command list and usage example for Image related commands below.")
                .setTimestamp ()
                message.channel.send({embed});
            }
                else if (category == `general`) {
                    const embed = new Discord.RichEmbed()
                    .setTitle("Misc. Commands Help")
                    .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
                    .setDescription("You can find command list and usage example for general commands below.")
                    .setTimestamp ()
                    message.channel.send({embed});
                }
                    else if (category == `fun`) {
                        const embed = new Discord.RichEmbed()
                        .setTitle("Fun Commands Help")
                        .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
                        .setDescription("You can find command list and usage example for fun related commands below.")
                        .setTimestamp ()
                        message.channel.send({embed});
                    }
                        else if (category == `nsfw`) {
                            const embed = new Discord.RichEmbed()
                            .setTitle("NSFW Commands Help")
                            .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
                            .setDescription("You can find command list and usage example for NSFW commands below.")
                            .setTimestamp ()
                            message.channel.send({embed});
                        }
                            else if (category == `none`) {
                                const embed = new Discord.RichEmbed()
                                .setTitle("Aldebaran's Help Categories")
                                .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
                                .setDescription("Below are the different help categories.\n\n*Useage example:* \`&help Image\`")
                                .addField("⚔__**DRPG Commands**__🛡","Utility commands for Discord RPG Bot",false)
                                .addField("📽__**Action Commands**__🎥","Fun commands to preform on others",false)
                                .addField("🐱__**Image Commands**__🐦","Commands to display images",false)
                                .addField("💡__**General Commands**__🔦","General use commands",false)              
                                .addField("🎟__**Fun Commands**__🎭","Commands used for fun or entertainment",false)       
                                .addField("🚫__**NSFW Commands**__⛔","NSFW Image and Action Commands, Usable In NSFW Channels Only",false)
                                .addField("__**Have a command request or suggestion?**__", "*Join support server*- https://discord.gg/3x6rXAv",false)
                                .setFooter("In Development By Nightmare#1234")
                                .setTimestamp ()
                                message.channel.send({embed}); 
                            }
                            else message.channel.send(`Please enter a correct category from &help`)    
}
exports.infos = {
    category: "General",
    description: "Displays Detailed Help Info",
    usage: "\`&help\`",
    example: "\`&help\`",
}

