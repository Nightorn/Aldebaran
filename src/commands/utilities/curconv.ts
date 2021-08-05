import request, { Response } from "request";
import { Command, Embed } from "../../groups/UtilitiesCommand.js";
import AldebaranClient from "../../structures/djs/Client.js";
import Message from "../../structures/djs/Message.js";

const fixerURL = "http://data.fixer.io/api";

export default class CurConvCommand extends Command {
	constructor(client: AldebaranClient) {
		super(client, {
			description:
				"Converts from one currency unit to another, or lists currency equalivents",
			example: "USD GBP 10"
		});
	}

	run(_: AldebaranClient, message: Message, args: any) {
		if (args.length < 2) {
			message.channel.error("MISSING_ARGS", "Please use `&?curconv` to see how to use this command!");
		} else if (args.length >= 2) {
			const fromCurrency = args[0];
			const toCurrency = args[1];
			const value = Number(args[2]);
			if (fromCurrency && toCurrency && value) {
				this.convCurToAnotherCur(message, fromCurrency, toCurrency, value);
			} else if (fromCurrency && toCurrency) {
				this.convCurToAnotherCur(message, fromCurrency, toCurrency, 1);
			} else {
				message.channel.error("WRONG_USAGE", "At least one argument is missing or incorrect. Please use `&?curconv` to see how to use this command!");
			}
		}
	}

	convCurToAnotherCur(message: Message, fromCurrency: string, toCurrency: string, value: number) {
		try {
			request(
				`${fixerURL}/latest?access_key=${process.env.API_FIXER}`,
				(err: any, res: Response, body: any) => this.requestCallback(
					err, res, body, message, fromCurrency, toCurrency, value
				)
			);
		} catch (err) {
			throw err;
		}
	}

	doChecks(err: any, data: any, message: Message, fromCurrency: string, toCurrency: string) {
		if (err) {
			throw err;
		} else if (!data.success) {
			if (data.error.code === 104) {
				console.log("We're out of Fixer API requests.");
				message.channel.error("API_RATELIMIT", "Aldebaran has ran out of API requests for Fixer this month. This means you will need to wait another month for &curconv to work. Sorry for the inconvenience!");
				return false;
			}
			console.log(
				`Fixer sent an unsuccessful message. The data is logged.\n${data}`
			);
			message.channel.error("API_ERROR", `Fixer responded with an error. Try again later. Error: ${data.error.type}`);
			return false;
		} else if (!data.rates[fromCurrency] || !data.rates[toCurrency]) {
			if (!data.rates[fromCurrency]) message.channel.error("WRONG_USAGE", `The specified currency, ${fromCurrency}, does not exist.`);
			else if (!data.rates[toCurrency]) message.channel.error("WRONG_USAGE", `The specified currency, ${toCurrency}, does not exist.`);
			return false;
		}
		return true;
	}

	requestCallback(err: any, _: Response, body: any, message: Message, fromCurrency: string, toCurrency: string, value: number) {
		const data = JSON.parse(body);

		if (this.doChecks(err, data, message, fromCurrency, toCurrency)) {
			// EUR is always base. Convert to EUR, then convert to toCurrency.
			const fromCurrencyRate = data.rates[fromCurrency];
			const toCurrencyRate = data.rates[toCurrency];

			// How much in the target currency is this amount of EUR worth?
			const valueInTarget = value / fromCurrencyRate * toCurrencyRate;

			// Rates to each other
			// Find value of 1 target currency in the other currency
			const rate = (1 / fromCurrencyRate) * toCurrencyRate;

			const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
			const getDate = (time: number) => {
				const date = new Date(time);
				return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
			};

			const str = `**${value.toFixed(2)} ${fromCurrency}** is equal to **${valueInTarget.toFixed(2)} ${toCurrency}** as of ${getDate(data.timestamp * 1000)}, with a **${rate.toFixed(2)} rate**.`;

			const embed = new Embed(this)
				.setTitle(`Conversion from ${fromCurrency} to ${toCurrency}`)
				.setDescription(str);
			message.channel.send({ embed });
		}
	}

	registerCheck() {
		return process.env.API_FIXER !== undefined
			&& process.env.API_FIXER !== null;
	}
};
