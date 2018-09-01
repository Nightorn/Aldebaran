const { Structures } = require('discord.js'), AldebaranClient = require(`${process.cwd()}/structures/Discord/Client.js`);

Object.defineProperty(Number.prototype, "formatNumber", {
    enumerable: false,
    writable: true,
    value: function(){
        return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

});

Object.defineProperty(String.prototype, "formatNumber", {
    enumerable: false,
    writable: true,
    value: function(){
        return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
});

Structures.extend('User', BaseUser => { return require(`${process.cwd()}/structures/Discord/User`)(BaseUser); });
Structures.extend('Guild', BaseGuild => { return require(`${process.cwd()}/structures/Discord/Guild`)(BaseGuild); });
Structures.extend('Message', BaseMessage => { return require(`${process.cwd()}/structures/Discord/Message`)(BaseMessage); });

var bot = new AldebaranClient();