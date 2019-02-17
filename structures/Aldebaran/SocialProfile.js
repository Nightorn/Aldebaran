module.exports = class SocialProfile {
    constructor(user) {
        this.user = user;
        this.client = this.user.client;
        this.existsInDB = false;
        var interval = setInterval(() => {
            if (this.client.databaseFetch !== undefined) {
                if (this.client.databaseFetch.data.profiles.size === this.client.databaseFetch.counts.profiles) {
                    clearInterval(interval);
                    if (this.client.databaseFetch.data.profiles.get(this.id) !== undefined) {
                        this.build(this.client.databaseFetch.data.profiles.get(this.id));
                    }
                }
            }
        }, 100);
    }

    build(data) {
        for (let [key, value] of Object.entries(data)) this[key] = value;
        this.existsInDB = true;
    }

    async create() {
        this.existsInDB = true;
        return await this.client.database.socialprofile.createOneById(this.user.id);
    }

    async clear() {
        this.existsInDB = false;
        return await this.client.database.socialprofile.deleteOneById(this.user.id);
    }

    async changeProperty(property, value) {
        return new Promise(async (resolve) => {
            if (!this.existsInDB) await this.create();
            this.client.database.socialprofile.updateOneById(this.user.id, new Map([[property, value]])).then(async (result) => {
                const newProfile = await this.client.database.socialprofile.selectOneById(this.user.id);
                this.build(newProfile);
                resolve(result);
            });
        });
    }
}