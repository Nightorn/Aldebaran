export interface Arg {
	as: "boolean" | "expression" | "mode" | "number" | "user" | "word",
	desc?: string,
	flag?: {
		short?: string,
		long?: string
	},
	optional?: boolean,
	regex?: RegExp
}

export interface Args {
	[key: string]: Arg;
}
