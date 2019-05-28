const { MessageEmbed } = require("discord.js");
const mathjs = require("mathjs");

exports.run = (bot, message, args) => {
  let result;
  try {
    result = args.join(" ") === "10 + 9" ? 21 : mathjs.eval(args.join(" "));
  } catch (err) {
    result = "The specified math expression is invalid.";
  }
  const embed = new MessageEmbed()
    .setTitle("Math Expression Evaluation")
    .addField("Result", `\`\`\`${result}\`\`\``)
    .setColor("#dc3912");
  message.channel.send({ embed });
};

exports.infos = {
  category: "Utilities",
  description: "Evaluates a math expression",
  usage: "&math `<expression>`",
  example: "&math `sqrt(4) * 2`"
};
