exports.run = (client, message) => {
  //Pollux Lootbox Watcher
  if (message.author.id == `271394014358405121` ){
    console.log(message.content)
    if(message.content.endsWith(`a chance to claim it!`)) {
      message.channel.send(`Come Grab My Box <@310296184436817930> <@384996823556685824> <@266632489546678273> <@207575115616092161>`)
    }
  }
  const regex = /has \d+\d+ HP left./
  const Discord = require("discord.js");
  if (message.author.id == `170915625722576896`) {
    if(message.embeds.length === 0){
      var healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
      var healthMessage = message.content.match(healthMessagePattern);
      if(healthMessage){
        var nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
        var health = Number(nums[1].replace(/,/g,""));
        var maxHealth = Number(nums[2].replace(/,/g,""));
        var playername = message.content.split(` `)[1];
        if (playername === "used") playername = message.content.split(` `)[0];
        console.log(healthMessage);
        console.log(nums);
        console.log(health);
        console.log(maxHealth)
        console.log(playername)
        var healthPercent = (Math.floor((health/maxHealth)*100))
        if (healthPercent < 10){
          const embed = new Discord.RichEmbed()
            .setTitle(`__${playername} Health Warning!!! ${healthPercent}%__`)
            .setColor(0xff0000)
            .setDescription(`**${playername}** is at __**10%**__ health or below!!! Heal...or die!!!`)
            .setImage(`https://i1.wp.com/entertainmentmesh.com/wp-content/uploads/2017/12/OMG-cat-meme-3.jpg`)
            .setFooter(`Your going to die arent you?`)
          message.channel.send({embed})
        }else message.channel.send(`${playername} Health at **${healthPercent}%**.`)
      }
    }
    else {
     return console.log(`Using A Embed Adv`)
    }
  }
}   