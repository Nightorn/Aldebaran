/* eslint consistent-return: off */
/* eslint no-else-return: off */
const { MessageEmbed } = require("discord.js");
const deathimage = require("../../Data/imageurls.json");

const embedColor = (playerPercentage, petPercentage) => {
  if (playerPercentage <= 20 || petPercentage <= 20) return "RED";
  else if (playerPercentage <= 40 || petPercentage <= 40) return "ORANGE";
  else if (playerPercentage <= 60 || petPercentage <= 60) return "GOLD";
  else if (playerPercentage <= 100 || petPercentage <= 100) return "GREEN";
};

const checkPlayer = (message, username) => {
  const matchedMessage = message.channel.messages.find(
    msg => msg.author.username === username
  );
  return matchedMessage !== undefined ? matchedMessage.author : null;
};

const thirdAdventureEmbed = (player, playerHP, petHP, message) => {
  const user = checkPlayer(message, player);
  if (user === null) return;
  if (user.settings.healthMonitor === "on") {
    const embed = new MessageEmbed()
      .setAuthor(user.username, user.avatarURL())
      .addField("__Character Health__", playerHP)
      .addField("__Pet Health__", petHP)
      .setColor(
        embedColor(
          parseInt(playerHP.replace("%", ""), 10),
          parseInt(petHP.replace("%", ""), 10)
        )
      )
      .setFooter(
        `Use ${
          message.guild.prefix
        }uconfig healthMonitor to change your settings.`
      );
    message.channel.send({ embed });
  }
};

