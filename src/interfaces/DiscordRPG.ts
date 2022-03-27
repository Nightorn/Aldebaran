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

export type DRPGAttribute = "crits" | "defense" | "goldBoost" | "lumberBoost" | "mineBoost" | "reaping" | "salvaging" | "scavenge" | "strength" | "taming" | "xpBoost";
export type DRPGSkill = "mine" | "chop" | "forage" | "fish";
export type DRPGStat = "luck" | "strength" | "defense" | "charisma";

export type DRPGGuild = {
	ad: { lasttime: number, messageid: string },
	allies: string[],
	blacklist: string[],
	channel: string,
	customIcon: { enabled: boolean, url: string },
	deaths: number,
	desc: string,
	elder: string[],
	gold: number,
	icon: string,
	icons: string[],
	id: string,
	inv: { [key: string]: number | null },
	invites: string[],
	items: null[] | string[] | number[], // no sample data
	level: number,
	levelreq: number,
	max: number,
	members: string[],
	name: string,
	open: boolean,
	owner: string,
	permissions: {
		member: number,
		elder: number,
		"[userID]": number
	},
	role: string,
	slain: number,
	tag: string,
	uinv: { [key: string]: number | null }
};

export type DRPGItem = {
	attributes: { [key in DRPGAttribute]?: number },
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
		boost?: { [key in DRPGAttribute | DRPGStat]?: string },
		effects?: { [key in DRPGAttribute | DRPGStat]?: number },
		heal?: number,
		last?: number,
		temp?: boolean,
		time?: number
	},
	prefix: string,
	price?: number,
	ring?: {
		attribute?: DRPGAttribute,
		boost: number,
		stat?: DRPGStat
	},
	sapling?: { loot: DRPGLootData, minlevel: number },
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

export type DRPGUser = {
	achievementEmbed: number,
	achievements: string[],
	adventureEmbed: number,
	attributes: { [key in DRPGAttribute]: number },
	boots: string,
	card: boolean,
	chest: string,
	deaths: number,
	display: number,
	donate: boolean,
	gold: number,
	guild: string,
	helm: string,
	hp: number,
	id: string,
	inv: { [key: string]: number | null },
	itemEmbed: number,
	kills: number,
	lastheal: number,
	lastplant: string,
	lastseen: number,
	lasttrap: string,
	level: number,
	location: {
		current: string,
		fieldsOwned: { [key: string]: boolean },
		saplings: { [key: string]: { id: string, time: number } },
		traps: { [key: string]: { id: string, time: number } },
		travel: { since: string, to: string }
	},
	lux: number,
	maxhp: number,
	membership: { activated: number, expires: number },
	name: string,
	necklace: string,
	nick: number,
	nsReset: boolean,
	party: string,
	pet: {
		damage: { min: number, max: number },
		display: number,
		displayColor: number,
		hasDied: true,
		hp: number,
		image: string,
		level: number,
		maxhp: number,
		name: string,
		type: string,
		xp: number,
		xprate: number
	},
	playerkills: number,
	points: number,
	potion: object, // no sample data
	pvp: boolean,
	quest: {
		completed: null[] | string[],
		current: null | { name: string, stage: number }
	},
	questPoints: number,
	ring: string,
	sapling: { id: string, time: number },
	skills: { [key in DRPGSkill]: { level: number, xp: number } },
	tool: {
		axe: string,
		fishingRod: string,
		pickaxe: string
	},
	tradeEmbed: number,
	trap: { id: string, time: number },
	weapon: string,
	xp: number
};

export type DRPGXPBases = { [key: string]: number };
export type DRPGItemList = { [key: string]: DRPGItem };
export type DRPGLocationDB = { [key: string]: string };
