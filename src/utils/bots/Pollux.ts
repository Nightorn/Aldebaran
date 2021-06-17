import AldebaranClient from "../../structures/djs/Client";
import Message from "../../structures/djs/Message";
import User from "../../structures/djs/User";

export default (_bot: AldebaranClient, message: Message) => {
	if (message.guild.settings.polluxboxping === "on") {
		if (message.guild.polluxBoxPing.size === 0) {
			for (const [id, member] of message.guild.members.cache) {
				if ((member.user as User).settings.polluxboxping === "on" && member.user.presence.status !== "offline") {
					message.guild.polluxBoxPing.set(id, (member.user as User));
				}
			}
		}
		if (message.content.endsWith("a chance to claim it!") && message.author.id === "271394014358405121") {
			let list = "Come grab my box!\n ";
			for (const [id] of message.guild.polluxBoxPing) {
				list += `<@${id}> `;
			}
			message.channel.send(list);
		}
	}
};
