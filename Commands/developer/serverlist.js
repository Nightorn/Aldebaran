exports.run = async (client, message) => {
    let string = "";
    client.guilds.forEach(guild =>{
        string += `Guild Name: ${guild.name}\n`
    })
    message.reply(string)
}
exports.infos = {
    category: "Developer",
    description: "Server List Of Aldebaran",
    usage: "\`&serverlist\`",
    example: "\`&serverlist\`",
    restrictions: "Developer Only"
}