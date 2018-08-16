exports.run = (bot, message, args) => {
    const bites = require(`${process.cwd()}/Data/imageurls.json`);
    var sendbites = (`${bites.bites[~~(Math.random() * bites.bites.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
            name: message.author.username,
            icon_url: message.author.avatarURL
        },
        description: (message.author +` Bit `+ target),
        image: {
            url : (sendbites),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
};
};
exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&bite <usermention>\`",
    example: "\`&bite @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}