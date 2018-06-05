exports.run = (client, message, args) => {
  const mysql = require("mysql")
  const config = require("./../config.json");
  const Discord = require("discord.js");
  if (message.author.id != 310296184436817930)return message.channel.send("Ummm No Please Don't Touch Me There");
  var con = mysql.createPool({
    host : config.mysqlHost,
    user : config.mysqlUser,
    password : config.mysqlPass,
    database : "heroku_39f8be6222713c4"
  });
  var table = "xp"
  if (message.mentions.users.first()){
    var targetid = message.mentions.users.first().id
  } else message.channel.send("You must mention a user to target")

  con.getConnection(function(err) {
    if(err) throw err;
  });
  var sql = `INSERT INTO ${table} (userid, xp) VALUES ('${targetid}', '5')`
  con.query(sql, function (err, result){
    if (err) throw err;
    message.channel.send(`User: ${targetid} has been added to table with 5xp`)
  })



}