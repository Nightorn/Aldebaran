module.exports = class CooldownManager {
    constructor(command) {
        this.client = command.client;
        this._command = command;
        if (command.cooldown !== undefined) {
            this._ = command.cooldown;
            this.generalCooldown = this._.time;
            this.globalRateLimiter();
        } else {
            this.generalCooldown = 0;
        }
        this.users = {};
    }

    globalRateLimiter() {
        if (this._.commandGroup !== undefined) {
            if (this.client.commandGroup[this._.commandGroup] !== undefined) {
                this.client.commandGroup[this._.commandGroup] = this;
            }
        }
        if (this._.rpm !== undefined && this._.resetTime !== undefined) {
            this.rpm = this._.rpm;
            this.resetTime = Date.now() + this._.resetTime;
        }
    }

    resetRpm() {
        if (Date.now() > this.resetTime) {
            this.resetTime = Date.now() + this._.resetTime;
            this.rpm = 0;
        }
    }

    pass() {
        if (this.rpm !== undefined) rpm++;
        return true;
    }

    canPass(user) {
        if (user.generalCooldown + this.client.config.generalCooldown > Date.now()) return false;
        if (this.users[user.id] !== undefined) if (this.users[user.id] + this.generalCooldown > Date.now()) return this.users[user.id] + this.generalCooldown - Date.now();
        if (this._ === undefined ? false : this._.rpm !== undefined && this._.resetTime !== undefined) {
            if (this._.rpm !== 0) {
                if (this.users[user.id] === undefined) {
                    this.users[user.id] = Date.now();
                    return this.pass();
                } else {
                    if (this.users[user.id] + this.generalCooldown > Date.now()) {
                        return this.users[user.id] + this.generalCooldown - Date.now();
                    } else {
                        this.users[user.id] = Date.now();
                        return this.pass();
                    }
                }
            }
        } else return this.pass();
    }
}