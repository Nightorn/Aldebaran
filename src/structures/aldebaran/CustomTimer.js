module.exports = class CustomTimer {
	constructor(client, data) {
		this.id = data.id;
		this.client = client;
		this.userId = data.userId;
		this.content = data.content;
		this.channelId = data.channelId;
		this.trigger = data.trigger || null;
		this.timer = data.timer;
		this.occurences = data.occurences || 10;
		this.remind = data.remind;
		if (this.id === undefined) {
			if (this.userId === undefined
				|| this.content === null
				|| this.timer === null
			) return new TypeError("INVALID_DATA");
			this.remind = Date.now();
			this.create(
				this.userId, this.content, this.channelId, this.timer,
				this.trigger, this.occurences
			);
			if (this.timer < 2147483648) this.interval();
		} else if (this.trigger === null && this.timer < 2147483648) {
			this.remind = data.remind === null ? this.remind : data.remind;
			if (this.remind < Date.now()) {
				this.send(true);
				this.update(true);
			} else this.timeout();
		}
	}

	timeout() {
		this.timerTimeout = setTimeout(() => {
			this.occurences--;
			this.send();
			if (this.occurences === 0) this.delete();
			this.update();
			this.interval();
		}, this.remind - Date.now());
	}

	interval() {
		this.timerInterval = setInterval(() => {
			this.occurences--;
			this.send();
			if (this.occurences === 0) this.delete();
			this.update();
		}, this.timer);
	}

	async create(userId, content, channelId, timer, trigger, occurences) {
		if (trigger === null) {
			const result = await this.client.database
				.query(`INSERT INTO timers (userId, content, channelId, timer, occurences, remind) VALUES ("${userId}", "${content}", "${channelId}", ${timer}, ${occurences}, ${Date.now()})`);
			this.id = result.insertId;
			this.client.customTimers.set(this.id, this);
			return result;
		}
		const result = this.client.database
			.query(`INSERT INTO timers (userId, content, channelId, trigger, timer) VALUES ("${userId}", "${content}", "${channelId}", ${trigger}, "${timer}")`);
		this.id = result.insertId;
		this.client.customTimers.set(this.id, this);
		return result;
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
		} else this.client.channels.get(this.channelId).send(`<@${this.userId}>, here is your reminder${this.content !== null ? ` for **${this.content}**` : ""}!${late ? "\n*This reminder is late due to the bot being down. Sorry for the inconvenience.*" : ""}`).catch(this.delete);
	}

	async delete() {
		this.client.customTimers.delete(this.id);
		if (this.timerTimeout !== undefined) clearTimeout(this.timerTimeout);
		if (this.timerInterval !== undefined) clearTimeout(this.timerInterval);
		return this.client.database.query(`DELETE FROM timers WHERE id=${this.id}`);
	}
};
