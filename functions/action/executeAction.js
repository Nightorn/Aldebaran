module.exports = function (bot, message, args,command) {
    const userCheck = require(`${process.cwd()}/functions/action/userCheck`)
    const getImage = require(`${process.cwd()}/functions/action/getImage`)
    const text  = require (`${process.cwd()}/Data/actiontext.json`)
    const userId = userCheck(bot,message,args).then((userId) => {
        command = message.content.slice(bot.prefixes.get(message.guild.id).length).split(' ')[0]
        var target = `<@${userId}>`
        var sender = message.author.username
        var comment = ""

        if (message.author.id === userId) {
            randNumber = Math.floor(Math.random() * text[`${command}`].self.length)
            comment = text[`${command}`].self[randNumber].replace('{target}',target)  
        } else {
            randNumber = Math.floor(Math.random() * text[`${command}`].user.length)
            comment = text[`${command}`].user[parseInt(randNumber)].replace('{target}',target).replace('{sender}',sender)   
        }  

        getImage(bot,message,args).then((image) =>{ 
            message.channel.send({embed:{
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                description: (comment),
                image: {
                url : (image),
                },
                timestamp: new Date()
            }});
        })
            
    }).catch(err => {
        throw err
    });
}