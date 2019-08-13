module.exports = BaseTextChannel => class TextChannel extends BaseTextChannel {
	constructor(client, data) {
		super(client, data);
		this.drpgRecentADVs = new Map();

		setInterval(
			drpgRecentADVs => {
				for (const [username, adventure] of drpgRecentADVs) {
					if (adventure.date + 300000 < Date.now())
						drpgRecentADVs.delete(username);
				}
			},
			60000,
			this.drpgRecentADVs
		);
	}

	addAdventure(user) {
		this.drpgRecentADVs.set(user.username, {
			user,
			date: Date.now()
		});
	}
};
