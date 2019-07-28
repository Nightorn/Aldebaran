const { MessageEmbed } = require("discord.js");
const request = require("request");
const locationdb = require("../../Data/drpglocationlist.json");
const userCheck = require("../../functions/action/userCheck");

exports.run = (bot, message, args) => {
  userCheck(bot, message, args)
    .then(usrid => {
      bot.users.fetch(usrid).then(user => {
        request(
          {
            uri: `http://api.discorddungeons.me/v3/user/${usrid}`,
            headers: { Authorization: bot.config.drpg_apikey }
          },
          (err, response, body) => {
            if (err) throw err;
            let data = JSON.parse(body);
            if (data.status === 404)
              return message.reply(
                `it looks like the user you specified has not started his adventure on DiscordRPG yet.`
              );
            data = data.data; // eslint-disable-line prefer-destructuring

            const format = x => {
              return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            const skills = [];
            const attributes = [];
            for (const [key, value] of Object.entries(data.skills))
              skills.push(
                `**${key[0].toUpperCase() + key.slice(1)}** Lv${value.level}`
              );
            if (data.attributes !== undefined)
              for (const [key, value] of Object.entries(data.attributes))
                if (value !== 0)
                  attributes.push(
                    `**${key[0].toUpperCase() + key.slice(1)}** ${format(
                      value
                    )} Points`
                  );
            const embed = new MessageEmbed()
              .setAuthor(data.name, user.avatarURL())
              .setColor(data.donate ? "GOLD" : 0x00ae86)
              .setDescription(
                `${
                  data.location !== undefined
                    ? `Currently In **${
                        locationdb[`${data.location.current}`] !== undefined
                          ? `${locationdb[`${data.location.current}`].name}**`
                          : "The Abyss**"
                      }`
                    : ""
                }`
              )
              .addField(
                `Level ${format(data.level)}`,
                `**Progression** - ${format(data.kills)} **Kills** | ${
                  data.deaths
                } **Deaths** | ${format(
                  data.xp
                )} **XP**\n**Currency** - ${format(data.gold)} **Gold** | ${
                  data.lux !== undefined ? format(data.lux) : "0"
                } **Lux**`,
                false
              )
              .addField(
                `Specifications`,
                `**Skills** - ${skills.join(", ")}\n**Attributes** - ${
                  attributes.length !== 0 ? attributes.join(", ") : "None"
                }`
              )
              .setFooter(
                `${data.donate ? "Donator, " : ""}Last seen ${Math.floor(
                  (new Date() - data.lastseen) / 60000
                )} mins ago`
              );
            if (data.quest && (data.quest.current || data.quest.completed)) {
              embed.addField(
                `Quests`,
                `${
                  data.quest.current !== null
                    ? `**Current** : ${data.quest.current.name}\n`
                    : ""
                }${
                  data.quest.completed !== undefined
                    ? `**Completed (${
                        data.quest.completed.length
                      })** : ${data.quest.completed.join(", ")}`
                    : ""
                }`,
                false
              );
            }
            if (data.pet !== undefined)
              if (data.pet.xp !== undefined)
                embed.addField(
                  `Pet (${data.pet.type})`,
                  `**Name** : ${data.pet.name} | **Level** ${format(
                    data.pet.level
                  )}\n${format(data.pet.xp)} **XP** (XP Rate : ${
                    data.pet.xprate === undefined ? 0 : data.pet.xprate
                  }%) | **Damages** : [${format(
                    data.pet.damage.min
                  )} - ${format(data.pet.damage.max)}]`,
                  false
                );
            message.channel.send({ embed });
            return true;
          }
        );
      });
    })
    .catch(() => {
      message.reply(
        "The ID of the user you specified is invalid. Please retry by mentioning them or by getting their right ID."
      );
    });
};

exports.infos = {
  category: "DRPG",
  description: "Displays users character and pet infos.",
  usage: "`&stats` or `&stats <usermention>` or `&stats <userid>`",
  example: "`&stats` or `&stats @aldebaran` or `&stats 246302641930502145`",
  cooldown: {
    time: 5000,
    rpm: 25,
    resetTime: 60000,
    commandGroup: "drpg"
  }
};
