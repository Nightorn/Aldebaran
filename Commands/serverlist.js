exports.run = async (client, message) => {
    if(message.author.id != (`310296184436817930`) || (`320933389513523220`));return message.channel.send(`YOU SHALL NOT PASS!!!`)
    let string = "";
    client.guilds.forEach(guild =>{
        string += `Guild Name: ${guild.name}\n`
    })
    message.reply(string)
}