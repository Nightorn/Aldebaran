const Discord = require('discord.js');
module.exports = (BaseMessage) => {
    return class Message extends BaseMessage {
        constructor(client, data, channel) {
            super(client, data, channel);
            this.userMentions = new Discord.Collection(this.guild.members.entries()).filter(member => {
                const results = this.content.match(/(<@)([0-9]{16,19})>/g);
                if (results !== null) return results.indexOf(`<@${member.id}>`) !== -1;
            });
            console.log(this.userMentions);
        }
    }
}