import DiscordGuild from "./DiscordServer.js";
import DiscordUser from "./DiscordUser.js";
import Server from "./Server.js";
import ServerSetting from "./ServerSetting.js";
import RevoltGuild from "./RevoltServer.js";
import RevoltUser from "./RevoltUser.js";
import SocialProfile from "./SocialProfile.js";
import User from "./User.js";
import UserSetting from "./UserSetting.js";

const notNullFk = { foreignKey: { allowNull: false } };
const notNullFkId = { foreignKey: { name: "id", allowNull: false } };
const settingAlias = { as: { plural: "settings", singular: "setting" } };

DiscordGuild.belongsTo(Server, notNullFk);
DiscordUser.belongsTo(User, notNullFk);
Server.hasMany(ServerSetting, settingAlias);
ServerSetting.belongsTo(Server, notNullFk);
RevoltGuild.belongsTo(Server, notNullFk);
RevoltUser.belongsTo(User, notNullFk);
SocialProfile.belongsTo(User, notNullFkId);
User.hasOne(SocialProfile, { as: "profile" });
User.hasMany(UserSetting, settingAlias);
UserSetting.belongsTo(User, notNullFk);
