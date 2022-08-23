import { Server as RjsServer } from "revolt.js";
import { DataTypes, Model } from "sequelize";
import ContextServer from "../../interfaces/ContextServer.js";
import { tableConf } from "../../utils/Methods.js";
import Server from "./Server.js";

export default class RevoltServer extends Model implements ContextServer {
	declare public id: string;
	declare public serverId: number;

	declare public base: Server; // inclusion
	declare public server: RjsServer;
	
	get name() {
		return this.server.name;
	}
}

RevoltServer.init({
	id: { type: DataTypes.CHAR(26), primaryKey: true }
}, tableConf("server_revolt"));
