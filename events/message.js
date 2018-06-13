exports.run = async (client, message) => {
  if (message.author.id == `271394014358405121`) require('./../functions/bots/Pollux.js')(client, message);
  else if (message.author.id == `170915625722576896`) require('./../functions/bots/DiscordRPG.js')(client, message);
}   