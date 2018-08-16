exports.run = (bot, message, args) => {
    const licks = require(`${process.cwd()}/Data/imageurls.json`);
    var sendlicks = (`${licks.licks[~~(Math.random() * licks.licks.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` licked `+ target + ` maybe we should look away.`),
        image: {
            url : (sendlicks),
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
    usage: "\`&lick <usermention>\`",
    example: "\`&lick @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}