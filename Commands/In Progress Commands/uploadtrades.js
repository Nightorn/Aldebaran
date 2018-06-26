const poolQuery = require('./../functions/database/poolQuery');
const Discord = require("discord.js");
const request = require(`request`);
const config = require(`./../config.json`)
exports.run = function(client, message, args, tradeapilimit, ratelimitrest) {
    if (ratelimitrest != null || Date.now() <= ratelimitrest)return;
    if (message.author.id != ``)
    if (tradeapilimit == 0)return message.channel.send(`This Command is globally ratelimited, please try again at.`);
    request({uri:`http://api.discorddungeons.me/v3/trade`, headers: {"Authorization":config.drpg_apikey} }, function(err, response, body) {
        if (err) return;
        ratelimitrest = Math.floor(Date.now() + (5 * 60 * 1000))
        const data = JSON.parse(body);
        for(let [value] of Object.entries(data)){
            console.log(value.id)
            tradeid = value.id
            markettype =value.type
            totalquant = (value.buy != undefined) ? value.buy.item : value.sell.item;
            quantcomplete = (value.bought != undefined) ? value.bought : value.sold;
            price = (value.buy !=undefined) ? value.buy.price : value.sell.price;
            userid = value.from
            itemid = (value.buy != undefined) ? value.buy.item : value.sell.item;
            quantremaining = Math.floor(totalquant - quantcomplete) 
            if (quantremaining > 0) {
                const connect = function() {
                    poolQuery(`INSERT INTO itemmarket (tradeid,itemid,userid,markettype,totalquant,quantcomplete,price,quantremain) VALUES ('${tradeid}','${itemid}','${userid}','${markettype}','${totalquant}','${quantcomplete}','${price}','${quantremaining}')`)  
                }

            connect();
            }
        }
    });
}
