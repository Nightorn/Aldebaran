import CommandHandler from "../handlers/CommandHandler.js";
import AldebaranClient from "../structures/djs/Client.js";
import Message from "../structures/djs/Message.js";
import executeSocial from "../utils/executeSocial.js";

// Developer
import AdminCommand from "./developer/admin.js";
import DevtodoCommand from "./developer/devtodo.js";
import EvalCommand from "./developer/eval.js";
import QueryCommand from "./developer/query.js";
import RestartCommand from "./developer/restart.js";
import ServerlistCommand from "./developer/serverlist.js";

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
import PurgeCommand from "./general/purge.js";
import RandomphotoCommand from "./general/randomphoto.js";
import SuggestCommand from "./general/suggest.js";
import TimeCommand from "./general/time.js";
import UploadphotoCommand from "./general/uploadphoto.js";
import UserCommand from "./general/user.js";

// Image
import BirbCommand from "./image/birb.js";
import BunnyCommand from "./image/bunny.js";
import CatCommand from "./image/cat.js";
import CuteagCommand from "./image/cuteag.js";
import DogCommand from "./image/dog.js";
import DuckCommand from "./image/duck.js";
import HedgehogCommand from "./image/hedgehog.js";
import LizardCommand from "./image/lizard.js";
import NekoCommand from "./image/neko.js";
import PandaCommand from "./image/panda.js";
import PepeCommand from "./image/pepe.js";
import RandimalCommand from "./image/randimal.js";

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
import { Command as SocialCommand } from "../groups/SocialCommand.js";
import PokeCommand from "./social/poke.js";
import TickleCommand from "./social/tickle.js";

// Utilities
import CurconvCommand from "./utilities/curconv.js";
import MathCommand from "./utilities/math.js";
import TranslateCommand from "./utilities/translate.js";

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
                    args: { user: { as: "user" } }
                });
            }

            run(bot: AldebaranClient, message: Message, args: any) {
                executeSocial(bot, message, args);
            }
        });
    }

    commandHandler.registerMultiple(
        AdminCommand, DevtodoCommand, EvalCommand, QueryCommand, RestartCommand, ServerlistCommand,
        GleadCommand, GoldCommand, PlantCommand, PlantcalcCommand, SkillsCommand, StatsCommand, TrapCommand, UpgradecalcCommand, WallsCommand, WeaponCommand, XpCommand,
        EballCommand, EmojilistCommand, FactCommand, KaomojiCommand, OwoifyCommand, SayCommand, TimecompletionCommand,
        RpsCommand,
        AvatarCommand, BstatsCommand, BugreportCommand, CommandsCommand, CreditsCommand, HelpCommand, InfoCommand, InviteCommand, PingCommand, ProfileCommand, PurgeCommand, RandomphotoCommand, SuggestCommand, TimeCommand, UploadphotoCommand, UserCommand,
        BirbCommand, BunnyCommand, CatCommand, CuteagCommand, DogCommand, DuckCommand, HedgehogCommand, LizardCommand, NekoCommand, PandaCommand, PepeCommand, RandimalCommand,
        LewdCommand, XboobsCommand, XkittyCommand, XlesbianCommand, XnekoCommand, XrandomCommand,
        OsuCommand, OsubestCommand, OsumapCommand, OsurecentCommand,
        EnabledrpgCommand, GconfigCommand, SetprofileCommand, UconfigCommand,
        PokeCommand, TickleCommand,
        CurconvCommand, MathCommand, TranslateCommand
    );
};
