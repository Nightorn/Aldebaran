const { MessageEmbed } = require('discord.js');
module.exports = (bot, message, args) => {
    var id = message.mentions.members.size === 1 ? message.mentions.members.first().id : args[1];
    const user = bot.users.get(id);
    if (user !== undefined) {
        const warningsDetection = [
            (settings) => { if (settings.individualHealthMonitor !== 'off' && settings.healthMonitor === 'off') return ':warning: **individualHealthMonitor** is on, but **healthMonitor** is disabled'; }
        ]
        var warnings = [], guilds = [];;
        const embed = new MessageEmbed()
            .setAuthor(`${user.tag} | ${user.id}`, user.avatarURL());
        if (Object.entries(user.settings) !== 0) {
            for (let element of warningsDetection) if (element(user.settings) !== undefined) warnings.push(element(user.settings));
            embed.addField('Settings', `\`\`\`js\n${require('util').inspect(user.settings, false, null)}\`\`\``);
            if (warnings.length > 0) embed.addField(`Warnings`, warnings.join('\n'));
        }
        for (let [id, data] of bot.guilds) if (data.members.get(user.id) !== undefined) guilds.push(`\`${id}\` **${data.name}** ${data.ownerID === user.id ? '(Owner)' : ''}`);
        if (guilds.length > 0) embed.addField('Servers', guilds.join('\n'));
        message.channel.send({embed});
    } else {
        const guild = bot.guilds.get(id);
        if (guild !== undefined) {
            var warnings = [], guilds = [];
            guild.bots = guild.members.filter(m => m.user.bot === true);
            guild.humans = guild.members.filter(m => m.user.bot === false);
            guild.botRate = guild.bots.size * 100 / guild.members.size;
            const embed = new MessageEmbed()
                .setAuthor(`${guild.name} | ${guild.id}`, guild.iconURL())
                .setDescription(`**Owner** : <@${guild.owner.id}> **\`[${guild.owner.user.tag}]\`**\n**Member Count** : ${guild.humans.size} Members (+${guild.bots.size} Bots / ${Math.floor(guild.botRate)}%)`);
            if (Object.entries(guild.settings) !== 0) {
                embed.addField('Settings', `\`\`\`js\n${require('util').inspect(guild.settings, false, null)}\`\`\``);
            }
            message.channel.send({embed});
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle('Warning')
                .setDescription(`The ID specified does not correspond to a valid user or a guild where ${bot.user.username} is.`)
                .setColor(`ORANGE`);
            message.channel.send({embed});
        }
    }
}