exports.run = (bot, message, args) => {
    const hugs = require("./../../Data/imageurls.json");
    var sendhugs = (`${hugs.hugs[~~(Math.random() * hugs.hugs.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` hugged `+ target + ` how sweet!`),
        image: {
            url : (sendhugs),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
};
};