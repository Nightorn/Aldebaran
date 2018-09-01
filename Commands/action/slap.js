const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Slap that deserving someone!!",
    usage: "\`&slap <usermention>\` or \`&slap <userid>\`",
    example: "\`&slap @aldebaran\` or \`&slap 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}