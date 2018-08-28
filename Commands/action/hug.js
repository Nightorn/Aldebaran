const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Send warm hugs to a user of your choice.",
    usage: "\`&hug <usermention>\` or \`&hug <userid>\`",
    example: "\`&hug @aldebaran\` or \`&hug 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}