const Command = require('./Command');
const DeveloperCommand = require("./DeveloperCommand")
const fs = require('fs');

const NSFWDeniedEmbed = {
    title: ":underage: Tsk tsk tsk!",
    description: "This command only works in an NSFW channel!",
    color: 0xff0000
};

module.exports = class CommandManager {
    constructor() {
        this.commands = [];
    }
    /**
     * Lifted from Command to here. Finds the command in the FS and requries it.
     * @function
     * @param {string} command
     */
    findCommand (command) {
        //the values from the file
        const values = {}
        var files = fs.readdirSync('./Commands/');
        if (files.indexOf(`${command}.js`) !== -1) {
            for (let [key, value] of Object.entries(require(`./../Commands/${command}`))) values[key] = value;
        } else {
            for (let fileName of files) {
                if (fs.statSync(`./Commands/${fileName}`).isDirectory()) {
                    files = fs.readdirSync(`./Commands/${fileName}/`);
                    if (files.indexOf(`${command}.js`) != -1) for (let [key, value] of Object.entries(require(`./../Commands/${fileName}/${command}`))) values[key] = value;
                }
            }
        }
        if (values.infos === undefined) throw new RangeError('Unknown Command');
        return values;
    }

    /**
     * Checks if the cooldown of the user is finished. If setCooldown is true, put the cooldown back.
     * @param {string} userId ID of the Discord User
     * @param {Boolean} execute Executes the command or no (resets the cooldown)
     * @param {Command} command Command
     * @param {String[]} args Command Arguments if execute is true
     */
    execute(userId, execute, command, client, message, ...args) {
        const commandFile = this.findCommand(command);
        let executer;
        if (commandFile.developer) {
            executer = new DeveloperCommand(command, commandFile);
        }
        else {
            executer = new Command(command, commandFile);
        }

        if (this[userId] === undefined) this[userId] = {};
        if (this[userId].generalCooldown === undefined) this[userId].generalCooldown = Date.now() - 500;
        const info = executer.getInfo();
        const isNSFW = info.nsfw;
        const commandGroup = info.cooldown === undefined ? executer.name : info.cooldown.commandGroup === undefined ? executer.name : info.cooldown.commandGroup;
        const gogogo = function(_class) {
            if (_class[userId].generalCooldown - Date.now() <= -500) {
                _class[userId].generalCooldown = Date.now();
                if (execute) {
                    if ((isNSFW && message.channel.nsfw) || !isNSFW) {
                        executer.execute(client, message, ...args);
                    }
                    else {message.channel.send({embed: NSFWDeniedEmbed})}
                }
                return true;
            } else return false;
        }
        if (executer !== undefined) {
            if (info.cooldown === undefined) { 
                return gogogo(this)
                
            }
            /*if (command.infos.cooldown.resetTime === undefined) {
                if (this[userId][commandGroup] === undefined) this[userId][commandGroup] = {
                    cooldown: Date.now() + command.infos.cooldown.time
                };
            } else {
                */if (this[userId][commandGroup] === undefined) this[userId][commandGroup] = {
                    cooldown: Date.now() - info.cooldown.time,
                    resetTime: Date.now() - info.cooldown.resetTime,
                    rpm: info.cooldown.rpm--
                };
            //}
            if (this[userId][commandGroup].cooldown - Date.now() <= -info.cooldown.time) {
                /*if (this[userId][commandGroup].resetTime !== undefined) {
                    if (this[userId][commandGroup].resetTime - Date.now <= -command.infos.cooldown.resetTime) this[userId][commandGroup].rpm = command.infos.cooldown.rpm--;
                    if (this[userId][commandGroup].rpm > 0) {
                        this[userId][commandGroup].cooldown = Date.now();
                        this[userId][commandGroup].rpm--;
                        console.log(this);
                        return gogogo(this);
                    }
                } else {*/
                    return gogogo(this);
                //};
            }
        } else {
            return gogogo(this);
        }
    }
}