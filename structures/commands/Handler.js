const fs = require("fs");
const Command = require("../../structures/commands/Command");

module.exports = class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.registerAllCommands();
  }

  execute(command, message) {
    if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
    return this.commands.get(command).execute(message);
  }

  static createArgs(message) {
    const args = message.content.split(" ");
    args.shift();
    return args;
  }

  bypassRun(command, message) {
    if (!message.author.checkPerms("ADMIN"))
      throw new Error("UNALLOWED_ADMIN_BYPASS");
    if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
    const args = [this.client, message, this.constructor.createArgs(message)];
    return this.commands.get(command).run(...args);
  }

  exists(command) {
    return this.commands.get(command) !== undefined;
  }

  getHelp(prefix, command) {
    if (!this.exists(command)) throw new TypeError("INVALID_COMMAND");
    return this.commands.get(command).toHelpEmbed(prefix, command);
  }

  register(Structure) {
    const command = new Structure(this.client);
    this.commands.set(command.name, command);
    command.aliases.forEach(alias => {
      this.commands.set(alias, command);
    });
  }

  registerAllCommands() {
    const commands = new Map();
    const exploreFolder = path => {
      const files = fs.readdirSync(path);
      for (const file of files) {
        if (fs.statSync(path + file).isDirectory()) {
          exploreFolder(`${path}${file}/`);
        } else {
          try {
            let command = require(`../../${path + file}`)
            if (typeof command === "object") {
              const meta = {
                description: "This is an auto-generated help message.",
                name: file.replace(/\.js$/, "")
              };
              Object.assign(meta, command.infos);
              class fakeClass extends Command {
                constructor(client) {
                  super(client, meta);
                }
              }
              fakeClass.prototype.run = command.run;
              command = fakeClass;
              console.log(`${meta.name} needs to be converted to a class, but will still run in the meantime.`);
            }
            // eslint-disable-next-line
            this.register(command);
          } catch (err) {
            console.error(
              `\x1b[31m${path +
                file} is invalid and incompatible with Aldebaran 1.7.\x1b[0m`
            );
          }
        }
      }
    };
    exploreFolder(`Commands/`);
    return commands;
  }
};
