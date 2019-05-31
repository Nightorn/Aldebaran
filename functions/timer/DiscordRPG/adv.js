module.exports = message => {
  if (message.author.timers.adventure !== null) return;
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
    if (message.guild.settings.autoDelete === "on")
      message.delete({ timeout: 1000 });
    if (
      message.guild.settings.adventureTimer === "on" &&
      message.author.settings.adventureTimer === "on"
    ) {
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
      }, 13500);
    }
  }
};
