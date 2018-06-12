exports.run = (bot, message, args) => {      
        if(message.mentions.users.first()) { //Check if the message has a mention in it.
            let user = message.mentions.users.first(); //Since message.mentions.users returns a collection; we must use the first() method to get the first in the collection.
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
            }}
      ); //We send the output in the current channel.
      } else {
            message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
      }
        
};