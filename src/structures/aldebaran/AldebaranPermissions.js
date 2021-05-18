const { BitField } = require("discord.js");
const permissions = require("../../../assets/data/aldebaranPermissions.json");

class AldebaranPermissions extends BitField {}

AldebaranPermissions.FLAGS = permissions;

module.exports = AldebaranPermissions;
