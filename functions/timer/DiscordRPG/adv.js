module.exports = message => {
  if (
    message.author.timers.adventure !== null ||
    message.guild.settings.adventureTimer === "off" ||
    message.guild.settings.adventureTimer === undefined ||
    message.author.settings.adventureTimer === "off" ||
    message.author.settings.adventureTimer === undefined
  )
    return;
  const content = `${message.content.toLowerCase()} `;
  let prefix = null;
  for (let element of [
    "DiscordRPG",
    "#!",
    "<@170915625722576896>",
    message.guild.settings.discordrpgPrefix
  ]) {
    if (message.content.indexOf(element) === 0) {
      element = element.toLowerCase();
      if (
        content.indexOf(`${element}adv `) === 0 ||
        content.indexOf(`${element}adventure `) === 0
      )
        prefix = element;
    }
  }
  if (prefix !== null) {
    if (message.guild.settings.autoDelete === "on") {
      message.channel.addAdventure(message.author);
      message.delete({ timeout: 2000 });
    }
    const delay =
      message.author.settings.adventureTimer === "random"
        ? Math.random() * 3000
        : 0;
    // eslint-disable-next-line no-param-reassign
    message.author.timers.adventure = setTimeout(() => {
      message.channel
        .send(`<@${message.author.id}> adventure time! :crossed_swords:`)
        .then(msg => {
          if (message.guild.settings.autoDelete === "on")
            msg.delete({ timeout: 10000 });
        });
      // eslint-disable-next-line no-param-reassign
      message.author.timers.adventure = null;
    }, 13500 + delay);
  }
};
