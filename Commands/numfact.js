exports.run = (client, message, args) => {
    var request = require('request');
    var searchnumber = (args[0]);
    var searchtype = (args[1].toLowerCase());
    const apikey = require("./../config.json");
    //Need to add If for args check. Allowed args for searchtype being Math Trivia Date Year
    if(!args || args.length < 2) return message.reply("Must provide a number & fact type. `i.e: Math, Year, Trivia`");
    request({uri:`http://numbersapi.com/${searchnumber}/${searchtype}?json`, 
    headers: {} }, function(err, response, body) {
        if (err) return;
        const numberdata = JSON.parse(body);
        message.channel.send({embed:{
            author:{
            name: message.author.username,
            icon_url: message.author.avatarURL
            },
            title: (`Heres a Fact About ` + (numberdata.number) ),
            description:(numberdata.text),
            footer: {
            text: ("Who Knew?")
            },
            timestamp: new Date()
            
        }})

    })
    
        
    };