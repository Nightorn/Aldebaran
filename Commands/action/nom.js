const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "It's nom nom time!! Invite your friends!",
    usage: "\`&nom <usermention>\` or \`&nom <userid>\`",
    example: "\`&nom @aldebaran\` or \`&nom 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}