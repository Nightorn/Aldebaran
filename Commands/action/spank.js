const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Spankings Spankings Spankings!",
    usage: "\`&spank <usermention>\` or \`&spank <userid>\`",
    example: "\`&spank @aldebaran\` or \`&spank 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}