exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    const request = require("request");
    const xpdata = require(`/Data/drpgbasexp.json`);
    const apikey = require(`${process.cwd()}/config.json`);
    var usrid = message.author.id;
    if(args.length > 0){
        usrid = message.mentions.members.size > 0 ? message.mentions.members.first().id : args[0];
    };   
        request({uri:`http://api.discorddungeons.me/v3/user/${usrid}`, headers: {"Authorization":apikey.drpg_apikey} }, function(err, response, body) {
            if (err) return;

            const data = JSON.parse(body);
            var level = data.level
            var base
            var xpBoostpercent = (data.attributes !== undefined) ? Math.floor(data.attributes.xpBoost / 10) : 0 ;
            for (let [key, value] of Object.entries(xpdata)){
                for (var i = 0; i < xpdata.length; i++){
                    if (key[i] == level){
                        base = value[i]
                    }else if (key[i] > level){
                        base = value[i - 1]
                    }
                };
            }; 
        
            var currentXp = data.xp
            var xpTolevel 
            var neededXp = Math.floor(neededXp - currentXp);    
            var xpformula1 = Math.floor((1249297 * (level * level)) /61200000);
            var xpformula2 = Math.floor((1778779 * level) / 306000);
            var xpformula3 = Math.floor(11291 / 51);
            var finalnoring = Math.floor((xpformula1 + xpformula2 + xpformula3) / 1.5);
            var finalxpring = Math.floor(((xpformula1 + xpformula2 + xpformula3) / 1.5) * 1.25);
            var finaldonorring = Math.floor((xpformula1 + xpformula2 + xpformula3));
        })
       
    
   
    
        
    
    
    
    
    
    
    
    
    
    
    
    /*
        var xpformula1 = Math.floor((1249297 * (level * level)) /61200000);
        var xpformula2 = Math.floor((1778779 * level) / 306000);
        var xpformula3 = Math.floor(11291 / 51);
        var finalnoring = Math.floor((xpformula1 + xpformula2 + xpformula3) / 1.5);
        var finalxpring = Math.floor(((xpformula1 + xpformula2 + xpformula3) / 1.5) * 1.25);
        var finaldonorring = Math.floor((xpformula1 + xpformula2 + xpformula3));
        
    */    
        
        
    
}
