export interface Arg {
	as: string,
	desc: string,
	flag: {
		short: string,
		long: string
	},
	regex: RegExp
}

export interface Args {
	[key: string]: Arg;
}
