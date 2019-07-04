const { MessageEmbed } = require("discord.js");
const view = require("./admin/view");
const clear = require("./admin/clear");
const mod = require("./admin/mod");
// const ignore = require("./admin/ignore");

exports.run = (bot, message, args) => {
  if (!message.author.checkPerms("MODERATOR")) return;
  if (args[0] === "view") {
    view(bot, message, args);
  } else if (args[0] === "clear") {
    clear(bot, message, args);
  } else if (args[0] === "mod") {
    mod(bot, message, args);
  } else if (args[0] === "ignore") {
    ignore(bot, message, args);
  } else {
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle("Warning")
      .setDescription(`The admin action specified is invalid.`)
      .setColor(`ORANGE`);
    message.channel.send({ embed });
  }
};

exports.infos = {
  category: "Developer",
  description: "Admin Portal Command",
  usage: "`&admin`",
  example: "`&admin`"
};
