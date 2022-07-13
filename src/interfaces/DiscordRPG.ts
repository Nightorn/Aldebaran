type FormulaData = {
	amount: { max: string, min: string },
	chance: number,
	minlevel: number,
	xp: {
		regular: { max: string, min: string },
		skill: { max: string, min: string }
	}
};

type LootData = {
	amount: { max: string; min: string },
	id: string,
	mintime: number
};

export type Attribute = "crits" | "defense" | "goldBoost" | "lumberBoost" | "mineBoost" | "reaping" | "salvaging" | "scavenge" | "strength" | "taming" | "xpBoost";
export type Skill = "mine" | "chop" | "forage" | "fish";
export type Stat = "luck" | "strength" | "defense" | "charisma";

export type Guild = {
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

export type Potion = {
	boost?: { [key in Attribute | Stat]?: string },
	effects?: { [key in Attribute | Stat]?: number },
	heal?: number,
	last?: number,
	temp?: boolean,
	time?: number
};

export type Sapling = { loot: LootData, minlevel: number };

export type Trap = { loot: LootData[], minlevel: number };

export type Weapon = {
	dmg: { max: number, min: number },
	type?: string // "dagger"
};

export type Item = {
	attributes: { [key in Attribute]?: number },
	cost: number,
	def?: number,
	desc: string,
	donate?: boolean,
	fish?: FormulaData,
	foragedata?: FormulaData,
	id: string,
	image?: string,
	itemBoost?: number,
	level: number,
	name: string,
	ore?: FormulaData,
	plural: string,
	potion?: Potion,
	prefix: string,
	price?: number,
	ring?: {
		attribute?: Attribute,
		boost: number,
		stat?: Stat
	},
	sapling?: Sapling,
	sell: number | string,
	sellable: boolean,
	skillLevel?: number,
	test?: number,
	toolData?: { catchChance: number },
	toolType?: string, // "pickaxe" | "axe"
	tradable: boolean,
	trap?: Trap,
	type: "potion" | "weapon" | "dummy" | "effectpotion" | "chest" | "boots" | "helm" | "ore" | "tool" | "necklace",
	untradable?: boolean,
	weapon?: Weapon
};

export type User = {
	achievementEmbed: number,
	achievements: string[],
	adventureEmbed: number,
	attributes: { [key in Attribute]: number },
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
	skills: { [key in Skill]: { level: number, xp: number } },
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

export type XPBases = { [key: string]: number };
export type ItemList = { [key: string]: Item };
export type LocationDB = { [key: string]: string };
