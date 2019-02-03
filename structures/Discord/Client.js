const CommandHandler = require(`${process.cwd()}/structures/Aldebaran/CommandHandler.js`);
const DatabasePool = require(`${process.cwd()}/structures/Aldebaran/DatabasePool.js`);
const { Client } = require('discord.js');
const fs = require('fs');
module.exports = class AldebaranClient extends Client {
    constructor() {
        super({
            disabledEvents: [
                'TYPING_START',
            ]
        });
        this.commandGroups = {};
        this.commandHandler = new CommandHandler(this);
        this.config = require(`${process.cwd()}/config.json`);
        this.config.aldebaranTeam = require(`${process.cwd()}/Data/aldebaranTeam.json`);
        this.database = new DatabasePool(this);
        this.debugMode = process.argv[2] === 'dev';
        this.login(this.debugMode ? this.config.tokendev : this.config.token);
        this.models = {
            settings: require(`${process.cwd()}/functions/checks/configurationModels.js`)
        }
        if (process.argv[3] !== undefined && this.debugMode) this.config.prefix = process.argv[3];
        for (let [key, value] of Object.entries(this.models.settings.common)) {
            this.models.settings.user[key] = value;
            this.models.settings.guild[key] = value;
        }
        if (!fs.existsSync(`./cache/`)) fs.mkdirSync(`./cache/`);

        var usersDatabaseData = new Map();
        this.database.users.selectAll().then(users => {
            for (let data of users) {
                let id = data.userId;
                delete data.userId;
                usersDatabaseData.set(id, data);
            }
        });
        this.usersDatabaseData = usersDatabaseData;

        var profilesDatabaseData = new Map();
        this.database.socialprofile.selectAll().then(profiles => {
            for (let data of profiles) {
                let id = data.userId;
                delete data.userId;
                profilesDatabaseData.set(id, data);
            }
        });
        this.profilesDatabaseData = profilesDatabaseData;
        
        fs.readdir("./events/", (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                let eventFunction = require(`${process.cwd()}/events/${file}`);
                let eventName = file.split(".")[0];
                this.on(eventName, (...args) => eventFunction.run(this, ...args));
            });
        });
    }
}