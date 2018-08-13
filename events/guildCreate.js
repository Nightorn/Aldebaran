const Discord = require(`discord.js`)
exports.run = async (client, guild) => {
  console.log(`Joined server ${guild.name} with ${guild.memberCount} members`);
  if (guild.available) {
    //look for a channel Aldebaran can post in
    const chans = guild.channels;
    const iterator = chans.entries();
    let introChannel;
    for (let i = 0; i < chans.size; i++) {
      const channel = iterator.next().value[1];
      if (channel.type === "text") {
        if (channel.permissionsFor(client.user.id).has(2048)) {
          introChannel = channel;
          break;
        }
      }
    }
    if (introChannel === undefined) {
      console.log("Cannot find an channel where I can talk in "+guild.name+". Huh?");
    }
    else {
      guild.owner.createDM().then((dm)=>{
        dm.send({embed: {
            title: "Aldebaran guild setup",
            description: `Hey! I've been added to ${guild.name}, and you **should configure** the settings for your guild!`,
            fields: [
              {name: "You may enable these features for your guild members:", value: `
                **Adventure Timer**: DiscordRPG adventure timers - \`&gconfig adventureTimer on\`\n
                **Sides Timer**: DiscordRPG sides timers - \`&gconfig sidesTimer on\`\n
                **Timer messages auto deletion**: Is Aldebaran spamming up your channels? This will make Aldebaran automatically delete it's timer messages. - \`&gconfig autoDelete on\`
              `}
            ],
            footer: {
              text: "These features will not work until you enable them!"
            }
          }
        });
      }).catch(()=>{
        console.log("Can't send DM to owner of "+guild.name);
      });
      introChannel.send({embed:{
        url: "http://nightorn.com/aldebaran",
        title: "Hey! I\'m Aldebaran!",
        description: "*Here's some helpful tips for you!*",
        fields: [
          {name: "DiscordRPG enhancement", value: `
          **Your guild owner** has to enable these before they can be used.
            They have been DMed with the instructions!\n
          To enable your Adventure and sides Timer, do \`&uconfig adventureTimer on\`, and \`&uconfig sidesTimer on\`.\n
          To let Aldebaran inform you when your health is low, do \`&uconfig healthMonitor on\`.
            `}
        ],
        footer: {
          text: "Thank you for adding Aldebaran to your server!"
        }
        }
      });
    }
  }

  const embed = new Discord.RichEmbed()
  .setAuthor(client.user.username, client.user.avatarURL)
  .setTitle(`Has Joined A New Guild!`)
  .setColor('GREEN')
  .addField(`__**Server Name**__`,guild.name,true)
  .addField(`__**Owned By**__`,`**Name:** ${guild.owner}\n**ID**: ${guild.ownerID}`,true)
  .addField(`__**Member Count**__`,guild.memberCount,false)
  .addField(`__**Server ID**__`,guild.id,true)
  .addField(`__**Large Guild?**__`,guild.large,true)
  .setFooter(`Added On ${guild.joinedAt}`)
  .setThumbnail(guild.iconURL)
  client.channels.get(`463201092398874634`).send(embed);
}   