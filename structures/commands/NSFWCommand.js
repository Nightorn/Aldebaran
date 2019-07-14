const Command = require("./Command");

module.exports = class NSFWCommand extends Command {
  constructor(client, metadata) {
    super(client, metadata);
    this.category = "NSFW";
    this.hidden = true;
  }

  execute(message) {
    if (!message.channel.nsfw) throw new Error("NOT_NSFW_CHANNEL");
    super.execute(message);
  }
};
