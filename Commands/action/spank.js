exports.run = (bot, message, args) => {
    const spanks = require("./../../Data/imageurls.json");
    var sendspanks = (`${spanks.spanks[~~(Math.random() * spanks.spanks.length)]}`);
    if (message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed: {
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            description: (message.author +` is spanking `+ target + ` they must have been bad 😉 .`),
            image: {
                url : (sendspanks),
            },
            timestamp: new Date()
        }});
    } else {
        message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
    };
};
exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&spank <usermention>\`",
    example: "\`&spank @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}