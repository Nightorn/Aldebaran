exports.run = (bot, message, args) => {
    var request = require('request');
    var searchimage = (args[0]);
    const apikey = require("./../config.json");
    request({uri:`https://api.giphy.com/v1/gifs/random?api_key=${apikey.giphy_apikey}&tag=${searchimage}&rating=G`, 
    headers: {} }, function(err, response, body) {
        if (err) return;
        const gifdata = JSON.parse(body);
        
        message.channel.send({embed:{
            author:{
            name: message.author.username,
            icon_url: message.author.avatarURL
            },
            title: (`Your Search For ` + (searchimage) + ` Returned This.`),
            image: {
                url : (gifdata.data.images.original.url),
          },
            footer: {
            text: ("Powered By Giphy")
            },
            timestamp: new Date()
            
        }})
            
    });
    
        
    };