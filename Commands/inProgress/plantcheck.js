exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    if(!args || args.length < 2) return message.reply(`Must Provide Reaping Stats & Time Set (Hours)`);
    var reappoints = args[0];
    var timesetsec = Math.floor(args[1]*3600);
    var plantcheckamountmin = Math.floor(1+(Math.floor(reappoints)*(timesetsec/25)/15000));
    var plantcheckamountmax = Math.floor(1+(Math.floor(reappoints)*(timesetsec/25)/14000));
    message.channel.send(`If you check your plant set ${args[1]} hours ago\nWith ${Math.abs(args[0]-1)} points assigned to reaping.\nYou will receive between **${plantcheckamountmin}-${plantcheckamountmax}** items.`)
}