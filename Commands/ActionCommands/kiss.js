exports.run = (bot, message, args) => {
    const kisses = require("./../../Data/imageurls.json");
    var sendkisses = (`${kisses.kisses[~~(Math.random() * kisses.kisses.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` kissed `+ target + `, awwww get a Room!`),
        image: {
            url : (sendkisses),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
};
};