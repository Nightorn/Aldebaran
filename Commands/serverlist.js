exports.run = async (client, message) => {
    if(message.author.id != `310296184436817930`)return message.channel.send(`YOU SHALL NOT PASS!!!`)
    let string = "";
    client.guilds.forEach(guild =>{
        string += `Guild Name: ${guild.name}\n`
    })
    message.reply(string)
}
exports.infos = {
    category: "General",
    description: "Server List Of Aldebaran",
    usage: "\`&serverlist\`",
    example: "\`&serverlist\`",
    restrictions: "Developer Only"
}
