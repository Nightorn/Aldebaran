const Discord = require("discord.js");
const config = require('./../functions/commands/config');
exports.run = function(bot, message, args) {
    if (['310296184436817930', '320933389513523220', message.guild.ownerID].indexOf(message.author.id) == -1) return message.reply(`How about you not do that!`);
    const parametersAvailable = {
        adventureTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "DiscordRPG Adventure Timer - [on | off]"},
        sidesTimer: {support: (value) => { return ['on', 'off'].indexOf(value) != -1 }, help: "DiscordRPG Sides Timer - [on | off]"},
        aldebaranPrefix: {support: () => { return typeof args[1] === 'string' }, help: "Aldebaran's Prefix - [& | Guild Customized]", postUpdate: (value) => { bot.prefixes.set(message.guild.id, value); }}
    }
    if (args.length == 0 || args.indexOf('help') != -1) {
        var description = '';
        for (let [key, data] of Object.entries(parametersAvailable)) description += `**${key}** - ${data.help}\n`;
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle('Config Command Help Page')
            .setDescription(`Here are the different parameters you can change to set the experience and the limitations of the members of your server.\n**Usage Example:** \`&gconfig adventureTimer off\`.\n__Note:__ This command can only be used by the owner of the server.\n${description}`)
            .setColor('BLUE');
        message.channel.send({embed});
    } else {
        config(parametersAvailable, 'guild', message);
    }
}
exports.infos = {
    category: "Settings",
    description: "Used to enabled or disable features of aldebaran.",
    usage: "\`&gconfig <parameter> <setting>\`",
    example: "\`&gconfig adventureTimer on\`",
    restrictions: "Server Owner"
}