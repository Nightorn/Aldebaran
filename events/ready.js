const { MessageEmbed } = require("discord.js");

exports.run = client => {
  const embed = new MessageEmbed()
    .setTitle(`Started ${client.user.username}`)
    .setDescription(`**Uptime** : ${Math.floor(client.uptime)}ms`)
    .setColor(`BLUE`);
  client.guilds.get("461792163525689345").channels.get("485023018045669396").send({ embed });

  client.guilds.get("461792163525689345").channels.get("461802546642681872").messages.fetch(200);
  client.guilds.get("461792163525689345").channels.get("463094132248805376").messages.fetch(200);
  client.guilds.get("461792163525689345").channels.get("494129501077241857").messages.fetch(200);

  if (client.debugMode) {
    console.log(
      `Bot has started in dev mode with prefix ${client.config.prefix}, with ${
        client.users.size
      } users, in ${client.channels.size} channels of ${
        client.guilds.size
      } guilds.`
    );
  } else {
    console.log(
      `Bot has started, with ${client.users.size} users, in ${
        client.channels.size
      } channels of ${client.guilds.size} guilds.`
    );
  }

  const parseText = value => {
    let text = value;
    text = text.replace("{NSERVERS}", Number.formatNumber(client.guilds.size));
    text = text.replace("{NUSERS}", Number.formatNumber(client.users.size));
    text = text.replace("{VERSION}", client.version);
    return text;
  };

  client.user.setActivity("for a few seconds now");
  const { presence } = client.config;
  setInterval(() => {
    client.CDBA.sortEntries();
    if (client.CDBA.selected !== null) {
      presence.pop();
      presence.push(client.CDBA.selected);
      client.CDBA.clear();
    }
  }, 3600000);
  setInterval(() => {
    presence.push({
      text: "&presence entries",
      type: "WATCHING"
    });
    const selected = presence[Math.floor(Math.random() * presence.length)];
    client.user.setActivity(parseText(selected.text), { type: selected.type });
  }, 30000);
};
