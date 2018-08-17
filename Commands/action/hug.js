exports.run = (bot, message, args,command) => {
    const userCheck = require(`${process.cwd()}/functions/action/userCheck`)
    const getImage = require(`${process.cwd()}/functions/action/getImage`)
    
    const userId = userCheck(bot,message,args).then((userId) => {
        var target = `<@${userId}>`
        getImage(bot,message,args).then((image) =>{
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (`*${message.author.username}* is hugging ${target} ever so tightly.`),
                image: {
                url : (image),
                },
                timestamp: new Date()
            }});
        })
            
    }).catch(() => {
        message.channel.send(`You must enter a valid userid or mention!`)
    });
}


exports.infos = {
    category: "Action",
    description: "Performs Action On Mentioned User & Displays Gif To Accompany",
    usage: "\`&hug <usermention>\`",
    example: "\`&hug @aldebaran\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}
