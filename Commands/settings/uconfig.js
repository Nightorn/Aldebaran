const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
  const parametersAvailable = bot.models.settings.user;
  if (args.length === 0) {
    const { prefix } = message.guild;
    const embed = new MessageEmbed()
      .setAuthor(`User Settings`, bot.user.avatarURL())
      .setDescription(
        `Welcome to your user settings! This command allows you to customize Aldebaran to your needs. The available properties are listed in \`${prefix}uconfig list\`, and your current settings are shown in \`${prefix}uconfig view\`. To change a property, you need to use this command like that: \`${prefix}uconfig property value\`, and one example is \`${prefix}uconfig adventureTimer on\`.`
      )
      .setColor("BLUE")
      .setFooter(
        `Make sure to also use \`${prefix}gconfig\` for server settings.`
      );
    message.channel.send({ embed });
  } else if (args.includes("list")) {
    const list = {};
    for (const [key, data] of Object.entries(parametersAvailable))
      if (
        message.guild.members.get(data.showOnlyIfBotIsInGuild) !== undefined ||
        data.showOnlyIfBotIsInGuild === undefined
      ) {
        if (list[data.category] === undefined) list[data.category] = {};
        list[data.category][key] = data;
      }
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle("Config Command Help Page")
      .setDescription(
        `**__IMPORTANT: If setting is disabled in &gconfig by server owner, it will be ignored.__** If a server setting is undefined, a :warning: icon will appear in front of the concerned properties.`
      )
      .setColor("BLUE");
    for (const [category, parameters] of Object.entries(list)) {
      let entries = "";
      for (const [key, data] of Object.entries(parameters)) {
        if (
          message.guild.settings[key] === undefined &&
          bot.models.settings.guild[key] !== undefined
        )
          entries += ":warning: ";
        entries += `**${key}** - ${data.help}\n`;
      }
      embed.addField(category, entries);
    }
    message.channel.send({ embed });
  } else if (args.includes("view")) {
    let list = "";
    for (const [key, value] of Object.entries(message.author.settings)) {
      list += `**${key}** - \`${value}\`\n`;
    }
    const embed = new MessageEmbed()
      .setAuthor(`User Settings  |  Overview`, bot.user.avatarURL())
      .setDescription(list === "" ? "None" : list)
      .setColor("BLUE");
    message.channel.send({ embed });
  } else if (Object.keys(parametersAvailable).indexOf(args[0]) !== -1) {
    if (parametersAvailable[args[0]].support(args[1])) {
      if (!message.author.existsInDb) await message.author.create();
      message.author
        .changeSetting(args[0], args[1])
        .then(() => {
          if (parametersAvailable[args[0]].postUpdate !== undefined) {
            /* eslint-disable no-param-reassign */
            message.author = parametersAvailable[args[0]].postUpdate(
              args[1],
              message.author
            );
          }
          if (parametersAvailable[args[0]].postUpdateCommon !== undefined) {
            [message.author, message.guild] = parametersAvailable[
              args[0]
            ].postUpdateCommon(args[1], message.author, message.guild);
            /* eslint-disable no-param-reassign */
          }
          const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`Settings successfully changed`)
            .setDescription(
              `The property **\`${
                args[0]
              }\`** has successfully been changed to the value **\`${
                args[1]
              }\`**.`
            )
            .setColor("GREEN");
          message.channel.send({ embed });
        })
        .catch(err => {
          const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setTitle(`An Error Occured`)
            .setDescription(
              `An error occured and we could not change your settings. Please retry later.`
            )
            .setColor("RED");
          message.channel.send({ embed });
          throw err;
        });
    } else {
      message.channel.send({
        embed: {
          color: 0xff0000,
          title: "Not supported",
          description:
            "This value is not vaild. Please check `&uconfig help` for the vaild values for this setting."
        }
      });
    }
  } else {
    message.channel.send({
      embed: {
        color: 0xff0000,
        title: "Invaild key",
        description:
          "This key does not exist. Check `&uconfig help` for the keys accepted.."
      }
    });
  }
};

exports.infos = {
  category: "Settings",
  description: "Changes User Configurations For Aldebaran Features",
  usage: "`&uconfig <parameter> <setting>`",
  example: "`&uconfig adventureTimer on`"
};
