exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    if (args.length = 2){
        var seconds = args[1] * 3600    
        var formulamin = Math.floor(1+((Math.floor(args[0]))*(seconds/25)/15000));
        var formulamax = Math.floor(1+((Math.floor(args[0]))*(seconds/25)/14000));
        var hours = args[1]
        message.channel.send(`Estimated ${formulamin} - ${formulamax} when planted for ${hours} hours. `)
    }else return message.channel.send("You must provide both reaping and hours set. Example (&plantcalc 1 24)")
}
