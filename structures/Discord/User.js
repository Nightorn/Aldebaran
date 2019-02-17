const SocialProfile = require(`${process.cwd()}/structures/Aldebaran/SocialProfile.js`);
module.exports = (BaseUser) => {
    return class User extends BaseUser {
        constructor(client, data) {
            super(client, data);
            this.asBotStaff = this.client.config.aldebaranTeam[this.id] || null;
            this.banned = false;
            this.existsInDB = false;
            this.generalCooldown = 0;
            this.profile = new SocialProfile(this);
            this.settings = {};
            var interval = setInterval(() => {
                if (this.client.databaseFetch !== undefined) {
                    if (this.client.databaseFetch.data.users.size === this.client.databaseFetch.counts.users) {
                        clearInterval(interval);
                        if (this.client.databaseFetch.data.users.get(this.id) !== undefined) {
                            this.build(this.client.databaseFetch.data.users.get(this.id));
                        }
                    }
                }
            }, 100);
            this.timers = {
                adventure: null,
                padventure: null,
                sides: null, 
                travel: null
            }
        }

        build(data) {
            for (let [key, value] of Object.entries(data)) this[key] = value;
            this.settings = JSON.parse(this.settings);
            this.existsInDB = true;
        }

        async create() {
            this.existsInDB = true;
            return await this.client.database.users.createOneById(this.id);
        }

        async clear() {
            this.existsInDB = false;
            this.settings = {};
            return await this.client.database.users.deleteOneById(this.id);
        }

        async changeSetting(property, value) {
            this.settings[property] = value;
            return await this.client.database.users.updateOneById(this.id, new Map([['settings', JSON.stringify(this.settings)]]));
        }
    }
}