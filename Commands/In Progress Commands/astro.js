exports.run = (client, message, args) => {
    var request = require('request');
    request({uri:`http://api.cutegirls.moe/json`, headers: {} }, function(err, response, body) {
        if (err) return;
        const data = JSON.parse(body);
    })
}