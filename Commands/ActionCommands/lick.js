exports.run = (bot, message, args) => {
    const licks = require("./../../Data/imageurls.json");
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