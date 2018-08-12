exports.run = (bot, message, args) => {
    const tackles = require(`${process.cwd()}/Data/imageurls.json`);
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
exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&tackle <usermention>\`",
    example: "\`&tackle @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}