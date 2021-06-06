import { User } from "discord.js";

export default class CDBAHandler {
	selected: any;
	entries: Map<string, any>;

	constructor() {
		this.selected = null;
		this.entries = new Map();
	}

	add(type: string, entry: string, user: User) {
		if (this.entries.get(entry) !== undefined) return this.vote(entry, user);
		this.entries.set(entry, {
			id: this.createId(),
			votes: 1,
			type,
			author: user,
			users: [user.id]
		});
		return false;
	}

	vote(entry: string, user: User) {
		const current = this.entries.get(entry);
		if (current.users.includes(user.id)) { return new Error("User has already voted."); }
		this.entries.set(entry, {
			id: current.id,
			votes: current.votes + 1,
			type: current.type,
			author: current.author,
			users: [...current.users, user.id]
		});
		return true;
	}

	clear() {
		this.entries = new Map();
	}

	sortEntries() {
		// eslint-disable-next-line func-names
		this.entries[Symbol.iterator] = function* () {
			yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
		};
		for (const [entry, data] of this.entries) {
			this.selected = {
				text: entry,
				type: data.type
			};
			return;
		}
	}

	createId() {
		let max = 0;
		for (const [, data] of this.entries) {
			if (data.id > max) max = data.id;
		}
		return max + 1;
	}

	getEntryById(id: string) {
		for (const [entry, data] of this.entries) {
			if (data.id === parseInt(id, 10)) return entry;
		}
		return null;
	}

	toString() {
		let list = "";
		this.sortEntries();
		for (const [entry, data] of this.entries) {
			list += `**${data.id}** - __**${data.type}** ${entry}__ - **${data.votes}** votes - by <@${
				data.author.id
			}>\n`;
		}
		return list;
	}
};
