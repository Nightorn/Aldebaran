const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Use to softly rub someone",
    usage: "\`&rub <usermention>\` or \`&rub <userid>\`",
    example: "\`&rub @aldebaran\` or \`&rub 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}