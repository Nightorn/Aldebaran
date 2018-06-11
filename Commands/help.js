exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Aldebaran's Help")
        .setAuthor(`${message.author.username}`)
        .setDescription("You can find a brief list of my functions and how to use them below.")
        .addBlankField(false)
        .addField("⚔__**DRPG Commands**__🛡- Utility commands for Discord RPG Bot","🔹**Stats** - *Displays users detailed stats.*\n🔹**Trap** - *Displays users current trap info.* \n🔹**Plant** - *Displays users current plant info.*\n🔹**Weapon** - *Displays buyable weapons at level specified.*\n🔹**Quest** - *Displays DRPG quest list(work in progress)*.",false)
        .addBlankField(false)
        .addField("📽__**Action Commands**__🎥- Fun commands to preform on others","🔹**Adorbs**, **Bite**, **CPR**, **Cuddle**,\n🔹**Hug**, **Kidnap**, **Kiss**, **Lick**,\n🔹**Slap**, **Spank**, **Tackle**",false)
        .addBlankField(false)
        .addField("🐱__**Image Commands**__🐦- Commands to display images", "🔹**Birb** - *Displays random bird image.*\n🔹**Cat** - *Displays random cat image.\n🔹**Dog** - *Displays random dog image*",false)
        .addBlankField(false)
        .addField("💡__**Miscellaneous Commands**__🔦- Commands without specific category","🔹**Avatar** - *Displays avatar.*\n🔹**Cuteag** - *Displays a random cute SFW anime girl.*\n🔹**Emojilist** - *Displays all emojis in current server(**Spam Warning**)*\n🔹**Invite** - *Displays invite to add this bot to your server.*\n🔹**Ping** - *Returns bots current latency.*\n🔹**Say** - *Used to send embed message as the bot*",false)        
        .addBlankField(false)        
        .addField("🚫__**NSFW Commands**__⛔- Usable in NSFW Channels","🔹**Lewd** - *Action Command lewding another person*\n",false)
        .addBlankField(false)
        .addField("__**Have a command request or suggestion?**__", "*DM Nightmare#1234* - Always looking for new and fun commands!",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
            message.channel.send({embed});
}
