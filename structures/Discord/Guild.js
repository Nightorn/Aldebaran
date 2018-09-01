module.exports = (BaseGuild) => {
    return class Guild extends BaseGuild {
        constructor(client, data) {
            super(client, data);
            client.database.guilds.selectOneById(data.id).then(guild => {
                if (guild !== undefined) return this.build(guild);
                this.settings = {};
                this.prefix = this.client.config.prefix;
                this.existsInDB = false;
            });
        }

        build(data) {
            for (let [key, value] of Object.entries(data)) this[key] = value;
            this.settings = JSON.parse(this.settings);
            this.prefix = this.settings.aldebaranPrefix || this.client.config.prefix;
        }

        async create() {
            this.existsInDB = true;
            return await this.client.database.guilds.createOneById(this.id);
        }

        async clear() {
            this.existsInDB = false;
            return await this.client.database.guilds.deleteOneById(this.id);
        }

        async changeSetting(property, value) {
            this.settings[property] = value;
            return await this.client.database.guilds.updateOneById(this.id, new Map([['settings', JSON.stringify(this.settings)]]));
        }
    }
}