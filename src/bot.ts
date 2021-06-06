import { Structures } from "discord.js";
import { registerFont } from "canvas";

import AldebaranClient from "./structures/djs/Client";
import User from "./structures/djs/User";
import Guild from "./structures/djs/Guild";
import Message from "./structures/djs/Message";
import TextChannel from "./structures/djs/TextChannel";

require("dotenv").config();

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

Structures.extend("User", () => User);
Structures.extend("Guild", () => Guild);
Structures.extend("Message", () => Message);
Structures.extend("TextChannel", () => TextChannel);

const bot = new AldebaranClient(); // eslint-disable-line @typescript-eslint/no-unused-vars
