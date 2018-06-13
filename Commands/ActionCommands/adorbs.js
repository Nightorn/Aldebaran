exports.run = (bot, message, args) => {
    const adorables = require("./../../Data/imageurls.json");
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