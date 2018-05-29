exports.run = async (client, message) => {
  //Pollux Lootbox Watcher
  if (message.author.id == `271394014358405121`){
    console.log(message.content)
    if(message.content.endsWith(`a chance to claim it!`) && message.author.id == "271394014358405121") {
      message.channel.send(`Come Grab My Box <@310296184436817930> <@384996823556685824> <@266632489546678273> <@207575115616092161> <@226358525410934794> <@267906052366794753> <@348317596606529536> <@196203663054733313>\n<@&440727495906689024>`)
    }
  } else if (message.author.id == `170915625722576896`) {
    const Discord = require("discord.js");

    var playerName = null;
    var char_currentHP = 0;
    var char_maxHP = 0;
    var pet_currentHP = 0;
    var pet_maxHP = 0;

    if (message.embeds.length === 0){
      const regex = /has \d+\d+ HP left./
      var healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
      var healthMessage = message.content.match(healthMessagePattern);
      if (healthMessage) {
        var nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
        char_currentHP = Number(nums[1].replace(/,/g,""));
        char_maxHP = Number(nums[2].replace(/,/g,""));
        playerName = message.content.split(` `)[1].replace("'s", "");
        if (playerName === "used") playerName = message.content.split(` `)[0];
      }

      const messageArray = message.content.split('\n');
      if (messageArray[3] != undefined) {
        const petInfosLine = messageArray[3].indexOf('+ Critical hit!') != -1 ? messageArray[8].split(' ') : messageArray[7].split(' ');
        pet_currentHP = parseInt(petInfosLine[petInfosLine.indexOf('has') + 1].split('/')[0].replace(',', ''));
        pet_maxHP = parseInt(petInfosLine[petInfosLine.indexOf('has') + 1].split('/')[1].replace(',', ''));
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

    var char_healthPercent = Math.round(10 * char_currentHP * 100 / char_maxHP) / 10;
    var pet_healthPercent = Math.round(10 * pet_currentHP * 100 / pet_maxHP) / 10;
    const user = client.users.find('username', playerName);
    if (user != null && playerName != undefined && char_healthPercent != pet_healthPercent) {
      if (char_healthPercent < 10){
        const embed = new Discord.RichEmbed()
          .setTitle(`__${playername} Health Warning!!! ${char_healthPercent}%__`)
          .setColor(0xff0000)
          .setDescription(`**${playername}** is at __**${char_healthPercent}**__ health or below!!! Heal...or die!!!`)
          .setImage(`https://i1.wp.com/entertainmentmesh.com/wp-content/uploads/2017/12/OMG-cat-meme-3.jpg`)
          .setFooter(`You are going to die aren't you?`)
        message.channel.send({embed}).then(msg => msg.delete(60000));
      } else { 
        var embed = new Discord.RichEmbed()
          .setAuthor(user.username, user.avatarURL)
          .addField(`__Character Health__ - **${char_healthPercent}%**`,`(${char_currentHP} HP / ${char_maxHP} HP)`, false)

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
  }
}   