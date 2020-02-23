const timezoneSupport = require("./timezoneSupport");

module.exports = {
	common: {
		adventureTimer: {
			support: value => value === "on" || value === "off" || value === "random",
			help: "Adventure Timer (\"random\" for 3s +-) - [on | off | random]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		healthMonitor: {
			support: value => (
				value === "on"
          || value === "off"
          || (parseInt(value, 10) > 0 && parseInt(value, 10) < 100)
			),
			help: "Health Monitor - [on | off | healthPercentage]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		polluxBoxPing: {
			support: value => value === "on" || value === "off",
			help: "Box Ping - [on | off]",
			postUpdateCommon: (value, user, guild) => {
				if (value === "on") guild.polluxBoxPing.set(user.id, user);
				else guild.polluxBoxPing.delete(user.id);
			},
			showOnlyIfBotIsInGuild: "271394014358405121",
			category: "Pollux"
		}
	},
	user: {
		individualHealthMonitor: {
			support: value => ["off", "character", "pet"].indexOf(value) !== -1,
			help:
        "Lets you choose whether you want to display the health of your character or your pet with the health monitor - [off | character | pet]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		sidesTimer: {
			support: value => (
				value === "on"
          || value === "off"
          || value === "mine"
          || value === "forage"
          || value === "chop"
          || value === "fish"
			),
			help: "Sides Timer - [on | off | primaryAction (mine, forage...)]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		timezone: {
			support: timezoneSupport,
			help:
        "Sets your timezone - [GMT, UTC, or [tz database timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)]",
			category: "Aldebaran"
		},
		dateFormat: {
			support: value => (
				value.indexOf("DD") !== -1
          && value.indexOf("MM") !== -1
          && value.indexOf("YYYY") !== -1
			),
			help:
        "Time Format - Use DD (day of month), MM (month number) and YYYY (year)",
			category: "Aldebaran"
		},
		osuUsername: {
			support: () => true,
			help: "osu! default username (for osu! commmands)",
			category: "osu!"
		},
		osuMode: {
			support: () => true,
			help: "osu! default mode (for osu! commmands) [osu | mania | taiko | ctb]",
			category: "osu!"
		}
	},
	guild: {
		autoDelete: {
			support: value => value === "on" || value === "off",
			help: "Auto Delete Sides & Adv Commands - [on | off]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		sidesTimer: {
			support: value => value === "on" || value === "off",
			help: "Sides Timer - [on | off]",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		},
		aldebaranPrefix: {
			support: () => true,
			help: "Aldebaran's Prefix - [& | Guild Customized]",
			postUpdate: (value, guild) => { guild.prefix = value; },
			category: "Aldebaran"
		},
		aldebaran: {
			support: value => value === "on" || value === "off",
			showOnlyIfBotIsInGuild: "2"
		},
		discordrpgPrefix: {
			support: () => true,
			help: "Prefix",
			showOnlyIfBotIsInGuild: "170915625722576896",
			category: "DiscordRPG"
		} /* ,
    language: {
      support: value => {
        return value === "en" || value === "fr";
      },
      help: "Language",
      category: "Aldebaran"
    } */
	}
};
