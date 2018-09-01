const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Tackle that user you been dying to tackle!",
    usage: "\`&tackle <usermention>\` or \`&tackle <userid>\`",
    example: "\`&tackle @aldebaran\` or \`&tackle 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}