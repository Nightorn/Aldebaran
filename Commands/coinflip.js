exports.run = (client, message, args) => {
    const coinflip = require("./../Data/variables.json");
    var coinoutcome = (`${coinflip.coinflip[~~(Math.random() * coinflip.coinflip.length)]}`);
    const coinflipimage = require("./../Data/imageurls.json");
    var coinflipping = (`${coinflipimage.coinflip[~~(Math.random() * coinflipimage.coinflip.length)]}`);
    message.channel.send({embed:{
        author:{
        name: message.author.username,
        icon_url: message.author.avatarURL
        },
        title: "Just A Flip Of The Coin",
        image: {
            url : (coinflipping),
      },
        description: (message.author + " You Flipped " + (coinoutcome)),
        timestamp: new Date()
    
    }})




}