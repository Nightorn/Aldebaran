import { Request } from "express";
import User from "./user/User.js";
import { socialprofile as fetchProfile } from "../utils/fetchDBValue.js";

export default class SocialProfile {
	ID: string;

	constructor(id: string) {
		this.ID = id;
	}

	/**
	 * Returns the title the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async aboutMe(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "aboutMe");
	}

	/**
	 * Returns the age the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async age(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "age");
	}

	/**
	 * Returns the birthday the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async birthday(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "birthday");
	}

	/**
	 * Returns the color the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async color(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "profileColor");
	}

	/**
	 * Returns the country the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async country(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "country");
	}

	/**
	 * Returns whether the profile's owner is DM friendly or not (as they defined it).
	 * @param {*} request Request object
	 * @returns {Promise<bool>}
	 */
	async dmFriendly(_: object, request: Request) {
		return await fetchProfile(request.app.db, this.ID, "dmFriendly") === "on";
	}

	/**
	 * Returns the description the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async flavorText(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "flavorText");
	}

	/**
	 * Returns the gender the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async gender(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "gender");
	}

	/**
	 * Returns the favorite games the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async favoriteGames(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "favoriteGames");
	}

	/**
	 * Returns the favorite music the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async favoriteMusic(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "favoriteMusic");
	}

	/**
	 * Returns the hobbies the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async hobbies(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "hobbies");
	}

	/**
	 * Returns the ID of the current profile's owner.
	 * @returns {string}
	 */
	id() {
		return this.ID;
	}

	/**
	 * Returns the name the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async name(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "name");
	}

	/**
	 * Returns the profile picture's link the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async profilePicture(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "profilePictureLink");
	}

	/**
	 * Returns the social links the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async socialLinks(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "socialLinks");
	}

	/**
	 * Returns the timezone the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async timezone(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "timezone");
	}

	/**
	 * Returns the profile's owner.
	 */
	user() {
		return new User(this.ID);
	}

	/**
	 * Returns the zodiac sign the profile's owner has defined.
	 * @param {*} request Request object
	 * @returns {Promise<string>}
	 */
	async zodiacSign(_: object, request: Request) {
		return fetchProfile(request.app.db, this.ID, "zodiacName");
	}
}
