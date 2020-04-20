module.exports = class SocialProfile {
	constructor(user) {
		this.user = user;
		this.client = this.user.client;
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

	async fetch() {
		const data = await this.client.database.socialprofile
			.selectOneById(this.user.id);
		this.existsInDB = data !== undefined;
		this.ready = true;
		if (data !== undefined) {
			for (const [key, value] of Object.entries(data))
				if (key !== "userId") this[key] = value;
		}
		return data;
	}

	unready() {
		this.client.shard.broadcastEval(`const user = this.users.cache.get(${this.id}); if (user) !== undefined) { if (user.profile !== undefined) user.profile.ready = false }`);
	}
};
