const bases = require("../../Data/bases.json");
const userCheck = require("../../functions/action/userCheck");
const Discord = require("discord.js");
const request = require("request");

exports.run = async (bot, message, args)=>{
    function calcWall(lvl, base, prevWall) {
        const L = parseInt(lvl);                                    
        const B = parseInt(base);
        const C = prevWall ? parseInt(prevWall) : 25;
        return L * (B+C) + Math.pow(L, 2) * (B-C);
    }
    function findKeyAbove (lvl) {
        while (bases[lvl] === undefined) {
            lvl++;
        }
        return lvl;
    }
    function findKeyBelow (lvl) {
        while (bases[lvl] === undefined) {
            lvl--;
        }
        return lvl;
    }
    function userWall (lvl) {
        const base = findKeyAbove(lvl);
        const prevBase = findKeyBelow(lvl-1);
        const wall = calcWall(base, bases[base], bases[prevBase]);
        return [wall, base];
    }
    function calcXPNeeded (base, lvl) {
        return base * (Math.pow(lvl, 2) + lvl);
    }

    try {
        const userid = await userCheck(bot, message, args);
        const user = await bot.users.fetch(userid);
        request(
            {
                uri: `http://api.discorddungeons.me/v3/user/${userid}`,
                headers: { Authorization: bot.config.drpg_apikey }
            },
            (err, res, body)=>{
                if (err) throw err;
                let data = JSON.parse(body);
                if (data.status === 404) {
                    message.reply("It looks like the player you mentioned hasn't started their adventure on DiscordRPG.");
                    return;
                }
                data = data.data;
                
                const [wall, baseLvl] = userWall(data.level);
                const userAtWall = data.level === baseLvl;
                const xpNeededBase = calcXPNeeded(bases[baseLvl], data.level);
                const wallProgress = xpNeededBase - data.xp;
                
                const embed = new Discord.MessageEmbed()
                .setColor(0x00ae86)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle(`${user.username}'s DRPG Walls`)
                .setDescription("Please note that walls are **not** the XP needed to level! They are simply added onto the base XP required to level.")

                if (userAtWall) {
                    embed.addField(`Level ${baseLvl} wall`, `You're at a ${wall.toLocaleString('en-US')} XP wall.`);
                    embed.addField(`${user.username}'s progress`, `${wallProgress} / ${wall} XP (**${Math.floor((wallProgress/wall)*100)}%**)`);
                }
                else {
                    embed.addField(`${user.username}'s next wall`, `Level ${baseLvl}: ${wall.toLocaleString('en-US')} XP wall`);
                }

                message.channel.send({embed});
            }
        );
    }
    catch (err) {
        const [wall, baseLvl] = userWall(args[0]);
        const xpNeededBase = calcXPNeeded(bases[baseLvl], baseLvl);

        const embed = new Discord.MessageEmbed()
        .setColor(0x00ae86)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle(`Wall closest to Level ${args[0]}`)
        .addField(`Level ${baseLvl} wall`, `The wall at Level ${baseLvl} is ${wall.toLocaleString('en-US')} XP. You will need ${xpNeededBase.toLocaleString('en-US')} XP total to progress at that level.`);

        message.channel.send({embed});
    }
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