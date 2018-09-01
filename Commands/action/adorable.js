const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Used to show how adorable you think someone is!",
    usage: "\`&adorable <usermention>\` or \`&adorable <userid>\`",
    example: "\`&adorable @aldebaran\` or \`&adorable 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}