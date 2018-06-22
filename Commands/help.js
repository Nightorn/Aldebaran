exports.run = (bot, message, args) => {
    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
        .setTitle("Aldebaran's Help")
        .setAuthor(`${message.author.username}`,`${message.author.avatarURL}`)
        .setDescription("You can find a brief list of my functions and how to use them below.")
        .addBlankField(false)
        .addField("⚔__**DRPG Commands**__🛡- Utility commands for Discord RPG Bot","🔹**Stats** - *Displays users detailed stats.*\n🔹**Trap** - *Displays users current trap info.* \n🔹**Plant** - *Displays users current plant info.*\n🔹**Weapon** - *Displays buyable weapons at level specified.*\n🔹**Quest** - *Displays DRPG quest list(work in progress)*.",false)
        .addBlankField(false)
        .addField("📽__**Action Commands**__🎥- Fun commands to preform on others","🔹**Adorbs** 🔹**Bite** 🔹**CPR** 🔹**Cuddle**\n🔹**Hug** 🔹**Kidnap** 🔹**Kiss** 🔹**Lick**\n🔹**Slap** 🔹**Spank** 🔹**Tackle** 🔹**Feed**\n🔹**Poke** 🔹**Tickle**",false)
        .addBlankField(false)
        .addField("🐱__**Image Commands**__🐦- Commands to display images", "🔹**Birb** - *Displays random bird image.*\n🔹**Cat** - *Displays random cat image.*\n🔹**Dog** - *Displays random dog image.*\n🔹**Lizard** - *Displays random lizard image*\n🔹**Cuteag** - *Displays a random cute SFW anime girl.*\n🔹**Duck** - *Displays random duck image*\n🔹**Randimal** - *Displays a random animal image*",false)
        .addBlankField(false)
        .addField("💡__**Miscellaneous Commands**__🔦- Commands without specific category","🔹**Avatar** - *Displays avatar.*\n🔹**Emojilist** - *Displays all emojis in current server(**Spam Warning**)*\n🔹**Invite** - *Displays invite to add this bot to your server.*\n🔹**Ping** - *Returns bots current latency.*\n",false)        
        .addBlankField(false)        
        .addField("🎟__**Fun Commands**__🎭- Commands used for fun or entertainment","🔹**Say** - *Used to send embed message as the bot*\n🔹**Fact** - *Used to display a random fact*\n🔹**Kaomoji** - *Used to send a random Kaomoji in chat*\n🔹**Owoify** - *Used to Owoify the text sent in command*\n🔹**8Ball** - *Ask 8ball a question and recieve your answer*",false)
        .addBlankField(false)        
        .addField("🚫__**NSFW Commands**__⛔- Usable in NSFW Channels","🔹**Lewd** - *Action Command lewding another person*\n🔹**XBoobs** - *Display a Animated Image or Gif*\n🔹**XKitty** - *Display a Animated Image or Gif*\n🔹**XLez** - *Display a Animated Image or Gif*\n🔹**XNeko** - *Display a Animated Image or Gif*\n🔹**XRandom** - *Display a Random Animated Image or Gif*\n",false)
        .addBlankField(false)
        .addField("__**Have a command request or suggestion?**__", "*DM Nightmare#1234* - Always looking for new and fun commands!",false)
        .setFooter("In Development By Nightmare#1234")
        .setTimestamp ()
            message.channel.send({embed});
}
