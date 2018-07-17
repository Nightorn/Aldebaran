const Command = require('./Command');
module.exports = class CooldownManager {
    constructor() {
        
    }

    /**
     * Checks if the cooldown of the user is finished. If setCooldown is true, put the cooldown back.
     * @param {string} userId ID of the Discord User
     * @param {Boolean} execute Executes the command or no (resets the cooldown)
     * @param {Command} command Command
     * @param {String[]} args Command Arguments if execute is true
     */
    execute(userId, execute, command, ...args) {
        if (this[userId] === undefined) this[userId] = {};
        if (this[userId].generalCooldown === undefined) this[userId].generalCooldown = Date.now() - 500;
        const commandGroup = command.cooldown === undefined ? command.name : command.cooldown.commandGroup === undefined ? command.name : command.cooldown.commandGroup;
        const gogogo = function(_class) {
            if (_class[userId].generalCooldown - Date.now() <= -500) {
                _class[userId].generalCooldown = Date.now();
                if (execute) command.execute(...args);
                return true;
            } else return false;
        }
        if (command !== undefined) {
            if (command.infos.cooldown === undefined) return gogogo(this);
            if (command.infos.cooldown.resetTime === undefined) {
                if (this[userId][commandGroup] === undefined) this[userId][commandGroup] = {
                    cooldown: Date.now() + command.infos.cooldown.time
                };
            } else {
                if (this[userId][commandGroup] === undefined) this[userId][commandGroup] = {
                    cooldown: Date.now() - command.infos.cooldown.time,
                    resetTime: Date.now() - command.infos.cooldown.resetTime,
                    rpm: command.infos.cooldown.rpm--
                };
            }
            if (this[userId][commandGroup].cooldown - Date.now() <= -command.infos.cooldown.time) {
                if (this[userId][commandGroup].resetTime !== undefined) {
                    if (this[userId][commandGroup].resetTime - Date.now <= -command.infos.cooldown.resetTime) this[userId][commandGroup].rpm = command.infos.cooldown.rpm--;
                    if (this[userId][commandGroup].rpm > 0) {
                        this[userId][commandGroup].cooldown = Date.now();
                        this[userId][commandGroup].rpm--;
                        console.log(this);
                        return gogogo(this);
                    }
                } else {
                    return gogogo(this);
                };
            }
        } else {
            return gogogo(this);
        }
    }
}