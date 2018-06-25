const config = require('./../../config.json');
module.exports = function(bot, message, args) {
    if (message.content.startsWith(`#!adv`)){
      message.delete(1000);
      setTimeout((channel, userid) => {
        message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
          msg.delete(20000)
        }).catch();
      }, 13500, message.channel, message.author.id)
    }

    else if (message.content.startsWith(`,adv`)){
      message.delete(1000);
      setTimeout((channel, userid) => {
        message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
          msg.delete(20000)
        }).catch();
      }, 13500, message.channel, message.author.id)  
    }
    
    else if (message.content.startsWith(`.adv`)){
      message.delete(1000);
      setTimeout((channel, userid) => {
        message.channel.send(`<@${message.author.id}> adventure time! :crossed_swords:`).then(msg => {
          msg.delete(20000)
        }).catch();
      }, 13500, message.channel, message.author.id)
    }
}
