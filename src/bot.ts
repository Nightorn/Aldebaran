import dotenv from "dotenv";
import DiscordClient from "./structures/DiscordClient.js";

dotenv.config({ path: "./.env" });

const bot = new DiscordClient(); // eslint-disable-line @typescript-eslint/no-unused-vars
