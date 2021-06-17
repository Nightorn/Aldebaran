import AldebaranClient from "../djs/Client.js";
import User from "../djs/User.js";

export default class SocialProfile {
	user: User;
	client: AldebaranClient;
	existsInDB: boolean = false;
	profile: any;
	ready: boolean = false;

	constructor(user: User) {
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

	async changeProperty(property: string, value: string) {
		this.profile[property] = value;
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
				if (key !== "userId") this.profile[key] = value;
		}
		return data;
	}

	unready() {
		(this.client.shard)!.broadcastEval(`const user = this.users.cache.get(${this.user.id}); if (user) !== undefined) { if (user.profile !== undefined) user.profile.ready = false }`);
	}
};
