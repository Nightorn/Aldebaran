const { MessageEmbed } = require("discord.js");
const mathjs = require("mathjs");
const UtilitiesCommand = require("../../structures/commands/UtilitiesCommand");

module.exports = class MathCommand extends UtilitiesCommand {
  constructor(client) {
    super(client, {
      name: "math",
      description: "Evaluates a math expression",
      usage: "Expression",
      example: "sqrt(4) * 2",
      aliases: ["calc"]
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run(bot, message, args) {
    let result;
    try {
      result =
        args.join(" ") === "10 + 9" || args.join(" ") === "10+9"
          ? 21
          : mathjs.eval(args.join(" ").replace(/,/g, ""));
    } catch (err) {
      result = "The specified math expression is invalid.";
    }
    const embed = new MessageEmbed()
      .setTitle("Math Expression Evaluation")
      .addField("Result", `\`\`\`${Number.formatNumber(result)}\`\`\``)
      .setColor("#dc3912");
    message.channel.send({ embed });
  }
};
