exports.run = (client, message, args) => {
    var request = require('request');
    var searchtitle = (args[0]);
    const apikey = require("./../config.json");
    request({uri:`http://www.omdbapi.com/?apikey=${apikey.omdb_apikey}&t=${searchtitle}`, 
    headers: {} }, function(err, response, body) {
        if (err) return;
        const moviedata = JSON.parse(body);
        message.channel.send(moviedata.Title);

    })
    
        
    };