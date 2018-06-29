exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    message.delete().catch(O_o=>{});
        async function asc() {
            const data = (await neko.getSFWCatText());
            message.channel.send(`${data.cat}`)
        }
        
        asc();
}
exports.infos = {
    category: "Fun",
    description: "Displays a random Kaomoji",
    usage: "\`&kaomoji\`",
    example: "\`&kaomoji\`"
}
