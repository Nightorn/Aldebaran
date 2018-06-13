exports.run = async (client, message) => {
  if (message.author.id == `271394014358405121`) require('./message/Pollux')(client, message);
  else if (message.author.id == `170915625722576896`) require('./message/DiscordRPG')(client, message);
}   