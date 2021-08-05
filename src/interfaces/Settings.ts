export default interface Settings {
	[key: string]: string | number | undefined;
	individualHealthMonitor?: string;
	osumode?: string;
	sidestimer?: string;
	timezone?: string;
};
