import { ActivityType, Guild, Snowflake, User } from "discord.js";
import { importAssets, timezoneSupport } from "./Methods.js";
import { DRPGXPBases, DRPGItemList, DRPGLocationDB } from "../interfaces/DiscordRPG.js";
import { Mode } from "nodesu";

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
type Presences = { text: string, type: ActivityType }[];

export const actionText: ActionText = importAssets("./assets/data/actiontext.json");
export const aldebaranTeam: AldebaranTeam = importAssets("./config/aldebaranTeam.json");
export const categories: Categories = importAssets("./assets/data/categories.json");
export const drpgXpBases: DRPGXPBases = importAssets("./assets/data/drpg/bases.json");
export const drpgItems: DRPGItemList = importAssets("./assets/data/drpg/itemList.json");
export const drpgLocationdb: DRPGLocationDB = importAssets("./assets/data/drpg/locations.json");
export const imageUrls: ImageURLs = importAssets("./assets/data/imageurls.json");
export const packageFile: PackageFile = importAssets("./package.json");
export const presences: Presences = importAssets("./config/presence.json");

export type OsuMode = keyof typeof Mode;

export type ErrorString = keyof typeof Error;
export type PermissionString = keyof typeof Permissions;
export type CommonSetting = keyof typeof SettingsModel.common;
export type UserSetting = CommonSetting | keyof typeof SettingsModel.user;
export type GuildSetting = CommonSetting | keyof typeof SettingsModel.guild;

export type UserSettings = { [key in UserSetting]?: string };
export type GuildSettings = { [key in GuildSetting]?: string };

export type TargetedSettings = {
	category: string,
	help: string,
	postUpdate?: (value: string, user: User, guild?: Guild) => void,
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

export type Settings = {
	common: { [key in CommonSetting]?: TargetedSettings },
	guild: { [key in GuildSetting]?: TargetedSettings },
	user: { [key in UserSetting]?: TargetedSettings }
};

export const SettingsModel = {
	common: CommonSettingsModel,
	user: {
		...CommonSettingsModel,
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
			help: "Aldebaran's Prefix - [& | Guild Customized]",
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

export type SocialProfileProperty = "aboutMe" | "dmFriendly" | "age" | "gender" | "name" | "country" | "timezone" | "birthday" | "profilePictureLink" | "favoriteGames" | "profileColor" | "favoriteMusic" | "socialLinks" | "zodiacName" | "flavorText";

export type DBUser = {
	userId: Snowflake;
	settings: string;
	permissions?: number;
	timeout?: number;
};

export type DBGuild = {
	guildid: Snowflake;
	settings: string;
	commands: string;
};

type BaseDBProfile = {
	userId: Snowflake;
	fortunePoints: number;
};

export type DBProfile = BaseDBProfile & {
	[key in SocialProfileProperty]?: string
};
