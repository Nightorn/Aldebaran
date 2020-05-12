const request = require("request");
const { Command, Embed } = require("../../groups/UtilitiesCommand");

const fixerURL = "http://data.fixer.io/api";

module.exports = class CurConvCommand extends Command {
	constructor(client) {
		super(client, {
			description:
				"Converts from one currency unit to another, or lists currency equalivents",
			example: "USD GBP 10"
		});
		this.fromCurrency = "";
		this.toCurrency = "";
		this.value = 0;
		this.message = {};
	}

	run(bot, message, args) {
		this.message = message;
		if (args.length < 2) {
			message.channel.error("MISSING_ARGS", "Please use `&?curconv` to see how to use this command!");
		} else if (args.length === 2) {
			this.convCurToAnotherCur(...args, 1);
		} else if (args.length >= 3) {
			this.convCurToAnotherCur(...args);
		}
	}

	convCurToAnotherCur(fromCurrency, toCurrency, value) {
		this.fromCurrency = fromCurrency.toUpperCase();
		this.toCurrency = toCurrency.toUpperCase();
		this.value = parseInt(value, 10);
		try {
			request(
				`${fixerURL}/latest?access_key=${process.env.API_FIXER}`,
				this.requestCallback.bind(this)
			);
		} catch (err) {
			throw err;
		}
	}

	doChecks(err, data) {
		if (err) {
			throw err;
		} else if (!data.success) {
			if (data.error.code === 104) {
				console.log("We're out of Fixer API requests.");
				this.message.channel.error("API_RATELIMIT", "Aldebaran has ran out of API requests for Fixer this month. This means you will need to wait another month for &curconv to work. Sorry for the inconvenience!");
				return false;
			}
			console.log(
				`Fixer sent an unsuccessful message. The data is logged.\n${data}`
			);
			this.message.channel.error("API_ERROR", `Fixer responded with an error. Try again later. Error: ${data.error.type}`);
			return false;
		} else if (!data.rates[this.fromCurrency] || !data.rates[this.toCurrency]) {
			if (!data.rates[this.fromCurrency]) this.message.channel.error("WRONG_USAGE", `The specified currency, ${this.fromCurrency}, does not exist.`);
			else if (!data.rates[this.toCurrency]) this.message.channel.error("WRONG_USAGE", `The specified currency, ${this.toCurrency}, does not exist.`);
			return false;
		}
		return true;
	}

	requestCallback(err, res, body) {
		const data = JSON.parse(body);

		if (this.doChecks(err, data)) {
			// EUR is always base. Convert to EUR, then convert to toCurrency.
			const fromCurrencyRate = data.rates[this.fromCurrency];
			const toCurrencyRate = data.rates[this.toCurrency];

			// How much in the target currency is this amount of EUR worth?
			const valueInTarget = this.value / fromCurrencyRate * toCurrencyRate;

			// Rates to each other
			// Find value of 1 target currency in the other currency
			const rate = (1 / fromCurrencyRate) * toCurrencyRate;

			const f = number => String(number).length === 1 ? `0${number}` : number;
			const getDate = time => {
				const date = new Date(time);
				return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
			};

			const str = `**${this.value.toFixed(2)} ${this.fromCurrency}** is equal to **${valueInTarget.toFixed(2)} ${this.toCurrency}** as of ${getDate(data.timestamp * 1000)}, with a **${rate.toFixed(2)} rate**.`;

			const embed = new Embed(this)
				.setTitle(`Conversion from ${this.fromCurrency} to ${this.toCurrency}`)
				.setDescription(str);
			this.message.channel.send({ embed });
		}
	}

	registerCheck() {
		return process.env.API_FIXER !== undefined
			&& process.env.API_FIXER !== null;
	}
};
