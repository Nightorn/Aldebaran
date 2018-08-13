exports.run = (bot, message, args) => {
    const adorables = require(`${process.cwd()}/Data/imageurls.json`);
    var sendadorables = (`${adorables.adorables[~~(Math.random() * adorables.adorables.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` thinks `+ target + ` is totally adorable.`),
        image: {
            url : (sendadorables),
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
    usage: "\`&adorbs <usermention>\`",
    example: "\`&adorbs @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}