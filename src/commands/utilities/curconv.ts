import request, { Response } from "request";
import { Command, Embed } from "../../groups/UtilitiesCommand.js";
import { ICommand } from "../../interfaces/Command.js";
import AldebaranClient from "../../structures/djs/Client.js";
import MessageContext from "../../structures/contexts/MessageContext.js";

const fixerURL = "http://data.fixer.io/api";

type Currency = "AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYR" | "BYN" | "BZD" | "CAD" | "CDF" | "CHF" | "CLF" | "CLP" | "CNY" | "COP" | "CRC" | "CUC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "FKP" | "GBP" | "GEL" | "GGP" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "IMP" | "INR" | "IQD" | "IRR" | "ISK" | "JEP" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KPW" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LTL" | "LVL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRO" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLL" | "SOS" | "SRD" | "STD" | "SVC" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "UYU" | "UZS" | "VEF" | "VND" | "VUV" | "WST" | "XAF" | "XAG" | "XAU" | "XCD" | "XDR" | "XOF" | "XPF" | "YER" | "ZAR" | "ZMK" | "ZMW" | "ZWL";
type ExpectedResponse = {
	error: { code: number, type: string },
	rates: { [key in Currency]?: number }
	success: object,
	timestamp: number
};

export default class CurConvCommand extends Command implements ICommand {
	constructor(client: AldebaranClient) {
		super(client, {
			description:
				"Converts from one currency unit to another, or lists currency equalivents",
			example: "USD GBP 10",
			args: {
				from: { as: "string", desc: "The currency you want to convert from" },
				to: { as: "string", desc: "The currency you want to convert to" },
				amount: {
					as: "number",
					desc: "The amount you want to convert",
					optional: true
				}
			}
		});
	}

	run(ctx: MessageContext) {
		const args = ctx.args as { from: Currency, to: Currency, amount: number };
		this.convCurToAnotherCur(ctx, args.from, args.to, args.amount || 1);
	}

	convCurToAnotherCur(
		ctx: MessageContext,
		fromCurrency: Currency,
		toCurrency: Currency,
		value: number
	) {
		request(
			`${fixerURL}/latest?access_key=${process.env.API_FIXER}`,
			(err: Error, res: Response, body: string) => this
				.requestCallback(
					err,
					res,
					body,
					ctx,
					fromCurrency,
					toCurrency,
					value
				)
		);
	}

	// eslint-disable-next-line class-methods-use-this
	doChecks(
		err: Error,
		data: ExpectedResponse,
		ctx: MessageContext,
		fromCurrency: Currency,
		toCurrency: Currency
	) {
		if (err) {
			throw err;
		} else if (!data.success) {
			if (data.error.code === 104) {
				console.log("We're out of Fixer API requests.");
				ctx.error("API_RATELIMIT", `${ctx.client.name} has ran out of API requests for Fixer this month. This means you will need to wait another month for ${ctx.prefix}curconv to work. Sorry for the inconvenience!`);
				return false;
			}
			console.log(
				`Fixer sent an unsuccessful message. The data is logged.\n${data}`
			);
			ctx.error("API_ERROR", `Fixer responded with an error. Try again later. Error: ${data.error.type}`);
			return false;
		} else if (!data.rates[fromCurrency] || !data.rates[toCurrency]) {
			if (!data.rates[fromCurrency]) ctx.error("WRONG_USAGE", `The specified currency, ${fromCurrency}, does not exist.`);
			else if (!data.rates[toCurrency]) ctx.error("WRONG_USAGE", `The specified currency, ${toCurrency}, does not exist.`);
			return false;
		}
		return true;
	}

	requestCallback(
		err: Error,
		_: Response,
		body: string,
		ctx: MessageContext,
		fromCurrency: Currency,
		toCurrency: Currency,
		value: number
	) {
		const data: ExpectedResponse = JSON.parse(body);

		if (this.doChecks(err, data, ctx, fromCurrency, toCurrency)) {
			// EUR is always base. Convert to EUR, then convert to toCurrency.
			const fromCurrencyRate = data.rates[fromCurrency];
			const toCurrencyRate = data.rates[toCurrency];

			// How much in the target currency is this amount of EUR worth?
			const valueInTarget = value / fromCurrencyRate! * toCurrencyRate!;

			// Rates to each other
			// Find value of 1 target currency in the other currency
			const rate = (1 / fromCurrencyRate!) * toCurrencyRate!;

			const f = (number: number) => String(number).length === 1 ? `0${number}` : number;
			const getDate = (time: number) => {
				const date = new Date(time);
				return `**${f(date.getMonth() + 1)}/${f(date.getDate())}/${f(date.getFullYear())}** at **${f(date.getHours())}:${f(date.getMinutes())}** UTC`;
			};

			const str = `**${value.toFixed(2)} ${fromCurrency}** is equal to **${valueInTarget.toFixed(2)} ${toCurrency}** as of ${getDate(data.timestamp * 1000)}, with a **${rate.toFixed(2)} rate**.`;

			const embed = new Embed(this)
				.setTitle(`Conversion from ${fromCurrency} to ${toCurrency}`)
				.setDescription(str);
			ctx.reply(embed);
		}
	}
};
