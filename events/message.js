const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message) => {
  if (message.guild.settings.aldebaran === "off") {
    setTimeout(() => {
      message.guild.changeSetting("aldebaran", "on");
    }, 60000);
    return;
  }
  if (message.author.id == "271394014358405121") require('./../functions/bots/Pollux.js')(bot, message);
  else if (message.author.id === "170915625722576896") {
    require(`${process.cwd()}/functions/bots/DiscordRPG.js`)(bot, message);
    require(`${process.cwd()}/functions/timer/DiscordRPG/travel.js`)(bot, message); 
  } else if (!message.author.bot) {
    require(`${process.cwd()}/functions/timer/DiscordRPG/adv.js`)(message); 
    require(`${process.cwd()}/functions/timer/DiscordRPG/sides.js`)(message);
    require(`${process.cwd()}/functions/timer/DiscordRPG/padv.js`)(message);  
  }
  
  if (message.author.bot) return;
  const prefix = process.argv[2] === 'dev' ? process.argv[3] || bot.config.prefix : message.guild.prefix;
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const sliced = command.slice(1);
    if (command.indexOf("?") === 0) {
      message.channel.send({
        embed: bot.commands.getHelp(prefix, sliced)
      });
    } else if (command.indexOf("#") === 0) {
      try {
        bot.commands.bypassRun(sliced, message);
      } catch (err) {
        if (err.message === "INVALID_COMMAND") return;
        if (err.message === "UNALLOWED_ADMIN_BYPASS") {
          const embed = new MessageEmbed()
            .setTitle("You are not allowed to use this.")
            .setDescription(
              "By using `#`, you are trying to bypass Discord permissions requirements and other checks, which is only allowed for Aldebaran Administrators."
            )
            .setFooter(message.author.username, message.author.avatarURL())
            .setColor("RED");
          message.channel.send({ embed });
        }
      }
    } else {
      bot.commands.execute(command, message);
    }
    console.log(
      `\x1b[34m- COMMAND: ${command} | USER: ${message.author.tag} (${
        message.author.id
      }) | ARGS: ${args.join(" ") || "None"}\x1b[0m`
    );
  } catch (err) {
    if (err.message === "INVALID_COMMAND") return;
    if (err.message === "NOT_NSFW_CHANNEL") {
      const embed = new MessageEmbed()
        .setTitle("You are using this command wrongly.")
        .setDescription(
          "As this command shows NSFW content, you need to use this command in a NSFW channel."
        )
        .setFooter(message.author.username, message.author.avatarURL())
        .setColor("RED");
      message.channel.send({ embed });
    } else {
      console.error(err);
    }
  }
};
