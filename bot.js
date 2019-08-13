const { Structures } = require("discord.js");

const AldebaranClient = require("./structures/Discord/Client");
const User = require("./structures/Discord/User");
const Guild = require("./structures/Discord/Guild");
const Message = require("./structures/Discord/Message");
const Channel = require("./structures/Discord/TextChannel");

// With the contribution of holroy
Number.formatNumber = n => {
	const parts = n.toString().split(".");
	return (
		parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    + (parts[1] ? `.${parts[1]}` : "")
	);
};

Date.getTimeString = (timeInMs, format) => {
	const days = Math.floor(timeInMs / 86400000);
	const hours = Math.floor((timeInMs / 3600000) % 60);
	const minutes = Math.floor((timeInMs / 60000) % 60);
	const seconds = Math.floor((timeInMs / 1000) % 60);

	format = format.replace("DD", days);
	format = format.replace("HH", hours < 10 ? `0${hours}` : hours);
	format = format.replace("MM", minutes < 10 ? `0${minutes}` : minutes);
	format = format.replace("SS", seconds < 10 ? `0${seconds}` : seconds);
	return format;
};

Structures.extend("User", BaseUser => User(BaseUser));
Structures.extend("Guild", BaseGuild => Guild(BaseGuild));
Structures.extend("Message", BaseMessage => Message(BaseMessage));
Structures.extend("TextChannel", BaseTextChannel => Channel(BaseTextChannel));

const bot = new AldebaranClient(); // eslint-disable-line no-unused-vars
