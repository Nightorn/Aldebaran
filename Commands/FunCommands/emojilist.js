exports.run = (bot, message, args) => {
    const emojilist = message.guild.emojis.map(e=>e.toString()).join("");
    message.delete();
    message.channel.send(emojilist);
}
exports.infos = {
    category: "Fun",
    description: "Display All Emojis For The Server (Spam Alert)",
    usage: "\`&emojilist\`",
    example: "\`&emojilist\`"
}
