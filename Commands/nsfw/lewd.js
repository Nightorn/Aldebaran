exports.run = (bot, message, args) => {
    const lewds = require(`process.cwd()/Data/imageurls.json`);
    var sendlewds = (`${lewds.lewds[~~(Math.random() * lewds.lewds.length)]}`);
    if (message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
            author:{
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            description: (message.author +` is being lewd towards `+ target),
            image: {
                url : (sendlewds),
            },
            timestamp: new Date()
    
        }});
    } else {
        message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
    };

};
exports.infos = {
    category: "NSFW",
    description: "Performs A Lewd Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&lewd <usermention>\`",
    example: "\`&lewd @aldebaran\`",
    restrictions: "NSFW Channels Only"
}