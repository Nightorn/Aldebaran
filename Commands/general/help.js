const { MessageEmbed } = require("discord.js");
const categories = require("../../Data/categories.json");

exports.run = (bot, message, args) => {
  const category = categories[args[0].toLowerCase()];
  if (args[0] !== undefined) {
    const commands = {};

    for (const [name, data] of bot.commandHandler.commands) {
      if (commands[data.category.toLowerCase()] === undefined)
        commands[data.category.toLowerCase()] = new Map();
      commands[data.category.toLowerCase()].set(name, data.description);
    }

    if (commands[args[0].toLowerCase()] instanceof Map) {
      if (commands[args[0].toLowerCase()].size > 0) {
        let list = ``;
        for (const [command, description] of commands[args[0].toLowerCase()])
          list += `:small_blue_diamond: **${command}** : ${description}\n`;
        const embed = new MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL())
          .setTitle(`__**${category.title}**__`)
          .setDescription(`${category.description}\n${list}`)
          .setColor("BLUE");
        message.channel.send({ embed });
      } else {
        message.channel.send(
          "**Error** No command of the specified category was found. Get a list of all available commands with `&commands`."
        );
      }
    } else if (bot.commandHandler.commands.get(args[0]) !== undefined) {
      const command = bot.commandHandler.commands.get(args[0]);
      const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle(`Details of the ${args[0].toLowerCase()} Command`)
        .setDescription(command.description)
        .addField(`Category`, command.category, true)
        .addField(`Usage`, command.usage, true)
        .addField(`Example`, command.example, true)
        .setColor(`BLUE`);
      message.channel.send({ embed });
    } else {
      message.channel.send(
        "**Error** No command was found. Get a list of all available commands with `&commands`."
      );
    }
  } else {
    const embed = new MessageEmbed()
      .setAuthor("Aldebaran's Help Pages", bot.user.avatarURL())
      .setDescription(
        "Below are the different categories, each of them contains a list of commands which you can see with `&help <category name>`. You can get a brief overview of all available commands with `&commands`."
      );
    for (const [, data] of Object.entries(categories))
      if (data.name !== "Developer")
        embed.addField(`__**${data.title}**__`, data.description, true);
    embed.addField(
      "**__Have a command request or suggestion?__**",
      "Join our support server by clicking [right here](https://discord.gg/3x6rXAv)!",
      true
    );
    message.channel.send({ embed });
  }
};

exports.infos = {
  category: "General",
  description: "Displays Detailed Help Info",
  usage: "`&help`",
  example: "`&help`"
};
