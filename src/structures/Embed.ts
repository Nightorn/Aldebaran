import axios from "axios";
import FormData from "form-data";
import { ColorResolvable, MessageEmbed } from "discord.js";

type Author = { iconURL?: string, name: string, url?: string };
type Field = { title: string, content: string, inline?: boolean };
type Footer = { iconURL?: string, text: string };

const autumnUploadURL = "https://autumn.revolt.chat/attachments";

export default class Embed {
	public author?: Author;
	public color?: string;
	public description?: string;
	public fields: Field[] = [];
	public footer?: Footer;
	public imageURL?: string;
	public title?: string;
	public thumbnail?: string;
	public timestamp?: Date;
	public url?: string;

	addField(title: string, content: string, inline?: boolean) {
		this.fields.push({ title, content, inline });
		return this;
	}

	setAuthor(author: Author) {
		this.author = author;
		return this;
	}

	setColor(color: string) {
		this.color = color;
		return this;
	}

	setDescription(description: string) {
		this.description = description;
		return this;
	}

	setFooter(footer: string | Footer) {
		this.footer = typeof footer === "string" ? { text: footer } : footer;
		return this;
	}

	setImage(imageURL: string) {
		this.imageURL = imageURL;
		return this;
	}

	setTitle(title: string) {
		this.title = title;
		return this;
	}

	setThumbnail(thumbnail: string) {
		this.thumbnail = thumbnail;
		return this;
	}

	setTimestamp(timestamp: Date) {
		this.timestamp = timestamp;
		return this;
	}

	setURL(url: string) {
		this.url = url;
		return this;
	}

	toDiscordEmbed() {
		const embed = new MessageEmbed();
		if (this.author) embed.setAuthor(this.author);
		if (this.color) embed.setColor(this.color as ColorResolvable);
		if (this.description) embed.setDescription(this.description);
		if (this.footer) embed.setFooter(this.footer);
		if (this.imageURL) embed.setImage(this.imageURL);
		if (this.title) embed.setTitle(this.title);
		if (this.thumbnail) embed.setThumbnail(this.thumbnail);
		if (this.timestamp) embed.setTimestamp(this.timestamp);
		if (this.url) embed.setURL(this.url);
		this.fields.forEach(f => embed.addField(f.title, f.content, f.inline));
		return embed;
	}

	async toRevoltEmbed() {
		let description = this.description ? `${this.description}` : "";
		for (const field of this.fields) {
			description += `\n> \\> **${field.title}**\n> ${field.content}\n`;
		}

		const timestampBit = this.timestamp?.toLocaleDateString();
		const footerBit = this.footer ? `##### ${this.footer.text}` : "";
		const footer = timestampBit && footerBit
			? `${footerBit} 🞄 ${timestampBit}`
			: `${footerBit || ""}${timestampBit || ""}`;
		const title = this.url ? `[${this.title}](${this.url})` : this.title;
		const titleBit = title ? `### ${title}` : "";

		// attachments need to be uploaded to Autumn, Revolt's file server
		if (this.imageURL) {
			const image = await axios.get(this.imageURL, { responseType: "stream" });

			const form = new FormData();
			form.append("file", image.data);
			const id = await axios.post(autumnUploadURL, form);

			this.imageURL = id.data.id;
		}

		return {
			colour: this.color,
			description: `${titleBit}\n${description}\n${footer}`,
			icon_url: this.author?.iconURL,
			media: this.imageURL,
			title: this.author?.name,
			url: this.author?.url
		};
	}
}
