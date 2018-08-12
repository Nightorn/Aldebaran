exports.run = ()=>{
    return;
}
exports.infos = {
    category: "DRPG",
    description: "Displays users walls information.",
    usage: "\`&walls\` or \`&walls <usermention>\` or \`&walls <userid>\`",
    example: "\`&walls\` or \`&walls @aldebaran\` or \`&walls 246302641930502145\`",
    cooldown: {
        time: 5000,
        rpm: 25,
        resetTime: 60000,
        commandGroup: "drpg"
    }
}