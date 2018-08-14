const poolQuery = require(`${process.cwd()}/functions/database/poolQuery`);
module.exports = function(bot, message, args,advtimer) {
  if (message.content.toLowerCase().startsWith(`#!adv`) || message.content.toLowerCase().startsWith(`,adv`)||message.content.toLowerCase().startsWith(`.adv`)){
    poolQuery(`SELECT * FROM guilds WHERE guildid ='${message.guild.id}'`).then((result) =>{
      if (Object.keys(result).length != 0){
        let settingsg = JSON.parse(result[0].settings);
        if (settingsg.adventureTimer === `on`){
          poolQuery(`SELECT * FROM users WHERE userId='${message.author.id}'`).then((result) => {
            const timer = function(){
              if (settingsg.autoDelete !== `off`){message.delete(1000);}
              if (bot.advtimer.has(message.author.id))return;
              bot.advtimer.set(message.author.id);
              setTimeout((channel, userid) => {
                bot.advtimer.delete(message.author.id)
                message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`);
                //bot should only delete if autodelete is on man!
              }, 13250, message.channel, message.author.id)
            }
      
            if (Object.keys(result).length != 0) {
              let settings = JSON.parse(result[0].settings);
              if (settings.adventureTimer === `on`) {
                timer();
              }
            }
          }).catch();
        }
      }
    })
  }
}
