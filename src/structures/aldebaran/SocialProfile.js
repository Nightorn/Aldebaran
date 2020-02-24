module.exports = class SocialProfile {
	constructor(user) {
		this.user = user;
		this.client = this.user.client;
		this.existsInDB = false;
		if (this.client.databaseData.profiles.get(this.user.id) !== undefined) {
			const dbData = this.client.databaseData.profiles.get(this.user.id);
			for (const [key, value] of Object.entries(dbData)) this[key] = value;
			this.existsInDB = true;
		}
	}

	async create() {
		this.existsInDB = true;
		return this.client.database.socialprofile.createOneById(this.user.id);
	}

	async clear() {
		this.existsInDB = false;
		return this.client.database.socialprofile.deleteOneById(this.user.id);
	}

	async changeProperty(property, value) {
		this[property] = value;
		return new Promise(async (resolve, reject) => {
			if (!this.existsInDB) await this.create();
			this.client.database.socialprofile.updateOneById(
				this.user.id,
				new Map([[property, value]])
			).then(resolve).catch(reject);
		});
	}
};
