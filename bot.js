require("dotenv").config();
const { Structures } = require("discord.js");
const { registerFont } = require("canvas");

const AldebaranClient = require("./src/structures/djs/Client");
const User = require("./src/structures/djs/User");
const Guild = require("./src/structures/djs/Guild");
const Message = require("./src/structures/djs/Message");
const Channel = require("./src/structures/djs/TextChannel");

// With the contribution of holroy
Number.formatNumber = n => {
	const parts = n.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		+ (parts[1] ? `.${parts[1]}` : "");
};

Date.getTimeString = (timeInMs, format) => {
	const days = Math.floor(timeInMs / 86400000);
	const hours = Math.floor((timeInMs / 3600000) % 24);
	const minutes = Math.floor((timeInMs / 60000) % 60);
	const seconds = Math.floor((timeInMs / 1000) % 60);

	format = format.replace("DD", days);
	format = format.replace("HH", hours < 10 ? `0${hours}` : hours);
	format = format.replace("MM", minutes < 10 ? `0${minutes}` : minutes);
	format = format.replace("SS", seconds < 10 ? `0${seconds}` : seconds);
	return format;
};

RegExp.escape = s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

registerFont("./assets/fonts/Exo2-Regular.ttf", {
	family: "Exo 2"
});

Structures.extend("User", BaseUser => User(BaseUser));
Structures.extend("Guild", BaseGuild => Guild(BaseGuild));
Structures.extend("Message", BaseMessage => Message(BaseMessage));
Structures.extend("TextChannel", BaseTextChannel => Channel(BaseTextChannel));

const bot = new AldebaranClient(); // eslint-disable-line no-unused-vars
