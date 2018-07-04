const poolQuery = require('./../../functions/database/poolQuery');
module.exports = function(bot, message, args) {
  if (message.content.toLowerCase().startsWith(`#!adv`) || message.content.toLowerCase().startsWith(`,adv`)||message.content.toLowerCase().startsWith(`.adv`)){
    poolQuery(`SELECT * FROM guilds WHERE guildid ='${message.guild.id}'`).then((result) =>{
      if (Object.keys(result).length != 0){
        let settings = JSON.parse(result[0].settings);
        if (settings.adventureTimer === `on`){
          poolQuery(`SELECT * FROM users WHERE userId='${message.author.id}'`).then((result) => {
            const timer = function(){
              message.delete(1000);
              setTimeout((channel, userid) => {
                message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
                  msg.delete(10000)
                }).catch();
              }, 13250, message.channel, message.author.id)
            }
      
            if (Object.keys(result).length != 0) {
              let settings = JSON.parse(result[0].settings);
              if (settings.adventureTimer === `on`) {
                timer();
              }
            }
          });
        }
      }
    })
  }
}
