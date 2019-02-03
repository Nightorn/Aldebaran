const speakeasy = require('speakeasy');
const { MessageAttachment } = require('discord.js');
module.exports.run = (bot, message, args) => {
    if (message.author.tfaKey === undefined || (message.author.id !== '320933389513523220' && message.author.id !== '246302641930502145' && message.author.id !== '310296184436817930')) return;
    var verified = speakeasy.totp.verify({
        secret: message.author.tfaKey,
        encoding: 'base32',
        token: args.shift()
    });
    if (verified) {
        try {
            const code = args.join(' ');
            let evaled = eval(code);
            
            if (typeof evaled !== "string" && typeof evaled !== "number") {
                evaled = require("util").inspect(evaled, false, null);
            }
    
            message.channel.send(evaled, {code:"xl"}).catch(err => {
                message.channel.send(`The result was too long to be sent on Discord. Everything is in the attachment.`, {
                    files: [new MessageAttachment(Buffer.from(evaled), 'evaled.txt')]
                });
            });
        } catch (err) {
            message.channel.send(`An error occured.\n\`\`\`xl\n${require('util').inspect(err, false, null)}\n\`\`\``);
        }
    }
}

module.exports.infos = {
    category: "Developer",
    description: "Code Evaluation",
    usage: "\`&eval\`",
    example: "\`&eval\`"
}