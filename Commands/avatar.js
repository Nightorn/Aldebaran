exports.run = (bot, message, args) => {
      var user ;
      if(args === '') user = message.author       
      if(message.mentions.users.first()) { //Check if the message has a mention in it.
            user = message.mentions.users.first();
      } else user = (bot.users.get(`${args[0]}`) != undefined) ? bot.users.get(`${args[0]}`) : message.author ;  
      let output = user.avatarURL; /*The Avatar URL*/
      message.channel.send({embed:{
            author:{
                  name: user.username,
                  icon_url: user.avatarURL
            },
            title: (user.username + `'s Avatar`),
            image: {
                  url : (output),
            },
            timestamp: new Date()
      }}); //We send the output in the current channel.
}

exports.infos = {
      category: "General",
      description: "Displays Mentioned Users Avatar Image.",
      usage: "\`&avatar <usermention>\`",
      example: "\`&avatar @aldebaran\`"
  }
        
