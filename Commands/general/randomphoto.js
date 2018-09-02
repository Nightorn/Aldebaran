exports.run = function(bot, message, args) {
    bot.database.photogallery.selectRandom(false).then(photo => {
        message.channel.send(photo[0].links)
    });
}
exports.infos = {
    category: "General",
    description: "Returns Random Image From Gallery",
    usage: "\`&randomphoto\`",
    example: "\`&randomphoto\`",
}