import { BitField } from "discord.js";
import { PermissionString, Permissions } from "../../utils/Constants.js";

export default class AldebaranPermissions extends BitField<PermissionString> {
	FLAGS: any = Permissions;
};
