module.exports = class CustomTimer {
	constructor(client, data, first = false) {
		this.id = data.id;
		this.client = client;
		this.userId = data.userId;
		this.content = data.content;
		this.channelId = data.channelId;
		this.trigger = data.trigger || null;
		this.timer = data.timer;
		this.occurences = data.occurences || 10;
		this.remind = data.remind || Date.now();
		if (this.trigger === null && this.timer < 2147483648) {
			this.remind = data.remind === null ? this.remind : data.remind;
			if (this.remind < Date.now() && !first) {
				this.send(true);
				this.update(true);
			} else this.timeout(first ? this.timer : 0);
		}
	}

	timeout(delay = 0) {
		this.timerTimeout = setTimeout(() => {
			this.occurences--;
			this.send();
			if (this.occurences === 0) this.delete();
			this.update();
			this.interval();
		}, this.remind + delay - Date.now());
	}

	interval() {
		this.timerInterval = setInterval(() => {
			this.occurences--;
			this.send();
			if (this.occurences === 0) this.delete();
			this.update();
		}, this.timer);
	}

	static async create(client, data) {
		return new Promise((resolve, reject) => {
			const { userId, content, channelId, trigger, timer } = data;
			const occurences = data.occurences || 10;
			const remind = Date.now();
			if (userId && content && timer && trigger === undefined) { // When the custom timer is interval-based
				const query = channelId !== null
					? `INSERT INTO timers (userId, content, channelId, timer, occurences, remind) VALUES ("${userId}", "${content}", "${channelId}", ${timer}, ${occurences}, ${remind})`
					: `INSERT INTO timers (userId, content, timer, occurences, remind) VALUES ("${userId}", "${content}", ${timer}, ${occurences}, ${remind})`;
				client.database.query(query).then(result => {
					const id = result.insertId;
					const customTimer = new CustomTimer(client,
						{ ...data, remind, id }, true);
					client.customTimers.set(id, customTimer); // Adds the custom timer to the registry
					resolve(customTimer);
				}).catch(reject);
			/* } else if (userId && content && timer && trigger) { // When the custom timer is trigger-based
				client.database.query(`INSERT INTO timers (userId, content, channelId, trigger, timer) VALUES ("${userId}", "${content}", "${channelId}", ${trigger}, "${timer}")`).then(result => {
					const customTimer = new CustomTimer(client, data);
					client.customTimers.set(result.insertId, customTimer);
					resolve(customTimer);
				}).catch(reject); */
			} else reject(new TypeError("INVALID_DATA"));
		});
	}

	async update(fixOffset = false) {
		if (fixOffset) {
			const miss = Math.ceil((Date.now() - this.remind) / this.timer);
			this.remind += this.timer * miss;
			this.timeout();
		} else this.remind += this.timer;
		return this.client.database.query(`UPDATE timers SET remind=${this.remind}, occurences=${this.occurences} WHERE id=${this.id}`);
	}

	async send(late = false) {
		const user = await this.client.users.fetch(this.userId);
		if (this.channelId === null) {
			user.send(`Here is your reminder${this.content !== null ? ` for **${this.content}**` : ""}!${late ? "\n*This reminder is late due to the bot being down. Sorry for the inconvenience.*" : ""}`).catch(this.delete);
		} else if (this.client.channels.cache.get(this.channelId)) {
			this.client.channels.cache.get(this.channelId)
				.send(`<@${this.userId}>, here is your reminder${this.content !== null ? ` for **${this.content}**` : ""}!${late ? "\n*This reminder is late due to the bot being down. Sorry for the inconvenience.*" : ""}`)
				.catch(this.delete);
		}
	}

	async delete() {
		this.client.customTimers.delete(this.id);
		if (this.timerTimeout !== undefined) clearTimeout(this.timerTimeout);
		if (this.timerInterval !== undefined) clearTimeout(this.timerInterval);
		return this.client.database.query(`DELETE FROM timers WHERE id=${this.id}`);
	}
};
