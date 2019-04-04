/* eslint consistent-return: off */
const Discord = require("discord.js");
const deathimage = require("../../Data/imageurls.json");

module.exports = (client, message) => {
  if (message.guild.settings.healthMonitor === "off") return;
  const senddeath =
    deathimage.deathimage[Math.random() * deathimage.deathimage.length];
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
  } else if (message.embeds[0].author !== undefined) {
    if (message.embeds[0].author.name.indexOf("Adventure") !== -1) {
      const charField =
        message.embeds[0].fields[1].name === "Critical Hit!"
          ? message.embeds[0].fields[4]
          : message.embeds[0].fields[3];
      player.currentHP = parseInt(
        charField.value
          .split(" ")[1]
          .split("/")[0]
          .replace(",", ""),
        10
      );
      player.maxHP = parseInt(
        charField.value
          .split(" ")[1]
          .split("/")[1]
          .replace(",", ""),
        10
      );

      const petField =
        message.embeds[0].fields[1].name === "Critical Hit!"
          ? message.embeds[0].fields[3]
          : message.embeds[0].fields[2];
      pet.currentHP = parseInt(
        petField.value
          .split(" ")[1]
          .split("/")[0]
          .replace(",", ""),
        10
      );
      pet.maxHP = parseInt(
        petField.value
          .split(" ")[1]
          .split("/")[1]
          .replace(",", ""),
        10
      );

      player.name = charField.name;
    }
  }

  const matchedMessage = message.channel.messages.find(
    msg => msg.author.username === player.name
  );
  let user = null;
  if (matchedMessage !== undefined) {
    user = matchedMessage.author;
  } else return;
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
      const embed = new Discord.MessageEmbed()
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
      const embed = new Discord.MessageEmbed()
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
      const embed = new Discord.MessageEmbed()
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
