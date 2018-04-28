exports.run = (client, message, args) => {
    const searchguild = args[0]
    const emojilist = client.guilds.get(searchguild).emojis.map(e=>e.toString()).join("");
    message.channel.send(emojilist);
}
