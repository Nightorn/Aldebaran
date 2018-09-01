const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Licky Licky that someone special.",
    usage: "\`&lick <usermention>\` or \`&lick <userid>\`",
    example: "\`&lick @aldebaran\` or \`&lick 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}