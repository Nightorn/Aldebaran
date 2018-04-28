exports.run = (client, message, args) => {
    const kidnaps = require("./../Data/imageurls.json");
    var sendkidnaps = (`${kidnaps.kidnaps[~~(Math.random() * kidnaps.kidnaps.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` just kidnapped `+ target),
        image: {
            url : (sendkidnaps),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
};
};