const Command = require("./Command");

module.exports = class NSFWCommand extends Command {
  constructor(client, metadata) {
    super(client, metadata);
    this.category = "Utilities";
  }
};
