const poolQuery = require('./../../functions/database/poolQuery');
const Discord = require("discord.js");
module.exports = function(client, message, args) {
    var playerName = null;
    var char_currentHP = 0;
    var char_maxHP = 0;
    var pet_currentHP = 0;
    var pet_maxHP = 0;

    if (message.embeds.length === 0){
      if (message.content.indexOf("'s Adventure") != -1) {
        const regex = /has \d+\d+ HP left./
        var healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
        var healthMessage = message.content.match(healthMessagePattern);
        if (healthMessage) {
          var nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
          char_currentHP = Number(nums[1].replace(/,/g,""));
          char_maxHP = Number(nums[2].replace(/,/g,""));
          playerName = message.content.split(`\n`)[1].replace("'s Adventure ]========!", "").replace("!========[ ", "");
        }
  
        const messageArray = message.content.split('\n');
        if (messageArray[3] != undefined) {
          const petInfosLine = messageArray[3].indexOf('+ Critical hit!') != -1 ? messageArray[8].split(' ') : messageArray[7].split(' ');
          pet_currentHP = parseInt(petInfosLine[petInfosLine.indexOf('has') + 1].split('/')[0].replace(',', ''));
          pet_maxHP = parseInt(petInfosLine[petInfosLine.indexOf('has') + 1].split('/')[1].replace(',', ''));
        }
      }
    }
    else {
      if (message.embeds[0].author != undefined) {
        if (message.embeds[0].author.name.indexOf("Adventure") != -1) {
          const char_field = message.embeds[0].fields[1].name == "Critical Hit!" ? message.embeds[0].fields[4] : message.embeds[0].fields[3];
          char_currentHP = parseInt(char_field.value.split(' ')[1].split('/')[0].replace(',', ''));
          char_maxHP = parseInt(char_field.value.split(' ')[1].split('/')[1].replace(',', ''));

          const pet_field = message.embeds[0].fields[1].name == "Critical Hit!" ? message.embeds[0].fields[3] : message.embeds[0].fields[2];
          pet_currentHP = parseInt(pet_field.value.split(' ')[1].split('/')[0].replace(',', ''));
          pet_maxHP = parseInt(pet_field.value.split(' ')[1].split('/')[1].replace(',', ''));

          playerName = char_field.name;
        }
      }
    }
    
    const user = client.users.find('username', playerName);
    var char_healthPercent = Math.round(10 * char_currentHP * 100 / char_maxHP) / 10;
    var pet_healthPercent = Math.round(10 * pet_currentHP * 100 / pet_maxHP) / 10;
    if (user != null && playerName != undefined && char_healthPercent != pet_healthPercent) {
      poolQuery(`SELECT * FROM users WHERE userId='${user.id}'`).then((result) => {
        const drpg = function() {
          if (char_healthPercent < 10) {
            const embed = new Discord.RichEmbed()
              .setTitle(`__${user.username} Health Warning!!! - ${char_healthPercent}%__`)
              .setColor(0xff0000)
              .setDescription(`**${user.username}** is at __**${char_currentHP}**__ health!!!\n`)
              .setImage(`https://i1.wp.com/entertainmentmesh.com/wp-content/uploads/2017/12/OMG-cat-meme-3.jpg`)
              .setFooter(`You are going to die aren't you?`)
            message.channel.send(embed).then(msg => msg.delete(60000));
          } else { 
            var embed = new Discord.RichEmbed()
              .setAuthor(user.username, user.avatarURL)
              .addField(`__Character Health__ - **${char_healthPercent}%**`,`(${char_currentHP} HP / ${char_maxHP} HP)`, false)
              .setFooter(`&Config To Change Health Monitor Settings`)
    
            if (char_healthPercent <= 20 || pet_healthPercent <= 20)
              embed.setColor('RED');
            else if (char_healthPercent <= 40 || pet_healthPercent <= 40)
              embed.setColor('ORANGE');
            else if (char_healthPercent <= 60 || pet_healthPercent <= 60)
              embed.setColor('GOLD');
            else if (char_healthPercent <= 100 || pet_healthPercent <= 100)
              embed.setColor('GREEN');
    
            if (!isNaN(pet_healthPercent))
              embed.addField(`__Pet Health__ - **${pet_healthPercent}%**`, `(${pet_currentHP} HP / ${pet_maxHP} HP)`, false);
            message.channel.send({embed}).then(msg => msg.delete(30000));
          }
        }

        if (Object.keys(result).length !== 0) {
          let settings = JSON.parse(result[0].settings);
          if (settings.healthMonitor !== 'off') {
            if (settings.healthMonitor === 'on' || char_healthPercent < settings.healthMonitor || pet_healthPercent < settings.healthMonitor) {
              drpg();
            }
          }
        } else {
          drpg();
        }
      });
    }
}