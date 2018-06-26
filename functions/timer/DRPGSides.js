const config = require('./../../config.json');
const Discord = require("discord.js");
const poolQuery = require('./../../functions/database/poolQuery');
module.exports = async function(bot, message, args) {
    if (message.content.toLowerCase().startsWith(`#!mine`)|| message.content.toLowerCase().startsWith(`,mine`)|| message.content.toLowerCase().startsWith(`.mine`)){
      poolQuery(`SELECT * FROM guilds WHERE guildid ='${message.guild.id}'`).then((result) =>{
        if (Object.keys(result).length != 0){
          let settings = JSON.parse(result[0].settings);
          if (settings.sidesTimer === `on`){
            poolQuery(`SELECT * FROM users WHERE userId='${message.author.id}'`).then((result) => {
            const sidetimer = async function () {
              const cancel = "🚫"
              message.delete(100);
              const embed3 = new Discord.RichEmbed()
              .setAuthor(`${message.author.username}`)
              .setColor(0x00AE86)
              .setDescription(`React with 🚫 to cancel timer. `)
              let mesg = await message.channel.send(embed3);
              await mesg.react(cancel);
              const reactions = await mesg.awaitReactions(reaction => reaction.emoji.name === cancel,{time: 5000});
              const cancelcheck = (reactions.get(cancel).count-1)
              mesg.delete(5000)
              if(cancelcheck == 0){
                const embed = new Discord.RichEmbed()
                .setDescription(`Your sides timer has been set!`)
                .setAuthor(`${message.author.username}`)
                .setColor(0x00AE86)
                let timerset = await message.channel.send({embed})
                timerset.delete(5000)
                setTimeout((channel, userid) => {
                  message.channel.send(`<@${message.author.id}> sides time! :rolling_eyes:`)
                  .then(msg => {
                    msg.delete(180000)
                  }).catch();
                }, 312500, message.channel, message.author.id)
              } else {
                const embed1 = new Discord.RichEmbed()
                .setDescription(`Timer Canceled`)
                .setAuthor(`${message.author.username}`)
                .setColor(`Red`)
                let timernotset = await message.channel.send(embed1);
                timernotset.delete(5000)
              }
            }
          if (Object.keys(result).length != 0) {
            let settings = JSON.parse(result[0].settings);
            if (settings.sidesTimer === `on`) {
              sidetimer();
            }
          }
        })  
      }
    }
  })
  }
}     
