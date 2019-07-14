const { Client, MessageEmbed } = require("discord.js");

module.exports = class Command {
  /**
   * Command abstract class, extend it to build a command
   * @param {*} client Client
   * @param {object} metadata Command Metadata
   * @param {string} metadata.name Name
   * @param {string} metadata.description Description
   * @param {string} metadata.usage Usage
   * @param {string} metadata.example Example
   * @param {string[]} metadata.aliases Aliases
   * @param {object} metadata.cooldown Cooldown Metadata
   * @param {string} metadata.cooldown.group Group
   * @param {number} metadata.cooldown.amount Amount
   * @param {number} metadata.cooldown.resetInterval Reset Interval
   * @param {object} metadata.perms Required Permissions
   * @param {string[]} metadata.perms.discord Discord required permissions
   * @param {string[]} metadata.perms.aldebaran Aldebaran required permissions
   */
  constructor(client, metadata) {
    if (this.constructor === "Command") {
      throw new TypeError(
        "Command is an abstract class and therefore cannot be instantiated."
      );
    }
    if (!(client instanceof Client))
      throw new TypeError("The specified Client is invalid");
    if (metadata === undefined) throw new TypeError("The metadata are invalid");
    if (metadata.name === undefined || metadata.description === undefined)
      throw new TypeError("The metadata are invalid");
    this.perms = {
      discord: [],
      aldebaran: []
    };
    if (metadata.perms !== undefined) {
      if (metadata.perms.discord !== undefined)
        if (!(metadata.perms.discord instanceof Array))
          throw new TypeError("The Discord permissions metadata are invalid");
        else this.perms.discord = metadata.perms.discord;
      if (metadata.perms.aldebaran !== undefined)
        if (!(metadata.perms.aldebaran instanceof Array))
          throw new TypeError("The Aldebaran permissions metadata are invalid");
        else this.perms.aldebaran = metadata.perms.aldebaran;
    }
    this.aliases = metadata.aliases || [];
    this.category = "General";
    this.cooldown = metadata.cooldown || {
      amount: 1,
      resetInterval: 0
    };
    this.cooldown.fixed = Math.ceil(
      this.cooldown.resetInterval / this.cooldown.amount / 1000
    );
    this.color = "BLUE";
    this.client = client;
    this.example = !metadata.example ? "" : `\`${metadata.example}\``;
    this.hidden = false;
    this.metadata = metadata;
    this.name = metadata.name;
    this.usage = !metadata.usage ? "" : `\`${metadata.usage}\``;
  }

  /**
   * Checks if the context of execution is valid
   * @param {*} message Message
   */
  permsCheck(message) {
    let check = true;
    if (this.perms.discord !== undefined) {
      this.perms.discord.forEach(perm => {
        if (!message.member.permissions.has(perm)) check = false;
      });
    }
    return check;
  }

  check(message) {
    return this.permsCheck(message);
  }

  /**
   * Executes the command
   * @param {} msg Message object
   */
  execute(message) {
    const args = message.content.split(" ");
    args.shift();
    if (this.check(message)) {
      return this.run(this.client, message, args);
    }
    throw new Error("INVALID_PERMISSIONS");
  }

  toHelpEmbed(prefix, command) {
    const embed = new MessageEmbed()
      .setAuthor(
        `Aldebaran  |  Command Help  |  ${this.name}`,
        this.client.user.avatarURL()
      )
      .setDescription(this.metadata.description)
      .addField("Category", this.category, true)
      .addField("Usage", `${prefix}${command} ${this.usage}`, true)
      .addField("Example", `${prefix}${command} ${this.example}`, true)
      .setColor("BLUE");
    if (this.aliases.length > 0)
      embed.addField("Aliases", this.aliases.join(", "), true);
    if (this.cooldown.fixed > 0)
      embed.addField("Cooldown", `${Math.ceil(this.cooldown.fixed)}s`, true);
    if (this.cooldown.group !== undefined)
      embed.addField("CCG", this.cooldown.group, true);
    if (this.args !== undefined) embed.addField("Arguments", this.args, true);
    if (this.perms.discord.length > 0)
      embed.addField("Discord Perms", this.perms.discord.join(", "), true);
    if (this.perms.aldebaran.length > 0)
      embed.addField("Aldebaran Perms", this.perms.aldebaran.join(", "), true);
    return embed;
  }
};
