const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
  let text = args.join(" ");
  text = text.replace(/r|l/g, "w");
  const embed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setTitle("owoifier")
    .setDescription(text)
    .setColor("PINK");
  message.channel.send({ embed });
};

exports.infos = {
  category: "Fun",
  description: "OwOify Text Sent (150 Char. Limit)",
  usage: "`&owoify <text>`",
  example: "`&owoify why is the grass green`"
};
