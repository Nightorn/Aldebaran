const { Client } = require("discord.js");
const fs = require("fs");
const CDBAHandler = require("../Aldebaran/CDBAHandler");
// const CommandHandler = require("../Aldebaran/CommandHandler.js");
const CommandHandler = require("../commands/Handler");
const DatabasePool = require("../Aldebaran/DatabasePool.js");

module.exports = class AldebaranClient extends Client {
  constructor() {
    super({
      disabledEvents: ["TYPING_START"],
      messageCacheMaxSize: 10,
      messageCacheLifetime: 1800,
      messageSweepInterval: 300
    });
    this.started = Date.now();
    this.CDBA = new CDBAHandler();
    this.commandGroups = {};
    this.commands = new CommandHandler(this);
    // this.commandHandler = new CommandHandler(this);
    this.config = require(`${process.cwd()}/config/config.json`);
    this.config.presence = require("../../config/presence.json");
    this.config.aldebaranTeam = require(`${process.cwd()}/config/aldebaranTeam.json`);
    this.database = new DatabasePool(this);
    this.debugMode = process.argv[2] === "dev";
    this.login(this.debugMode ? this.config.tokendev : this.config.token);
    this.models = {
      settings: require(`${process.cwd()}/functions/checks/configurationModels.js`)
    };
    this.version = require('./../../package.json').version;
    if (process.argv[3] !== undefined && this.debugMode) this.config.prefix = process.argv[3];
    for (const [key, value] of Object.entries(this.models.settings.common)) {
      this.models.settings.user[key] = value;
      this.models.settings.guild[key] = value;
    }
    if (!fs.existsSync(`./cache/`)) fs.mkdirSync(`./cache/`);

    this.databaseCounts = {
      users: new Map(),
      profiles: new Map(),
      guilds: new Map()
    };
    const usersDatabaseData = new Map();
    const profilesDatabaseData = new Map();
    const guildsDatabaseData = new Map();
    let usersDatabaseSize = null;
    let profilesDatabaseSize = null;
    let guildsDatabaseSize = null;
    this.database.users.selectAll().then(users => {
      for (const data of users) {
        const id = data.userId;
        delete data.userId;
        usersDatabaseData.set(id, data);
      }
      this.database.socialprofile.selectAll().then(profiles => {
        for (const data of profiles) {
          const id = data.userId;
          delete data.userId;
          profilesDatabaseData.set(id, data);
        }
        this.database.guilds.selectAll().then(guilds => {
          for (const data of guilds) {
            const id = data.guildid;
            delete data.guildid;
            guildsDatabaseData.set(id, data);
          }
          this.database
            .query("SELECT COUNT(DISTINCT userId) FROM users")
            .then(count => {
              this.databaseCounts.users = count[0]["COUNT(DISTINCT userId)"];
              this.database
                .query("SELECT COUNT(*) FROM socialprofile")
                .then(count => {
                  this.databaseCounts.profiles = count[0]["COUNT(*)"];
                  this.database
                    .query("SELECT COUNT(DISTINCT guildid) FROM guilds")
                    .then(count => {
                      this.databaseCounts.guilds = count[0]["COUNT(DISTINCT guildid)"];
                      this.buildDatabaseFetch({
                        counts: {
                          ...this.databaseCounts
                        },
                        data: {
                          users: usersDatabaseData,
                          profiles: profilesDatabaseData,
                          guilds: guildsDatabaseData
                        }
                      });
                    });
                });
            });
        });
      });
    });

    fs.readdir("./events/", (err, files) => {
      if (err) throw console.error(err);
      files.forEach(file => {
        const eventFunction = require(`${process.cwd()}/events/${file}`);
        const eventName = file.split(".")[0];
        this.on(eventName, (...args) => eventFunction.run(this, ...args));
      });
    });
  }

  buildDatabaseFetch(data) {
    this.databaseFetch = data;
    console.log(`\x1b[36m# Ready. Took ${Date.now() - this.started}ms.\x1b[0m`);
  }
}