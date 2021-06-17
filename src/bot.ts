import dotenv from "dotenv";
import { Structures } from "discord.js";
import canvas from "canvas";

import AldebaranClient from "./structures/djs/Client.js";
import User from "./structures/djs/User.js";
import Guild from "./structures/djs/Guild.js";
import Message from "./structures/djs/Message.js";
import TextChannel from "./structures/djs/TextChannel.js";

dotenv.config();

canvas.registerFont("../../assets/fonts/Exo2-Regular.ttf", {
	family: "Exo 2"
});

Structures.extend("User", () => User);
Structures.extend("Guild", () => Guild);
Structures.extend("Message", () => Message);
Structures.extend("TextChannel", () => TextChannel);

const bot = new AldebaranClient(); // eslint-disable-line @typescript-eslint/no-unused-vars
