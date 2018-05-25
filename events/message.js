exports.run = (client, message) => {
  //Pollux Lootbox Watcher
  if (message.author.id == `271394014358405121` ){
    console.log(message.content)
    if(message.content.endsWith(`a chance to claim it!`)) {
      message.channel.send(`Come Grab My Box <@310296184436817930> <@384996823556685824> <@266632489546678273> <@207575115616092161>`)
    }
  }
}    