exports.run = (bot, message, args) => {
    const slaps = require("./../../Data/imageurls.json");
    var sendslaps = (`${slaps.slaps[~~(Math.random() * slaps.slaps.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` slapped `+ target + ` that's going to leave a mark.`),
        image: {
            url : (sendslaps),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
};
};