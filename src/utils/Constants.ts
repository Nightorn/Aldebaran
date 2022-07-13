import { importAssets, timezoneSupport } from "./Methods.js";
import { XPBases, ItemList, LocationDB } from "../interfaces/DiscordRPG.js";
import { Mode } from "nodesu";
import { SlashCommandBooleanOption, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption } from "@discordjs/builders";

type AldebaranTeam = { [key: string]: {
	titles: string[],
	acknowledgements: string[],
	staffRank: number,
	text: string
} };

type Categories = { [key: string]: {
	name: string,
	title: string,
	description: string
} };

type PackageFile = {
	name: string,
	version: string,
	description: string,
	main: string,
	dependencies: { [key: string]: string },
	devDependencies: { [key: string]: string },
	scripts: { [key: string]: string },
	repository: { type: string, url: string },
	author: string,
	license: string,
	bugs: { url: string },
	homepage: string,
	type: string
};

type ActionText = { [key: string]: { self: string[], user: string[] } };
type ImageURLs = { [key: string]: string[] };
type Presences = { text: string, type: "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING" | "COMPETING" }[];

export const actionText: ActionText = importAssets("./assets/data/actiontext.json");
export const aldebaranTeam: AldebaranTeam = importAssets("./config/aldebaranTeam.json");
export const categories: Categories = importAssets("./assets/data/categories.json");
export const drpgXpBases: XPBases = importAssets("./assets/data/drpg/bases.json");
export const drpgItems: ItemList = importAssets("./assets/data/drpg/itemList.json");
export const drpgLocationdb: LocationDB = importAssets("./assets/data/drpg/locations.json");
export const imageUrls: ImageURLs = importAssets("./assets/data/imageurls.json");
export const packageFile: PackageFile = importAssets("./package.json");
export const presences: Presences = importAssets("./config/presence.json");

export type OsuMode = keyof typeof Mode;

export const osuModeChoices = [
	{ name: "osu!", value: "osu" },
	{ name: "osu!mania", value: "mania" },
	{ name: "osu!ctb", value: "ctb" },
	{ name: "osu!taiko", value: "taiko" }
];

export type ErrorString = keyof typeof Errors;
export type If<T extends boolean, U> = T extends true ? U : U | null;
export type PermissionString = keyof typeof Permissions;
export type CommonSettingKey = keyof typeof CommonSettingsModel;
export type UserSettingKey = CommonSettingKey | keyof typeof UserSettingsModel;
export type ServerSettingKey = CommonSettingKey
	| keyof typeof ServerSettingsModel;

export type UserSettings = { [key in UserSettingKey]?: string };
export type ServerSettings = { [key in ServerSettingKey]?: string };

export type Setting = {
	category: string,
	help: string,
	showOnlyIfBotIsInGuild?: string,
	support: (value: string) => boolean,
};

