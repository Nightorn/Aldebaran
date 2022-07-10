import DiscordGuild from "./DiscordServer.js";
import DiscordUser from "./DiscordUser.js";
import Server from "./Server.js";
import ServerSetting from "./ServerSetting.js";
import RevoltGuild from "./RevoltServer.js";
import RevoltUser from "./RevoltUser.js";
import Profile from "./Profile.js";
import User from "./User.js";
import UserSetting from "./UserSetting.js";

const notNullFk = { foreignKey: { allowNull: false } };
const settingAlias = { as: { plural: "settings", singular: "setting" } };

DiscordGuild.belongsTo(Server, notNullFk);
DiscordUser.belongsTo(User, notNullFk);
Server.hasMany(ServerSetting, settingAlias);
ServerSetting.belongsTo(Server, notNullFk);
RevoltGuild.belongsTo(Server, notNullFk);
RevoltUser.belongsTo(User, notNullFk);
Profile.belongsTo(User, notNullFk);
User.hasOne(Profile);
User.hasMany(UserSetting, settingAlias);
UserSetting.belongsTo(User, notNullFk);
