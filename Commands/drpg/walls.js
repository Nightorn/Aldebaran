const Discord = require("discord.js");
const request = require("request");
const bases = require("../../Data/bases.json");
const userCheck = require("../../functions/action/userCheck");

exports.run = async (bot, message, args) => {
  function calcWall(lvl, base, prevWall) {
    const L = parseInt(lvl, 10);
    const B = parseInt(base, 10);
    const C = prevWall ? parseInt(prevWall, 10) : 25;
    return L * (B + C) + L ** 2 * (B - C);
  }
  function findKeyAbove(lvl) {
    let level = lvl;
    while (bases[level] === undefined) {
      level++;
    }
    return level;
  }
  function findKeyBelow(lvl) {
    let level = lvl;
    while (bases[level] === undefined && level > 0) {
      level--;
    }
    return level;
  }
  function userWall(lvl) {
    const baseLvl = findKeyAbove(lvl);
    const prevBaseLvl = findKeyBelow(lvl - 1);
    const base = bases[baseLvl];
    let prevBase = 0;
    if (!bases[prevBaseLvl]) {
      prevBase = 25;
    } else {
      prevBase = bases[prevBaseLvl];
    }
    const wall = calcWall(baseLvl, base, prevBase);

    return [wall, parseInt(baseLvl, 10)];
  }
  function calcXPNeeded(base, lvl) {
    return base * (lvl ** 2 + lvl);
  }

  try {
    const userid = await userCheck(bot, message, args);
    const user = await bot.users.fetch(userid);
    request(
      {
        uri: `http://api.discorddungeons.me/v3/user/${userid}`,
        headers: { Authorization: bot.config.drpg_apikey }
      },
      (err, res, body) => {
        if (err) throw err;
        let data = JSON.parse(body);
        if (data.status === 404) {
          message.reply(
            "It looks like the player you mentioned hasn't started their adventure on DiscordRPG."
          );
          return;
        }
        data = data.data;

        const [wall, baseLvl] = userWall(data.level);
        const userAtWall = data.level === baseLvl;
        const xpNeeded = calcXPNeeded(bases[baseLvl], baseLvl);
        const wallProgress = xpNeeded - data.xp;

        const embed = new Discord.MessageEmbed()
          .setColor(0x00ae86)
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setTitle(`${user.username}'s DRPG Walls`)
          .addField(
            `Base at Level ${baseLvl}`,
            `The baseXP (the increment of XP needed to level up - the "XP ramp") for Level ${baseLvl} is ${bases[baseLvl]}.`
          );

        if (userAtWall) {
          embed.addField(
            `Level ${baseLvl} wall`,
            `They're at a ${wall.toLocaleString("en-US")} XP wall.`
          );
          embed.addField(
            `${user.username}'s progress`,
            `${wallProgress} / ${wall} XP (**${Math.floor(
              (wallProgress / wall) * 100
            )}%**)`
          );
        } else {
          embed.addField(
            `${user.username}'s next wall`,
            `Level ${baseLvl}: ${wall.toLocaleString(
              "en-US"
            )} XP wall\nYou will need ${xpNeeded.toLocaleString(
              "en-US"
            )} XP total at level ${baseLvl}.`
          );
        }

        message.channel.send({ embed });
      }
    );
  } catch (err) {
    const [wall, baseLvl] = userWall(args[0]);
    const xpNeeded = calcXPNeeded(bases[baseLvl], baseLvl);

    const embed = new Discord.MessageEmbed()
      .setColor(0x00ae86)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Wall closest to Level ${args[0]}`)
      .addField(
        `Base at Level ${baseLvl}`,
        `The baseXP (the increment of XP needed to level up - the "XP ramp") for Level ${baseLvl} is ${bases[baseLvl]}.`
      )
      .addField(
        `Level ${baseLvl} wall`,
        `The wall at Level ${baseLvl} is ${wall.toLocaleString(
          "en-US"
        )} XP. You will need ${xpNeeded.toLocaleString(
          "en-US"
        )} XP total to progress at that level.`
      );

    message.channel.send({ embed });
  }
};
exports.infos = {
  category: "DRPG",
  description: "Displays users walls information.",
  usage: "`&walls` or `&walls <usermention>` or `&walls <userid>`",
  example: "`&walls` or `&walls @aldebaran` or `&walls 246302641930502145`",
  cooldown: {
    time: 5000,
    rpm: 25,
    resetTime: 60000,
    commandGroup: "drpg"
  }
};
