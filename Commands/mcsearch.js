exports.run = (bot, message, args) => {
  const mysql = require("mysql")
  const config = require("./../config.json");
  const Discord = require("discord.js");
  const request = require('request')
//..................................................................................//
  if (message.author.id != 310296184436817930 || 320933389513523220)return message.channel.send("Ummm No Please Don't Touch Me There");
//.................................................................................//
  var con = mysql.createPool({
    host : config.mysqlHost,
    user : config.mysqlUser,
    password : config.mysqlPass,
    database : "heroku_39f8be6222713c4"
  });
//.................................................................................//
  var tradeid ;
  var itemid = args[0]
  var name ;
  var markettype ;
  var totalquant ;
  var quantcomplete ;
  var price ;
  var userid ;
  var remainingtobuy ;
//...............................................................................//
  request({uri:`http://api.discorddungeons.me/v3/trade/buy/${itemid}`, headers: {"Authorization":config.drpg_apikey} }, function(err, response, body) {
    if (err) return;
    const data = JSON.parse(body)
    const embed = new Discord.RichEmbed()
      .setTitle("Market Info")
      .setAuthor(message.author.username,message.author.avatarURL)
      .setColor(0x00AE86)
      .setDescription(`**Work in progress**`)
//.............................................................................//
    for (let [key,value] of Object.entries(data.trades)){
      tradeid = value.id
      markettype =value.type
      totalquant = value.buy.item[`${itemid}`]
      quantcomplete = value.bought
      price = value.buy.price
      userid = value.from
      remainingtobuy = Math.floor(totalquant - quantcomplete)
      if(value.bought < value.buy.item[`${itemid}`]){
        embed.addField(`__${value.id}__`,`**Remaining to buy:** ${remainingtobuy}\n**Price Per:** ${price}`,false)
        
      }
    }

    message.channel.send({embed}) 
       
  });
}