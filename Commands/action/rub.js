exports.run = (bot, message, args) => {
    const rubs = require("./../../Data/imageurls.json");
    var sendrubs = (`${rubs.rubs[~~(Math.random() * rubs.rubs.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (`Awww ${message.author} is rubbing ${target} thats nice.`),
        image: {
            url : (sendrubs),
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
    usage: "\`&rub <usermention>\`",
    example: "\`&rub @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}