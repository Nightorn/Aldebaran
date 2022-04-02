import dotenv from "dotenv";
// import canvas from "canvas";

import AldebaranClient from "./structures/djs/Client.js";

dotenv.config({ path: "./.env" });

/* canvas.registerFont("./assets/fonts/Exo2-Regular.ttf", {
	family: "Exo 2"
}); */

const bot = new AldebaranClient(); // eslint-disable-line @typescript-eslint/no-unused-vars
