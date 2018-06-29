exports.run = (bot, message, args) => {
    const cprs = require("./../../Data/imageurls.json");
    var sendcprs = (`${cprs.cprs[~~(Math.random() * cprs.cprs.length)]}`);
    if(message.mentions.users.first()) { //Check if the message has a mention in it.
        let target = message.mentions.users.first();
        message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        description: (`OMG ${target} is dying, Good thing ${message.author} knows CPR!`),
        image: {
            url : (sendcprs),
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
    usage: "\`&cpr <usermention>\`",
    example: "\`&cpr @aldebaran\`"
}