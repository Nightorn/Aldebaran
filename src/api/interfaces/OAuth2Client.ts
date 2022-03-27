export default interface OAuth2Client {
	accessTokenLifetime?: number;
	avatar: string;
	grants: string[];
	id: string;
	name: string;
	redirectUris?: string[];
	refreshTokenLifetime?: number;
};
