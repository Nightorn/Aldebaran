exports.run = (bot, message, args) => {
    const escapes = require(`${process.cwd()}/Data/imageurls.json`);
    var sendescapes = (`${escapes.escapes[~~(Math.random() * escapes.escapes.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (`${message.author} has escaped from ${target}`),
        image: {
            url : (sendescapes),
      },
        timestamp: new Date()
    
    }});
}   else {
    message.reply("You can't escape your self silly!"); //Reply with a mention saying "Invalid user."
};
};
exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&escape <usermention>\`",
    example: "\`&escape @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}