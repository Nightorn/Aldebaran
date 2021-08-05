import Guild from "../structures/djs/Guild.js";
import User from "../structures/djs/User.js";
import { importAssets, timezoneSupport } from "./Methods.js";

type Categories = { [key: string]: {
	name: string,
	title: string,
	description: string
}};

type DRPGFormulaData = {
	amount: { max: string, min: string },
	chance: number,
	minlevel: number,
	xp: {
		regular: { max: string, min: string },
		skill: { max: string, min: string }
	}
};

type DRPGLootData = {
	amount: { max: string; min: string },
	id: string,
	mintime: number
};

export type DRPGItem = {
	attributes: { [key: string]: number }, // "xpBoost" | "crits"
	cost: number,
	def?: number,
	desc: string,
	donate?: boolean,
	fish?: DRPGFormulaData,
	foragedata?: DRPGFormulaData,
	id: string,
	image?: string,
	itemBoost?: number,
	level: number,
	name: string,
	ore?: DRPGFormulaData,
	plural: string,
	potion?: {
		boost?: { strength: string },
		effects?: { strength: number },
		heal?: number,
		last?: number,
		temp?: boolean,
		time?: number
	},
	prefix: string,
	price?: number,
	ring?: {
		attribute: string // "strength" | "defense" | "xpBoost",
		boost: number,
		stat?: string // "strength" | "defense" | "luck"
	},
	sapling?: {	loot: DRPGLootData, minlevel: number },
	sell: number | string,
	sellable: boolean,
	skillLevel?: number,
	test?: number,
	toolData?: { catchChance: number },
	toolType?: string, // "pickaxe" | "axe"
	tradable: boolean,
	trap?: { loot: DRPGLootData[], minlevel: number }
	type: "potion" | "weapon" | "dummy" | "effectpotion" | "chest" | "boots" | "helm" | "ore" | "tool" | "necklace",
	untradable?: boolean,
	weapon?: {
		dmg: { max: number, min: number },
		type?: string // "dagger"
	}
};

type ActionText = { [key: string]: { self: string[], user: string[] } }
type DRPGXPBases = { [key: string]: number };
type DRPGItemList = { [key: string]: DRPGItem };
type DRPGLocationDB = { [key: string]: string };
type ImageURLs = { [key: string]: string[] };

export const actionText: ActionText = importAssets("./assets/data/actiontext.json");
export const categories: Categories = importAssets("./assets/data/categories.json");
export const drpgXpBases: DRPGXPBases = importAssets("./assets/data/drpg/bases.json");
export const drpgItems: DRPGItemList = importAssets("./assets/data/drpg/itemList.json");
export const drpgLocationdb: DRPGLocationDB = importAssets("./assets/data/drpg/locations.json");
export const imageUrls: ImageURLs = importAssets("./assets/data/imageurls.json");

export type ErrorString = keyof typeof Error;
export type PermissionString = keyof typeof Permissions;
export type CommonSetting = keyof typeof SettingsModel.common;
export type UserSetting = CommonSetting | keyof typeof SettingsModel.user;
export type GuildSetting = CommonSetting | keyof typeof SettingsModel.guild;

type TargetedSettings = { [key: string]: {
	category: string,
	help: string,
	postUpdate?: (value: string, user: User, guild: Guild) => void,
	showOnlyIfBotIsInGuild?: string,
	support: (value: string) => boolean,
}};

type Settings = {
	common: TargetedSettings,
	user: TargetedSettings,
	guild: TargetedSettings
};

export const SettingsModel: Settings = {
	common: {
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
				|| (parseInt(value, 10) > 0 && parseInt(value, 10) < 100)
			),
			help: "Health Monitor - [on | off | healthPercentage]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		polluxboxping: {
			support: (value: string) => value === "on" || value === "off",
			help: "Box Ping - [on | off]",
			postUpdate: (value: string, user: User, guild: Guild) => {
				if (value === "on") guild.polluxBoxPing.set(user.id, user);
				else guild.polluxBoxPing.delete(user.id);
			},
			showOnlyIfBotIsInGuild: "271394014358405121",
			category: "Pollux"
		}
	},
	user: {
		individualhealthmonitor: {
			support: (value: string) => ["off", "character", "pet"].indexOf(value) !== -1,
			help:
        "Lets you choose whether you want to display the health of your character or your pet with the health monitor - [off | character | pet]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		sidestimer: {
			support: (value: string) => (
				value === "on"
          || value === "off"
          || value === "mine"
          || value === "forage"
          || value === "chop"
          || value === "fish"
			),
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
			category: "Aldebaran"
		},
		dateformat: {
			support: (value: string) => (
				value.indexOf("DD") !== -1
          && value.indexOf("MM") !== -1
          && value.indexOf("YYYY") !== -1
			),
			help:
        "Time Format - Use DD (day of month), MM (month number) and YYYY (year)",
			category: "Aldebaran"
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
	},
	guild: {
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
			help: "Aldebaran's Prefix - [& | Guild Customized]",
			postUpdate: (value: string, _: User, guild: Guild) => { guild.prefix = value; },
			category: "Aldebaran"
		},
		discordrpgprefix: {
			support: () => true,
			help: "Prefix",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		}
	}
};

export const Error = {
	API_ERROR: () => "This API has thrown an error.",
	API_RATELIMIT: () => "We have hit the ratelimit of (the endpoint of) this API.",
	CUSTOM: (res: string) => res,
	IMPOSSIBLE: () => "You are asking the impossible",
	INCORRECT_CMD_USAGE: () => "This command has been used incorrectly.",
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
	EVALUATE_CODE: 4,
	EXECUTE_DB_QUERIES: 8,
	MANAGE_PERMISSIONS: 16,
	BAN_USERS: 32,
	MUTE_USERS: 64,
	EDIT_USERS: 128,
	RESTART_BOT: 256,
	VIEW_SERVERLIST: 512,
	MODERATE_ACTIVITIES: 1024,
	DEVELOPER: 2048
};
