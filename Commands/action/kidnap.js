const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Use to kidnap your favorite person!",
    usage: "\`&kidnap <usermention>\` or \`&kidnap <userid>\`",
    example: "\`&kidnap @aldebaran\` or \`&kidnap 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}