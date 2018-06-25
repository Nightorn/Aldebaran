const config = require('./../../config.json');
const Discord = require("discord.js")
module.exports = function(bot, message, args) {
    if (message.content.toLowerCase().startsWith(`#!adv`)){
      if(message.channel.id == `172388244007288832`){
        message.delete(1000);
        setTimeout((channel, userid) => {
          message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
            msg.delete(3000)
          }).catch();
        }, 13500, message.channel, message.author.id)
      }
    }

    else if (message.content.toLowerCase().startsWith(`,adv`)){
      message.delete(1000);
      setTimeout((channel, userid) => {
        message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
          msg.delete(3000)
        }).catch();
      }, 13500, message.channel, message.author.id)  
    }
    
    else if (message.content.toLowerCase().startsWith(`.adv`)){
      message.delete(1000);
      setTimeout((channel, userid) => {
        message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
          msg.delete(3000)
        }).catch();
      }, 13500, message.channel, message.author.id)
    }

    else if (message.content.toLowerCase().startsWith(`#!mine`)){
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
              })
              .catch();
          }, 315000, message.channel, message.author.id)
  
      }else {
          const embed1 = new Discord.RichEmbed()
          .setDescription(`Timer Canceled`)
          .setAuthor(`${message.author.username}`)
          .setColor(`Red`)
          let timernotset = await message.channel.send(embed1);
          timernotset.delete(5000)
      }
    }
}
