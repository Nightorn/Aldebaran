const mysql = require('mysql');
module.exports = class DatabasePool {
    /**
     * Returns a MySQL pool connection to the Aldebaran's database
     */
    constructor(client) {
        this._pool = mysql.createPool(client.config.mysql);
        this.users = {
            /**
             * Returns the data of the user specified from the database
             * @param {string} id Snowflake ID of the Discord User
             * @param {string[]} columns Columns to retrieve in the returned data
             */
            selectOneById: async (id, columns) => {
                const check = this.checkSelectOneById(id, columns); if (check instanceof RangeError) return check;
                return (await this.query(`SELECT ${columns !== undefined ? columns.join(', ') : '*'} FROM users WHERE userId='${id}'`))[0];
            },
            /**
             * Updates the data of the user specified on the database
             * @param {string} id Snowflake ID of the Discord User
             * @param {Map} changes Changes to make to the user, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
             */
            updateOneById: async (id, changes) => {
                const updates = this.convertChangesMapToString(changes);
                return await this.query(`UPDATE users SET ${updates.join(', ')} WHERE userId='${id}'`);
            },
            /**
             * Deletes the data of the user specified on the database
             * @param {string} id Snowflake ID of the Discord User
             */
            deleteOneById: async (id) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`DELETE FROM users WHERE userId='${id}'`);
            },
            /**
             * Inserts a user in the database
             * @param {string} id Snowflake ID of the Discord User
             */
            createOneById: async (id) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`INSERT INTO users (userId, settings) VALUES ('${id}', '{}')`);
            }
        };
        this.guilds = {
            /**
             * Returns the data of the guild specified from the database
             * @param {string} id Snowflake ID of the Discord Guild
             * @param {string[]} columns Columns to retrieve in the returned data
             */
            selectOneById: async (id, columns) => {
                const check = this.checkSelectOneById(id, columns); if (check instanceof RangeError) return check;
                return (await this.query(`SELECT ${columns !== undefined ? columns.join(', ') : '*'} FROM guilds WHERE guildid='${id}'`))[0];
            },
            /**
             * Updates the data of the guild specified on the database
             * @param {string} id Snowflake ID of the Discord Guild
             * @param {Map} changes Changes to make to the guild, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
             */
            updateOneById: async (id, changes) => {
                const updates = this.convertChangesMapToString(changes);
                return await this.query(`UPDATE guilds SET ${updates.join(', ')} WHERE guildid='${id}'`);
            },
            /**
             * Deletes the data of the guild specified on the database
             * @param {string} id Snowflake ID of the Discord Guild
             */
            deleteOneById: async (id) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`DELETE FROM guilds WHERE guildid='${id}'`);
            },
            /**
             * Inserts a guild in the database
             * @param {string} id Snowflake ID of the Discord Guild
             */
            createOneById: async (id) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`INSERT INTO guilds (guildid, settings) VALUES ('${id}', '{}')`);
            }
        };
        this.socialprofile = {
            /**
             * Returns the data of the profile specified from the database
             * @param {string} id Snowflake ID of the Discord User
             * @param {string[]} columns Columns to retrieve in the returned data
             */
            selectOneById: async (id, columns) => {
                const check = this.checkSelectOneById(id, columns); if (check instanceof RangeError) return check;
                return (await this.query(`SELECT ${columns !== undefined ? columns.join(', ') : '*'} FROM socialprofile WHERE userId='${id}'`))[0];
            },
            /**
             * Updates the data of the profile specified on the database
             * @param {string} id Snowflake ID of the Discord User
             * @param {Map} changes Changes to make to the profile, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
             */
            updateOneById: async (id, changes) => {
                const updates = this.convertChangesMapToString(changes);
                return await this.query(`UPDATE socialprofile SET ${updates.join(', ')} WHERE userId='${id}'`);
            },
            /**
             * Deletes the data of the profile specified on the database
             * @param {string} id Snowflake ID of the Discord User
             */
            deleteOneById: async (id) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`DELETE FROM socialprofile WHERE userId='${id}'`);
            },
            /**
             * Inserts a profile in the database
             * @param {string} id Snowflake ID of the Discord User
             */
            createOneById: async (id) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`INSERT INTO socialprofile (userId) VALUES ('${id}')`);
            }
        };
        this.photogallery = {
            /**
             * Returns the data of the photo specified from the database
             * @param {string} id ID of the photo
             * @param {string[]} columns Columns to retrieve in the returned data
             */
            selectOneById: async (id, columns) => {
                return (await this.query(`SELECT ${columns !== undefined ? columns.join(', ') : '*'} FROM photogallery WHERE id='${id}'`))[0];
            },
            /**
             * Returns a random photo from the database
             * @param {boolean} nsfw Return NSFW Content
             * @param {string[]} columns Columns to retrieve in the returned data
             * @param {number} limit Number of photos to return
             */
            selectRandom: async (nsfw, columns = [], limit = 1) => {
                return await this.query(`SELECT ${columns.length > 0 ? columns.join(', ') : '*'} FROM photogallery WHERE nsfw=${nsfw ? 1 : 0} ORDER BY RAND() LIMIT ${limit}`);
            },
            /**
             * Updates the data of the photo specified on the database
             * @param {string} id ID of the photo
             * @param {Map} changes Changes to make to the photo, the map needs an entry for each column modified, with the column as the key, and the new value as the entry value
             */
            updateById: async (id, changes) => {
                const updates = this.convertChangesMapToString(changes);
                return await this.query(`UPDATE photogallery SET ${updates.join(', ')} WHERE id='${id}'`);
            },
            /**
             * Deletes the data of the photo specified on the database
             * @param {string} id ID of the photo
             */
            deleteById: async (id) => {
                return await this.query(`DELETE FROM photogallery WHERE id='${id}'`);
            },
            /**
             * Inserts a photo in the database
             * @param {string} id Snowflake ID of the Discord Guild
             * @param {string} link URL of the Image
             * @param {string} linkname Title of the Image
             * @param {string[]} tags Tags of the Image
             * @param {boolean} nsfw NSFW Content
             */
            create: async (id, link, linkname, tags, nsfw) => {
                const check = this.checkId(id); if (check instanceof RangeError) return check;
                return await this.query(`INSERT INTO photogallery (userId, links, linkname, tags, nsfw) VALUES ('${id}', '${link}', '${linkname}', '${tags}', ${nsfw})`);
            }
        }
    }

    /**
     * Performs a query to the database and returns the parsed MySQL result
     * @param {string} query 
     */
    query(query) {
        return new Promise((resolve, reject) => {
            this._pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(query, function(err, result) {
                        connection.release();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            });
        });
    }

    checkId(id) {
        if (typeof id !== 'string') return new RangeError(`The id specified is not a string.`);
    }

    checkSelectOneById(id, columns) {
        return this.checkId(id);
        if (!columns instanceof Array) return new RangeError('The columns property is not an Array object.');
    }

    checkUpdateOneById(id, changes) {
        return this.checkId(id);
        if (typeof id !== 'string') return new RangeError(`The id specified is not a string.`);
        if (!changes instanceof Map) return new RangeError('The changes property is not a Map object.');
        if (changes.size === 0) return new RangeError('You need to specify at least one change to be done.');
    }

    convertChangesMapToString(changes) {
        var updates = []; for (let [key, value] of changes) updates.push(`${key}=${typeof value === 'number' ? value : `'${value}'`}`);
        return updates;
    }
}