const CommonSettingsModel = {
	adventuretimer: {
		support: (value: string) => value === "on" || value === "off" || value === "random",
		help: "Adventure Timer (\"random\" for 3s +-) - [on | off | random]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	},
	healthmonitor: {
		support: (value: string) => (
			value === "on"
			|| value === "off"
			|| Number(value) > 0 && Number(value) < 100
		),
		help: "Health Monitor - [on | off | healthPercentage]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	}
};

const sidestimerValues = ["on", "off", "mine", "forage", "chop", "fish"];
const UserSettingsModel = {
	...CommonSettingsModel,
	individualhealthmonitor: {
		support: (value: string) => ["off", "character", "pet"].indexOf(value) !== -1,
		help:
	"Lets you choose whether you want to display the health of your character or your pet with the health monitor - [off | character | pet]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	},
	sidestimer: {
		support: sidestimerValues.includes,
		help: "Sides Timer - [on | off | primaryAction (mine, forage...)]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	},
	timerping: {
		support: (value: string) => (
			value === "on"
			|| value === "adventure"
			|| value === "sides"
			|| value === "off"
		),
		help: "Timer Pings - [on | adventure | sides | off]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	},
	timezone: {
		support: timezoneSupport,
		help:
	"Sets your timezone - [GMT, UTC, or [tz database timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)]",
		category: process.env.NAME || "Aldebaran"
	},
	dateformat: {
		support: (value: string) => (
			value.includes("DD")
            && value.includes("MM")
            && value.includes("YYYY")
		),
		help: "Time Format - Use DD (day of month), MM (month number) and YYYY (year)",
		category: process.env.NAME || "Aldebaran"
	},
	osuusername: {
		support: () => true,
		help: "osu! default username (for osu! commmands)",
		category: "osu!"
	},
	osumode: {
		support: () => true,
		help: "osu! default mode (for osu! commmands) [osu | mania | taiko | ctb]",
		category: "osu!"
	}
};

const ServerSettingsModel = {
	...CommonSettingsModel,
	autodelete: {
		support: (value: string) => value === "on" || value === "off",
		help: "Auto Delete Sides & Adv Commands - [on | off]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	},
	sidestimer: {
		support: (value: string) => value === "on" || value === "off",
		help: "Sides Timer - [on | off]",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	},
	aldebaranprefix: {
		support: () => true,
		help: `${process.env.NAME}'s Prefix - [& | Guild Customized]`,
		category: process.env.NAME || "Aldebaran"
	},
	discordrpgprefix: {
		support: () => true,
		help: "Prefix",
		showOnlyIfBotIsInGuild: "170915625722576896",
		category: "DiscordRPG"
	}
};

export const SettingsModel = {
	common: CommonSettingsModel,
	user: UserSettingsModel,
	guild: ServerSettingsModel
};

export const Errors = {
	API_ERROR: () => "This API has thrown an error.",
	API_RATELIMIT: () => "We have hit the ratelimit of (the endpoint of) this API.",
	CUSTOM: (res: string) => res,
	IMPOSSIBLE: () => "You are asking the impossible",
	INCORRECT_CMD_USAGE: () => "This command has been used incorrectly.",
	INVALID_ARGS: () => "You are not supplying the arguments this command needs.",
	INVALID_USER: () => "The user specified does not exist.",
	MISSING_ARGS: () => "Some arguments are missing.",
	NOT_FOUND: (res: string) => `The requested ${res || "resource"} has not been found.`,
	UNALLOWED_OPERATION: () => "You are not allowed to do this.",
	UNALLOWED_COMMAND: () => "You are not allowed to use this command.",
	UNEXPECTED_BEHAVIOR: () => "Something went wrong.",
	WRONG_USAGE: () => "You are doing something wrong."
};

export const Permissions = {
	ADMINISTRATOR: 2,
	obsolete4: 4,
	obsolete8: 8,
	MANAGE_PERMISSIONS: 16,
	BAN_USERS: 32,
	MUTE_USERS: 64,
	EDIT_USERS: 128,
	RESTART_BOT: 256,
	VIEW_SERVERLIST: 512,
	obsolete1024: 1024,
	DEVELOPER: 2048
};

export type CommandMode = "ADMIN" | "HELP" | "IMAGE" | "NORMAL";
export type Platform = "DISCORD" | "DISCORD_SLASH";
export type SlashCommandOption = SlashCommandBooleanOption
	| SlashCommandIntegerOption
	| SlashCommandStringOption
	| SlashCommandUserOption;
export type SocialProfileProperty = "aboutMe" | "dmFriendly" | "age" | "gender" | "name" | "country" | "timezone" | "birthday" | "profilePictureLink" | "favoriteGames" | "profileColor" | "favoriteMusic" | "socialLinks" | "zodiacName" | "flavorText";

export type DBUser = {
	userId: string;
	settings: string;
	permissions?: number;
	timeout?: number;
};

export type DBGuild = {
	guildid: string;
	settings: string;
	commands: string;
};

type BaseDBProfile = {
	userId: string;
	fortunePoints: number;
};

export type DBProfile = BaseDBProfile & {
	[key in SocialProfileProperty]?: string
};
