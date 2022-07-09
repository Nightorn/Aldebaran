import dotenv from "dotenv";
// import canvas from "canvas";

import Client from "./structures/Client.js";

dotenv.config({ path: "./.env" });

/* canvas.registerFont("./assets/fonts/Exo2-Regular.ttf", {
	family: "Exo 2"
}); */

const bot = new Client(); // eslint-disable-line @typescript-eslint/no-unused-vars
