const Command = require("./Command");

module.exports = class OsuCommand extends Command {
  constructor(client, metadata) {
    super(client, {
      ...metadata,
      cooldown: {
        group: "osu",
        amount: 60,
        resetInterval: 60000
      }
    });
    this.category = "osu!";
    this.color = "#ff66aa";
  }
};
