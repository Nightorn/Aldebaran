const { Collection } = require('discord.js');
module.exports = (BaseGuild) => {
    return class Guild extends BaseGuild {
        constructor(client, data) {
            super(client, data);
            this.settings = {};
            this.prefix = this.client.config.prefix;
            this.existsInDB = false;
            var interval = setInterval(() => {
                if (this.client.databaseFetch !== undefined) {
                    if (this.client.databaseFetch.data.guilds.size === this.client.databaseFetch.counts.guilds) {
                        clearInterval(interval);
                        if (this.client.databaseFetch.data.guilds.get(this.id) !== undefined) {
                            this.build(this.client.databaseFetch.data.guilds.get(this.id));
                        }
                    }
                }
            }, 100);
        }

        build(data) {
            for (let [key, value] of Object.entries(data)) this[key] = value;
            this.settings = JSON.parse(this.settings);
            this.prefix = this.client.debugMode ? this.client.config.prefix : this.settings.aldebaranPrefix || this.client.config.prefix;
            this.polluxBoxPing = new Collection();
        }

        async create() {
            this.existsInDB = true;
            return await this.client.database.guilds.createOneById(this.id);
        }

        async clear() {
            this.existsInDB = false;
            this.settings = {};
            return await this.client.database.guilds.deleteOneById(this.id);
        }

        async changeSetting(property, value) {
            this.settings[property] = value;
            return await this.client.database.guilds.updateOneById(this.id, new Map([['settings', JSON.stringify(this.settings)]]));
        }
    }
}