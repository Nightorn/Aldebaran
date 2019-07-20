const SocialProfile = require("../Aldebaran/SocialProfile.js");

module.exports = BaseUser => {
  return class User extends BaseUser {
    constructor(client, data) {
      super(client, data);
      this.asBotStaff = this.client.config.aldebaranTeam[this.id] || null;
      this.banned = false;
      this.existsInDB = false;
      this.generalCooldown = 0;
      this.profile = new SocialProfile(this);
      this.settings = {};
      const interval = setInterval(() => {
        if (this.client.databaseFetch !== undefined) {
          if (
            this.client.databaseFetch.data.users.size ===
            this.client.databaseFetch.counts.users
          ) {
            clearInterval(interval);
            if (
              this.client.databaseFetch.data.users.get(this.id) !== undefined
            ) {
              this.build(this.client.databaseFetch.data.users.get(this.id));
            }
          }
        }
      }, 100);
      this.timers = {
        adventure: null,
        padventure: null,
        sides: null,
        travel: null
      };
    }

    build(data) {
      for (const [key, value] of Object.entries(data)) this[key] = value;
      this.settings = JSON.parse(this.settings);
      this.existsInDB = true;
    }

    checkPerms(perm) {
      if (this.asBotStaff === null) return false;
      if (this.asBotStaff.acknowledgements.includes("ADMIN")) return true;
      if (perm === "MODERATOR")
        return this.asBotStaff.acknowledgements.includes("MODERATOR");
      return false;
    }

    async create() {
      this.existsInDB = true;
      return this.client.database.users.createOneById(this.id);
    }

    async clear() {
      this.existsInDB = false;
      this.settings = {};
      return this.client.database.users.deleteOneById(this.id);
    }

    async changeSetting(property, value) {
      if (!this.existsInDB) {
        this.create().then(() => {
          this.settings[property] = value;
          return this.client.database.users.updateOneById(
            this.id,
            new Map([["settings", JSON.stringify(this.settings)]])
          );
        });
      }
    }
  };
};
