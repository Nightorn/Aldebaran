import { Sequelize } from "sequelize";

export default class DatabaseProvider {
	private static sequelize: Sequelize;

	public static getInstance() {
		if (!DatabaseProvider.sequelize) {
			if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER
				|| !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE
			) {
				throw new TypeError("The database configuration is invalid");
			}

			this.sequelize = new Sequelize(
				process.env.MYSQL_DATABASE,
				process.env.MYSQL_USER,
				process.env.MYSQL_PASSWORD, {
					host: process.env.MYSQL_HOST,
					dialect: "mariadb",
					define: {
						charset: "utf8mb4",
						collate: "utf8mb4_unicode_ci",
						freezeTableName: true,
						initialAutoIncrement: "10",
						underscored: true
					},
					port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
				}
			);
		}

		return this.sequelize;
	}

	public static authenticate() {
		return new Promise<void>((resolve, reject) => {
			this.sequelize.authenticate().then(() => {
				this.sequelize.sync().then(() => {
					console.log("Successfully logged in to the database!");
					resolve();
				}).catch(err => {
					reject(new Error(`Unable to sync models: ${err}`));
				});
			}).catch(err => {
				reject(new Error(`Unable to connect to the database: ${err}`));
			});
		});
	}
}
