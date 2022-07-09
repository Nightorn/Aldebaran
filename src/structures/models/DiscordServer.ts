import { Guild as DjsGuild } from "discord.js";
import { DataTypes, Model } from "sequelize";
import ContextServer from "../../interfaces/ContextServer.js";
import { tableConf } from "../../utils/Methods.js";
import Server from "./Server.js";

export default class DiscordServer extends Model implements ContextServer {
    declare public _id: number;
    declare public snowflake: string;
    declare public serverId: number;

    declare public base: Server; // inclusion
    declare public guild: DjsGuild;
    
    get id() {
        return this.snowflake;
    }

    get name() {
        return this.guild.name;
    }
}

DiscordServer.init({
	_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    },
	snowflake: {
		type: DataTypes.STRING(19),
		allowNull: false,
		unique: true
	}
}, tableConf("server_discord"));
