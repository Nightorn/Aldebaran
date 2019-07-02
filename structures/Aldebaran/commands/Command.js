const CooldownManager = require(`../CooldownManager`);
module.exports = class Command {
  /**
   * Builds the Command object
   * @param {string} command Command Name
   */
  constructor(client, name, commandFile) {
    this.client = client;
    this.commandFile = commandFile;
    this.cooldownManager = new CooldownManager(this);
    this.name = name;
    for (const element in this.commandFile.infos) {
      this[element] = this.commandFile.infos[element];
    }
  }

  log(cooldown, message, args) {
    console.log(
      `User ${message.author.id} (${message.author.tag}) | Command ${
        this.name
      }${args.length === 0 ? "" : ` | Args - ${args}`} | Cooldown : ${
        cooldown ? "GOOD" : `BAD (${cooldown}ms)`
      }`
    );
  }

  check(user) {
    if (this.permissions !== undefined) {
      if (this.permissions.bot !== undefined) {
        if (this.permissions.bot.length > 0) {
          if (user.asBotStaff !== null) {
            if (user.asBotStaff.acknowledgements !== undefined) {
              if (user.asBotStaff.acknowledgements.length > 0) {
                if (user.asBotStaff.acknowledgements.indexOf("ADMIN") !== -1)
                  return true;
                let pass = false;
                for (const acknowledgement of Object.entries(
                  this.permissions.bot
                ))
                  if (
                    user.asBotStaff.acknowledgements.includes(acknowledgement)
                  )
                    pass = true;
                return pass;
              }
            }
          }
        } else return true;
      } else return true;
    } else return true;
    return false;
  }

  /**
   * Executes the Command
   * @param {Client} bot Discord Client
   * @param {Message} message Message Object
   * @param {string[]} args Command Ags
   */
  async execute(bot, message, args) {
    if (this.nsfw && !message.channel.nsfw)
      return message.channel.send(`This command only works in a NSFW channel!`);
    const canPass = this.cooldownManager.canPass(message.author);
    this.log(canPass, message, args);
    if (canPass) {
      if (this.check(message.author)) {
        try {
          await bot.database.commands.create(this.name, args, message);
        } catch (err) {
          await bot.database.commands.create(this.name, "[]", message);
        }
      } else {
        return new Error("Insufficient Bot Permissions");
      }
    } else {
      return new Error("Exceeded Command Cooldown");
    }
    return this.commandFile.run(bot, message, args);
  }
};
