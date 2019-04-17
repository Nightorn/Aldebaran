const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.reply(`How about you not do that!`);
  const parametersAvailable = bot.models.settings.guild;
  if (args.length === 0 || args.indexOf("help") !== -1) {
    let description = "";
    for (const [key, data] of Object.entries(parametersAvailable))
      if (
        message.guild.members.get(data.showOnlyIfBotIsInGuild) !== undefined ||
        data.showOnlyIfBotIsInGuild === undefined
      ) {
        description += `**${key}** - ${data.help}\n`;
      }
    const embed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle("Config Command Help Page")
      .setDescription(
        `Here are the different parameters you can change to set the experience and the limitations of the members of your server.\n**Usage Example:** \`&gconfig adventureTimer off\`.\n__Note:__ This command can only be used by the owner of the server.\n${description}`
      )
      .setColor("BLUE");
    message.channel.send({ embed });
  } else if (Object.keys(parametersAvailable).indexOf(args[0]) !== -1) {
    if (parametersAvailable[args[0]].support(args[1])) {
      if (!message.guild.existsInDb) await message.guild.create();
      if (parametersAvailable[args[0]].postUpdate !== undefined) {
        /* eslint-disable no-param-reassign */
        message.guild = parametersAvailable[args[0]].postUpdate(
          args[1],
          message.guild
        );
      }
      if (parametersAvailable[args[0]].postUpdateCommon !== undefined) {
        [message.author, message.guild] = parametersAvailable[
          args[0]
        ].postUpdateCommon(args[1], message.author, message.guild);
        /* eslint-enable no-param-reassign */
      }
      message.guild
        .changeSetting(args[0], args[1])
        .then(() => {
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
      message.channel.send(
        `**Error** This value is not supported, check \`&gconfig help\` for more informations.`
      );
    }
  } else {
    message.channel.send(
      `**Error** This key does not exist, check \`&gconfig help\` for more informations.`
    );
  }
  return true;
};

exports.infos = {
  category: "Settings",
  description: "Used to enabled or disable features of aldebaran.",
  usage: "`&gconfig <parameter> <setting>`",
  example: "`&gconfig adventureTimer on`",
  restrictions: "Server Owner"
};
