exports.run = (bot, message, args) => {
    const client = require('nekos.life');
    const Discord = require(`discord.js`)
    const neko = new client();
    message.delete().catch(O_o=>{});
        async function owo() {
            const data = (await neko.getSFWOwOify({text: `${args.join(" ")}`}));
            message.channel.send(`${data.owo}`)
        }
        
        owo();
}
exports.infos = {
    category: "Fun",
    description: "OwOify Text Sent (150 Char. Limit)",
    usage: "\`&owoify <text>\`",
    example: "\`&owoify why is the grass green\`"
}
