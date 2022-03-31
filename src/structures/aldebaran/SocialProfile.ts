import { Client, Snowflake } from "discord.js";
import { DBProfile, SocialProfileProperty } from "../../utils/Constants.js";
import AldebaranClient from "../djs/Client.js";
import User from "../djs/User.js";

export default class SocialProfile {
	client: AldebaranClient;
	id: Snowflake;
	profile: DBProfile;
	ready: boolean = false;
	user: User;

	constructor(client: AldebaranClient, user: User, data?: DBProfile) {
		this.client = client;
		this.id = user.id;
		this.profile = data || { userId: this.id, fortunePoints: 0 };
		this.user = user;
	}

	async changeProperty(property: SocialProfileProperty, value: string) {
		this.profile[property] = value;
		return new Promise(async (resolve, reject) => {
			this.client.database.socialprofile.updateOneById(
				this.user.id,
				new Map([[property, value]])
			).then(resolve).catch(reject);
		});
	}

	unready() {
		this.client.shard!.broadcastEval((c: Client, { id }) => {
			(c as AldebaranClient).customProfiles.delete(id);
		}, { context: { id: this.id } });
	}
}
