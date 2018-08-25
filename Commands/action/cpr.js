const Discord = require(`discord.js`)
exports.run = async (bot, message,args) => {
    require(`../../functions/action/executeAction.js`)(bot,message,args);
};
exports.infos = {
    category: "Action",
    description: "Use to preform CPR on Somone",
    usage: "\`&cpr <usermention>\` or \`&cpr <userid>\`",
    example: "\`&cpr @aldebaran\` or \`&cpr 320933389513523220\`",
    cooldown: {
        time: 1000,
        rpm: 60,
        resetTime: 60000,
        commandGroup: "action"
    }
}