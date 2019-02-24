exports.run = async (bot, message) => {
    const { MessageEmbed } = require('discord.js');
    const embed = new MessageEmbed()
        .addField('WebSocket Heartbeat', `${Math.floor(bot.ping)} ms`, true)
        .addField(`${bot.user.username} Ping`, `Computing...`, true)
        .setColor('BLUE');
    const newMessage = await message.channel.send({embed});
    const ping = newMessage.createdTimestamp - message.createdTimestamp;
    const messages = {
        good: [
            "This latency looks pretty low!",
            "Gotta go fast!"
        ],
        average: [
            "Not the best latency ever, but it's alright.",
            "Hey it's laggy! It's still working though?"
        ],
        bad: [
            "Oops, looks like we are running slow.",
            "This number is way too high!"
        ]
    }
    var color = 'BLUE', desc = "Hi.";

    if (ping <= 500) {
        color = 'GREEN';
        desc = messages.good[Math.floor(Math.random() * messages.good.length)];
    } else if (ping > 1000) {
        color = 'RED';
        desc = messages.bad[Math.floor(Math.random() * messages.bad.length)];
    } else if (ping > 500) {
        color = 'ORANGE';
        desc = messages.average[Math.floor(Math.random() * messages.average.length)];
    }

    const embedResult = new MessageEmbed()
        .addField('WebSocket Heartbeat', `${Math.floor(bot.ws.ping)} ms`, true)
        .addField(`${bot.user.username} Ping`, `${ping} ms`, true)
        .setColor(color);
    newMessage.edit(desc, {embed: embedResult});
};

exports.infos = {
    category: "General",
    description: "Displays Current Bot Ping",
    usage: "\`&ping\`",
    example: "\`&ping\`",
}