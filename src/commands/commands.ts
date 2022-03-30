import CommandHandler from "../handlers/CommandHandler.js";
import DiscordMessageContext from "../structures/contexts/DiscordMessageContext.js";
import AldebaranClient from "../structures/djs/Client.js";
import { Platform } from "../utils/Constants.js";
import executeSocial from "../utils/executeSocial.js";

// Developer
import AdminCommand from "./developer/admin.js";

// DiscordRPG
import GleadCommand from "./drpg/glead.js";
import GoldCommand from "./drpg/gold.js";
import PlantCommand from "./drpg/plant.js";
import PlantcalcCommand from "./drpg/plantcalc.js";
import SkillsCommand from "./drpg/skills.js";
import StatsCommand from "./drpg/stats.js";
import TrapCommand from "./drpg/trap.js";
import UpgradecalcCommand from "./drpg/upgradecalc.js";
import WallsCommand from "./drpg/walls.js";
import WeaponCommand from "./drpg/weapon.js";
import XpCommand from "./drpg/xp.js";

// Fun
import EballCommand from "./fun/8ball.js";
import EmojilistCommand from "./fun/emojilist.js";
import FactCommand from "./fun/fact.js";
import KaomojiCommand from "./fun/kaomoji.js";
import OwoifyCommand from "./fun/owoify.js";
import SayCommand from "./fun/say.js";
import TimecompletionCommand from "./fun/timecompletion.js";

// Games
import RpsCommand from "./games/rps.js";

// General
import AvatarCommand from "./general/avatar.js";
import BstatsCommand from "./general/bstats.js";
import BugreportCommand from "./general/bugreport.js";
import CommandsCommand from "./general/commands.js";
import CreditsCommand from "./general/credits.js";
import HelpCommand from "./general/help.js";
import InfoCommand from "./general/info.js";
import InviteCommand from "./general/invite.js";
import PingCommand from "./general/ping.js";
import ProfileCommand from "./general/profile.js";
import SuggestCommand from "./general/suggest.js";
import TimeCommand from "./general/time.js";
import UserCommand from "./general/user.js";

// Image
import BirbCommand from "./image/birb.js";
import BunnyCommand from "./image/bunny.js";
import CatCommand from "./image/cat.js";
import DogCommand from "./image/dog.js";
import DuckCommand from "./image/duck.js";
import HedgehogCommand from "./image/hedgehog.js";
import LizardCommand from "./image/lizard.js";
import NekoCommand from "./image/neko.js";
import PandaCommand from "./image/panda.js";
import PepeCommand from "./image/pepe.js";
import RandimalCommand from "./image/randimal.js";
import RCGPCommand from "./image/rcgp.js";

// NSFW
import LewdCommand from "./nsfw/lewd.js";
import XboobsCommand from "./nsfw/xboobs.js";
import XkittyCommand from "./nsfw/xkitty.js";
import XlesbianCommand from "./nsfw/xlesbian.js";
import XnekoCommand from "./nsfw/xneko.js";
import XrandomCommand from "./nsfw/xrandom.js";

// osu!
import OsuCommand from "./osu!/osu.js";
import OsubestCommand from "./osu!/osubest.js";
import OsumapCommand from "./osu!/osumap.js";
import OsurecentCommand from "./osu!/osurecent.js";

// Settings
import EnabledrpgCommand from "./settings/enabledrpg.js";
import GconfigCommand from "./settings/gconfig.js";
import SetprofileCommand from "./settings/setprofile.js";
import UconfigCommand from "./settings/uconfig.js";

// Social
import SocialCommand from "../groups/SocialCommand.js";
import PokeCommand from "./social/poke.js";
import TickleCommand from "./social/tickle.js";

// Utilities
import CurconvCommand from "./utilities/curconv.js";
import MathCommand from "./utilities/math.js";

export default () => {
	const commandHandler = CommandHandler.getInstance();

	const socialCommands = {
		adorable: "Show how adorable you think someone is!",
		bite: "Go ahead, bite someone!",
		cpr: "Perform CPR on someone!",
		cuddle: "Feeling cuddly? Use this!",
		escape: "Use for a quick escape.",
		feed: "Feed your friends! They look hungry...",
		hug: "Send warm hugs!",
		kidnap: "Kidnap your friends!",
		kiss: "Kiss someone!",
		lick: "Lick your friends!",
		mindblown: "Show how everyone your mind was blown!",
		rub: "Softly rub someone!",
		slap: "Slap that deserving someone!",
		spank: "Spank someone!",
		tackle: "Tackle someone!"
	};
	for (const [name, description] of Object.entries(socialCommands)) {
		commandHandler.register(class Command extends SocialCommand {
			constructor(client: AldebaranClient) {
				super(client, {
					name,
					description,
					args: { user: {
						as: "user",
						desc: "The user you want to socialize with",
						optional: true
					} },
					platforms: ["DISCORD"]
				});
			}

			// eslint-disable-next-line class-methods-use-this
			run(ctx: DiscordMessageContext) {
				executeSocial(ctx);
			}
		});
	}

	commandHandler.register(
		AdminCommand,
		EballCommand,
		EmojilistCommand,
		FactCommand,
		KaomojiCommand,
		OwoifyCommand,
		SayCommand,
		TimecompletionCommand,
		RpsCommand,
		AvatarCommand,
		BstatsCommand,
		CommandsCommand,
		CreditsCommand,
		HelpCommand,
		InfoCommand,
		InviteCommand,
		PingCommand,
		ProfileCommand,
		TimeCommand,
		UserCommand,
		BirbCommand,
		DogCommand,
		LizardCommand,
		NekoCommand,
		PandaCommand,
		RCGPCommand,
		LewdCommand,
		XboobsCommand,
		XkittyCommand,
		XlesbianCommand,
		XnekoCommand,
		XrandomCommand,
		EnabledrpgCommand,
		GconfigCommand,
		SetprofileCommand,
		UconfigCommand,
		PokeCommand,
		TickleCommand,
		MathCommand
	);

	if (process.env.WEBHOOK_SUGGESTIONS_ID &&
		process.env.WEBHOOK_SUGGESTIONS_TOKEN) {
		commandHandler.register(SuggestCommand);
	}

	if (process.env.WEBHOOK_BUGREPORTS_ID &&
		process.env.WEBHOOK_BUGREPORTS_TOKEN) {
		commandHandler.register(BugreportCommand);
	}

	if (process.env.API_DISCORDRPG) {
		commandHandler.register(
			GleadCommand,
			GoldCommand,
			PlantCommand,
			PlantcalcCommand,
			SkillsCommand,
			StatsCommand,
			TrapCommand,
			UpgradecalcCommand,
			WallsCommand,
			WeaponCommand,
			XpCommand
		);
	}

	if (process.env.API_PEXELS) {
		commandHandler.register(
			BunnyCommand,
			DuckCommand,
			RandimalCommand,
			HedgehogCommand
		);
	}

	if (process.env.API_CATAPI) {
		commandHandler.register(CatCommand);
	}

	if (process.env.API_TENOR) {
		commandHandler.register(PepeCommand);
	}

	if (commandHandler.client.nodesu) {
		commandHandler.register(
			OsuCommand,
			OsubestCommand,
			OsumapCommand,
			OsurecentCommand
		);
	}

	if (process.env.API_FIXER) {
		commandHandler.register(CurconvCommand);
	}
};
