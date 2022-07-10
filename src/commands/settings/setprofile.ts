import Command from "../../groups/SettingsCommand.js";
import Client from "../../structures/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const sectionMatches: { [key: string]: string } = {
    profilepicturelink: "profilePictureLink",
    favoritegames: "favoriteGames",
    profilecolor: "profileColor",
    favoritemusic: "favoriteMusic",
    sociallinks: "socialLinks",
    zodiacname: "zodiacName",
    flavortext: "flavorText"
};

export default class SetprofileCommand extends Command {
	constructor(client: Client) {
		super(client, {
			description: "Changes your profile information",
			example: "aboutme My name is Xxx_FortnitePro_xxX!",
			args: {
				section: {
					as: "string",
					desc: "The name of the profile's section you want to edit"
				},
				input: {
					as: "string",
					desc: "What you want to write in the section you just selected"
				}
			}
		});
	}

	async run(ctx: MessageContext) {
		const args = ctx.args as { section: string, input: string };
		
        let profile = await ctx.author.base.getProfile();
        if (!profile) {
            profile = await ctx.author.base.createProfile();
        }

		const section = args.section.toLowerCase();
		const profiletarget = sectionMatches[section] || section;

        profile.set({ [profiletarget]: args.input }).save().then(() => {
			ctx.reply(`Your ${profiletarget} has been updated to \`${args.input}\`.`);
		}).catch(() => {
			const error = this.createEmbed(ctx)
				.setTitle("Unknown Profile Section")
				.setDescription("Please check to ensure this is a correct profile section. If you think the specified profile section was valid, please make sure the value is too.")
				.setColor("RED");
			ctx.reply(error);
		});
		return true;
	}
}
