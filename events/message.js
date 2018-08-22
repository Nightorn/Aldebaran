exports.run = async (client, message) => {
  if (message.author.id == `271394014358405121`) require('./../functions/bots/Pollux.js')(client, message);
  else if (message.author.id == `170915625722576896`) { require('./../functions/bots/DiscordRPG.js')(client, message);require(`.//../functions/timer/DRPGTravel.js`)(client, message); }
  else if (message.content === 'kek kek') message.delete();
  else if (!message.author.bot) { require(`./../functions/timer/DRPGAdv.js`)(client,message); require(`.//../functions/timer/DRPGSides.js`)(client, message);require(`.//../functions/timer/padv.js`)(client, message);  }
}

//