const locationsList = require('./../../Data/drpglocationlist.json');
const { MessageEmbed } = require(`discord.js`);
const request = require(`request`);
exports.run = async (bot, message, args) => {
    var userid = null;
    var trapId = null;
    var isMax = false;
    if (args.indexOf('--max') !== -1) {
        args.pop();
        isMax = true;
    }
    if (args.length === 1) {
        try {
            userid = await require(`${process.cwd()}/functions/action/userCheck`)(bot, message, args);
        } catch(err) {
            userid = message.author.id;
            trapId = args[0];
        }
    } else if (args.length >= 2) {
        try {
            userid = await require(`${process.cwd()}/functions/action/userCheck`)(bot, message, args);
        } catch(err) {}
        trapId = args[1];
    } else {
        userid = message.author.id;
    }

    if (userid !== null) {
        request({uri:`http://api.discorddungeons.me/v3/user/${userid}`, headers: {"Authorization": bot.config.drpg_apikey}}, async function(err, response, body) {
            if (err) return;
    
            const items = {
                "78": "Raven Feathers",
                "79": "Balls of Wool",
                "80": "Golden Feathers",
                "81": "Meats",
                "462": "Bear",
                "499": "Nova Crystal",
                "656": "Immortal King's Sacrament",
                "657": "Felix's Fur",
                "693": "Star Fragment",
                "694": "Nova Moonstone"
            }

            const commonTrapLoot = (salvage, max, minTime) => {
                let factor = max ? 14000 : 15000;
                return trapelapsedraw >= minTime ? Math.floor(1 + (Math.floor(Math.sqrt(salvage) * (trapelapsedraw / 25) / factor))) : 0
            };
            const traps = {
                "73": {
                    name: "Bear Trap",
                    loots: {
                        "78": (salvage, max) => commonTrapLoot(salvage, max, 1200),
                        "79": (salvage, max) => commonTrapLoot(salvage, max, 300),
                        "80": (salvage, max) => commonTrapLoot(salvage, max, 86400),
                        "81": (salvage, max) => commonTrapLoot(salvage, max, 3600),
                        "462": () => trapelapsedraw >= 604800 ? 1 : 0
                    }
                },
                "655": {
                    name: "Felix's Trap",
                    loots: {
                        "78": (salvage, max) => commonTrapLoot(salvage, max, 1200),
                        "79": (salvage, max) => commonTrapLoot(salvage, max, 1200),
                        "81": (salvage, max) => commonTrapLoot(salvage, max, 3600),
                        "656": (salvage, max) => commonTrapLoot(salvage, max, 21600),
                        "657": () => trapelapsedraw >= 604800 ? 1 : 0
                    }
                },
                "696": {
                    name: "Nova Starlight Absorber",
                    loots: {
                        "78": (salvage, max) => commonTrapLoot(salvage, max, 1200),
                        "81": (salvage, max) => commonTrapLoot(salvage, max, 3600),
                        "499": () => trapelapsedraw >= 604800 ? 1 : 0,
                        "693": (salvage, max) => commonTrapLoot(salvage, max, 300),
                        "694": (salvage, max) => commonTrapLoot(salvage, max, 86400)
                    }
                }
            }
            
            const f = (data) => { return String(data).length === 1 ? `0${data}` : data }
            const getDate = (time, md) => {
                const date = new Date(time);
                if (md) {
                    return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
                } else {
                    return `${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())} at ${f(date.getHours())}:${f(date.getMinutes())} UTC`;
                }
            }

            var userData = JSON.parse(body).data;
            const user = await bot.users.fetch(userid);
            var data = null;
            const errorMessage = `**${userData.name}**, it looks like you did not set any trap.`;
            if (userData.location === undefined) return message.channel.send(`Hey **${userData.name}**, travel somewhere and set a trap on your way!`)
            if (userData.location.traps !== undefined) {
                const trapsNumber = Object.keys(userData.location.traps).length;
                if (trapsNumber !== 0) {
                    if (trapsNumber > 1) {
                        if (trapId === null) {
                            var locations = "";
                            for (let [locationId, trapData] of Object.entries(userData.location.traps)) {
                                if (traps[trapData.id] !== undefined) {
                                    if (locationsList[locationId] !== undefined) {
                                        locations += `\`[${locationId}]\` **${traps[trapData.id].name}** @ **${locationsList[locationId].name}** - ${getDate(trapData.time, true)}\n`;
                                    } else locations += `\`[${locationId}]\` **${traps[trapData.id].name}** @ **Unknown Location (\`${locationId}\`)** - ${getDate(trapData.time, true)}\n`;
                                }
                            }
                            const embed = new MessageEmbed()
                                .setAuthor(`${user.username}  |  Trap Informations`, user.avatarURL())
                                .setDescription(`**${user.username}** has **${locations.split('\n').length - 1} traps** set. Please tell us which one you want to view the informations of. Use \`${message.guild.prefix}trap 4\` for example.\n${locations}`)
                                .setColor(`BLUE`);
                            return message.channel.send({embed});
                        } else if (userData.location.traps[trapId] === undefined) {
                            return message.channel.send(`Sorry **${message.author.username}**, but the specified trap does not exist.`);
                        } else if (userData.location.traps[trapId].id === "") {
                            return message.channel.send(`Sorry **${message.author.username}**, but the specified trap has been checked before and is no longer available.`);
                        }
                    } else trapId = Object.keys(userData.location.traps)[0];
                } else return message.channel.send(errorMessage);
            } else return message.channel.send(errorMessage);
            data = userData.location.traps[trapId];

            var trapelapsedraw = Math.floor((Date.now() - data.time) / 1000);
            var traptimeelapsed = Math.floor((Date.now() - data.time) / 3600000) > 24 ? (Math.floor((Date.now() - data.time) / 86400000)) : (Math.floor((Date.now() - data.time) / 3600000));

            const hour = Math.floor((Date.now() - data.time) / 3600000) > 24 ? 'Days' : 'Hours';
            var currentSalvage = userData.attributes.salvaging !== undefined ? userData.attributes.salvaging : 0;
            if (currentSalvage === 0) currentSalvage = 1;

            const maxSalvage = Math.floor(userData.level * 5);

            const beginning = `You will receive the following items (with ${isMax ? maxSalvage : currentSalvage === 1 ? 0 : currentSalvage} point(s) in salvaging) : \n`;
            var results = beginning;
            for (let [itemId, lootFunction] of Object.entries(traps[data.id].loots)) {
                const minLoot = lootFunction(isMax ? maxSalvage : currentSalvage, false);
                const maxLoot = lootFunction(isMax ? maxSalvage : currentSalvage, true);
                if (minLoot === maxLoot && maxLoot !== 0) results += ` - **${maxLoot}** **${items[itemId]}**\n`;
                else if (maxLoot !== 0) results += ` - Between **${minLoot}** and **${maxLoot}** **${items[itemId]}**\n`;
            }

            if (results === beginning) results = "You cannot receive any item yet, wait few minutes and some will eventually get in your trap!";
            const embed = new MessageEmbed()
                .setAuthor(`${userData.name}  |  Trap Informations  |  ${traps[data.id].name} @ ${locationsList[trapId].name} `, user.avatarURL())
                .setDescription(results)
                .setFooter(`You have set this trap the ${getDate(data.time, false)}. You can use "--max" for results with max salvaging.`)
                .setColor(0x00AE86);
            message.channel.send({embed});
        });
    } else {
        message.reply(`you must enter a valid UserID or User Mention.`);
    }
};

exports.infos = {
    category: "DRPG",
    description: "Displays users' traps informations and estimated loots.",
    usage: "\`&trap <user> <trapLocationId> <max>\`",
    example: "\`&trap 240971835330658305 4 --max\`",
    cooldown: {
        time: 5000,
        rpm: 25,
        resetTime: 60000,
        commandGroup: "drpg"
    }
}