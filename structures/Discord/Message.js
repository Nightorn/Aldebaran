const Discord = require('discord.js');
module.exports = (BaseMessage) => {
    return class Message extends BaseMessage {
        constructor(client, data, channel) {
            super(client, data, channel);
            this.userMentions = new Discord.GuildMemberStore(this.guild).filter(member => this.content.splice(this.guild.prefix.length).match(/(<@)([0-9]{16,19})>/g).indexOf(`<@${member.id}>`) !== -1);
        }
    }
}