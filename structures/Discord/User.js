const SocialProfile = require(`${process.cwd()}/structures/Aldebaran/SocialProfile.js`);
module.exports = (BaseUser) => {
    return class User extends BaseUser {
        constructor(client, data) {
            super(client, data);
            this.existsInDB = false;
            this.settings = {};
            this.banned = false;
            this.client.database.users.selectOneById(data.id).then(user => {
                if (user !== undefined) return this.build(user);
            });
            this.timers = {
                adventure: null,
                padventure: null,
                sides: null, 
                travel: null
            }
            this.generalCooldown = 0;
            this.profile = new SocialProfile(this);
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
            return await this.client.database.users.deleteOneById(this.id);
        }

        async changeSetting(property, value) {
            this.settings[property] = value;
            return await this.client.database.users.updateOneById(this.id, new Map([['settings', JSON.stringify(this.settings)]]));
        }
    }
}