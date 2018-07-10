exports.run = (bot, message, args) => {
    var request = require('request');
    request({uri:`http://api.cutegirls.moe/json`, headers: {} }, function(err, response, body) {
        if (err) return;
        const data = JSON.parse(body);
        message.channel.send({embed:{
            author:{
            name: message.author.username,
            icon_url: message.author.avatarURL
            },
            title: (data.data.title),
            image: {
                url : (data.data.image),
          },
            footer: {
            text: ("Source: " + data.data.link)
            },
            timestamp: new Date()
            
        }})

    })
    
        
    };
    exports.infos = {
        category: "Image",
        description: "Displays a random cute anime girl picture. ",
        usage: "\`&cuteag\`",
        example: "\`&cuteag\`",
    }