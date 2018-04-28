exports.run = (client, message, args) => {
    const tackles = require("./../Data/imageurls.json");
    var sendtackles = (`${tackles.tackles[~~(Math.random() * tackles.tackles.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (message.author +` just tackled `+ target + `, looks like it hurt!`),
        image: {
            url : (sendtackles),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
};
};