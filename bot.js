const { Structures } = require("discord.js");

const AldebaranClient = require("./structures/Discord/Client");
const User = require("./structures/Discord/User");
const Guild = require("./structures/Discord/Guild");
const Message = require("./structures/Discord/Message");
const Channel = require("./structures/Discord/TextChannel");

// With the contribution of holroy
Number.formatNumber = n => {
  const parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? `.${parts[1]}` : "")
  );
};

Structures.extend("User", BaseUser => {
  return User(BaseUser);
});
Structures.extend("Guild", BaseGuild => {
  return Guild(BaseGuild);
});
Structures.extend("Message", BaseMessage => {
  return Message(BaseMessage);
});
Structures.extend("TextChannel", BaseTextChannel => {
  return Channel(BaseTextChannel);
});

const bot = new AldebaranClient(); // eslint-disable-line no-unused-vars