module.exports = (client, message) => {
  if (message.guild.settings.healthMonitor === "off") return;
  const senddeath =
    deathimage.deathimage[
      Math.floor(Math.random() * deathimage.deathimage.length)
    ];
  const player = {
    name: null,
    currentHP: 0,
    maxHP: 0
  };
  const pet = {
    currentHP: 0,
    maxHP: 0
  };
  if (message.embeds.length === 0) {
    if (message.content.indexOf("'s Adventure") !== -1) {
      if (message.content.indexOf(") | +") !== -1) {
        player.name = message.content
          .split(`\n`)[1]
          .replace("'s Adventure ]======!", "")
          .replace("!======[ ", "");
        const splitted = message.content.split("\n");
        const critical = message.content.indexOf("Critical hit!") !== -1;
        return thirdAdventureEmbed(
          player.name,
          splitted[critical ? 4 : 3].replace(player.name, "").split(" ")[2],
          splitted[critical ? 5 : 4].substr(
            splitted[4].indexOf(":") + 2,
            splitted[4].indexOf("%") - splitted[4].indexOf(":") - 1
          ),
          message
        );
      } else {
        const healthMessagePattern = /( has [\d,]+\/[\d,]+ HP left\.)|(used .+? and got [\d,]+?HP\. \([\d,]+\/[\d,]+HP\))|(Health: [\d,]+\/[\d,]+HP\.)/;
        const healthMessage = message.content.match(healthMessagePattern);
        if (healthMessage) {
          const nums = healthMessage[0].match(/([\d,]+)\/([\d,]+)/);
          player.currentHP = Number(nums[1].replace(/,/g, ""));
          player.maxHP = Number(nums[2].replace(/,/g, ""));
          player.name = message.content
            .split(`\n`)[1]
            .replace("'s Adventure ]======!", "")
            .replace("!======[ ", "");
        }
        const messageArray = message.content.split("\n");
        let dealtLine = null;
        let tookLine = null;
        for (const i in messageArray) {
          if (messageArray[i].indexOf(" dealt ") !== -1)
            dealtLine = parseInt(i, 10);
          if (messageArray[i].indexOf(" took ") !== -1)
            tookLine = parseInt(i, 10);
        }
        if (tookLine === dealtLine + 1) {
          const petInfosLine = messageArray[tookLine + 1].split(" ");
          pet.currentHP = parseInt(
            petInfosLine[petInfosLine.indexOf("has") + 1]
              .split("/")[0]
              .replace(",", ""),
            10
          );
          pet.maxHP = parseInt(
            petInfosLine[petInfosLine.indexOf("has") + 1]
              .split("/")[1]
              .replace(",", ""),
            10
          );
        }
      }
    }
  } else if (message.embeds[0].author !== undefined) {
    const adventureEmbed = message.embeds[0];
    if (message.embeds[0].author.name.indexOf("Adventure") !== -1) {
      const playerData = adventureEmbed.fields[0].value.split("\n")[3];
      const petData = adventureEmbed.fields[
        adventureEmbed.fields[1].name === "Critical Hit!" ? 2 : 1
      ].value.split("\n")[2];
      player.name = adventureEmbed.author.name.replace("'s Adventure", "");
      [player.currentHP, player.maxHP] = playerData.split(" ")[1].split("/");
      [pet.currentHP, pet.maxHP] = petData.split(" ")[1].split("/");
      player.currentHP = parseInt(player.currentHP.replace(",", ""), 10);
      player.maxHP = parseInt(player.maxHP.replace(",", ""), 10);
      pet.currentHP = parseInt(pet.currentHP.replace(",", ""), 10);
      pet.maxHP = parseInt(pet.maxHP.replace(",", ""), 10);
    }
  }

  const user = checkPlayer(message, player.name);
  if (user === null) return;
  player.healthPercent =
    Math.round((1000 * player.currentHP) / player.maxHP) / 10;
  pet.healthPercent = Math.round((10 * pet.currentHP * 100) / pet.maxHP) / 10;
  if (
    user !== undefined &&
    player.name !== undefined &&
    player.healthPercent !== pet.healthPercent
  ) {
    if (user.settings.healthMonitor === "off") return;
    const { healthMonitor, individualHealthMonitor } = user.settings;
    const playerWarning = () => {
      const embed = new MessageEmbed()
        .setTitle(
          `__${user.username} Health Warning!!! - ${player.healthPercent}%__`
        )
        .setColor(0xff0000)
        .setDescription(
          `**${user.username}** is at __**${player.currentHP}**__ health!!!\n`
        )
        .setImage(senddeath)
        .setFooter(`You are going to die aren't you?`);
      message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
    };
    const petWarning = () => {
      const embed = new MessageEmbed()
        .setTitle(
          `__${user.username} PET Health Warning!!! - ${pet.healthPercent}%__`
        )
        .setColor(0xff0000)
        .setDescription(
          `**${user.username}** your pet is at __**${
            pet.currentHP
          }**__ health!!!\n`
        )
        .setImage(senddeath)
        .setFooter(`OMG YOU ARE GOING TO LET YOUR PET DIE????`);
      message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
    };
    const general = () => {
      const embed = new MessageEmbed()
        .setAuthor(user.username, user.avatarURL())
        .setFooter(`&uconfig To Change Health Monitor Settings`);

      if (individualHealthMonitor !== "pet")
        embed.addField(
          `__Character Health__ - **${player.healthPercent}%**`,
          `(${player.currentHP} HP / ${player.maxHP} HP)`,
          false
        );
      if (
        !Number.isNaN(pet.healthPercent) &&
        individualHealthMonitor !== "character"
      ) {
        embed.addField(
          `__Pet Health__ - **${pet.healthPercent}%**`,
          `(${pet.currentHP} HP / ${pet.maxHP} HP)`,
          false
        );
      }
      if (
        (Number.isNaN(pet.healthPercent) || pet.healthPercent === 0) &&
        individualHealthMonitor !== "character"
      ) {
        embed.addField(
          `__Pet Condition__`,
          `**DEAD** or not able to deal damages.`
        );
      }
      if (embed.fields.length === 0) return;
      if (player.healthPercent <= 20 || pet.healthPercent <= 20)
        embed.setColor("RED");
      else if (player.healthPercent <= 40 || pet.healthPercent <= 40)
        embed.setColor("ORANGE");
      else if (player.healthPercent <= 60 || pet.healthPercent <= 60)
        embed.setColor("GOLD");
      else if (player.healthPercent <= 100 || pet.healthPercent <= 100)
        embed.setColor("GREEN");
      message.channel
        .send({ embed })
        .then(msg => msg.delete({ timeout: 30000 }));
    };

    if (["character", "pet"].indexOf(individualHealthMonitor) !== -1) {
      if (
        individualHealthMonitor === "character" &&
        player.healthPercent < 11 &&
        (player.healthPercent <= healthMonitor || healthMonitor === "on")
      ) {
        return playerWarning();
      }
      if (
        individualHealthMonitor === "pet" &&
        pet.healthPercent < 11 &&
        (pet.healthPercent <= healthMonitor || healthMonitor === "on")
      ) {
        return petWarning();
      }
      if (
        player.healthPercent <= healthMonitor ||
        pet.healthPercent <= healthMonitor ||
        healthMonitor === "on"
      ) {
        return general();
      }
    } else if (
      player.healthPercent < 11 &&
      (player.healthPercent <= healthMonitor || healthMonitor === "on")
    ) {
      return playerWarning();
    } else if (
      pet.healthPercent < 11 &&
      (pet.healthPercent <= healthMonitor || healthMonitor === "on")
    ) {
      return petWarning();
    } else if (
      player.healthPercent <= healthMonitor ||
      pet.healthPercent <= healthMonitor ||
      healthMonitor === "on"
    ) {
      return general();
    }
  }
};
