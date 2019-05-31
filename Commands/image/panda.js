const request = require("request");
const { MessageEmbed } = require("discord.js");

exports.run = (bot, message) => {
  request(
    { uri: "https://some-random-api.ml/img/panda" },
    (err, response, body) => {
      const { link } = JSON.parse(body);
      const embed = new MessageEmbed()
        .setTitle(`**__Panda Panda Panda__**`)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor(0x00ae86)
        .setImage(link)
        .setFooter(
          `Your panda has been delivered with ${link} via Some Random Api!`
        );
      message.channel.send({ embed });
    }
  );
};

exports.infos = {
  category: "Image",
  description: "Displays a random panda picture or gif.",
  usage: "`&panda`",
  example: "`&panda`"
};
