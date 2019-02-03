exports.run = (bot, message, args) => {
    const images = require(`${process.cwd()}/Data/imageurls.json`);
    const randomGif = images.mindblown[~~(Math.random() * images.mindblown.length)];
    
    message.channel.send({embed:{
        author: {
            name: message.author.username,
            icon_url: message.author.avatarURL()
        },
        description: `${message.author}'s mind has been blown`,
        image: {
            url: randomGif
        },
        timestamp: new Date()
    }});
}
exports.infos = {
    category: "Image",
    description: "Shows a GIF showing everyone how much your mind was blown",
    usage: "\`&mindblown",
    example: "\`&mindblown\`"
}