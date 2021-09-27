/* eslint-disable max-len */
import { ShardingManager } from "discord.js";
import OAuth2Server from "oauth2-server";
import GenericDatabaseProvider from "./handlers/GenericDatabaseProvider";

declare module "express-serve-static-core" {
	export interface Application {
		db: GenericDatabaseProvider,
		dsm: ShardingManager,
		oauth: OAuth2Server
	}
}

declare module "tenorjs";
