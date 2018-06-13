module.exports = function(bot, message, args) {
    console.log(message.content)
    if (message.content.endsWith(`a chance to claim it!`) && message.author.id == "271394014358405121") {
      message.channel.send(`Come Grab My Box <@310296184436817930> <@384996823556685824> <@266632489546678273> <@207575115616092161> <@226358525410934794> <@267906052366794753> <@348317596606529536> <@196203663054733313>\n<@&440727495906689024>`)
    }
}