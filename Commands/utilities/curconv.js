const request = require("request");
const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/commands/Command");
const config = require("../../config/config.json");
const ErrorEmbed = require("../../structures/Aldebaran/ErrorEmbed");

const fixerURL = "http://data.fixer.io/api";

module.exports = class CurConvCommand extends Command {
  constructor(client) {
    super(client, {
      name: "curconv",
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
      message.channel.send(
        new ErrorEmbed(message)
          .setTitle("Not enough arguments!")
          .setDescription(
            "Please use `&help curconv` to see how to use this command!"
          )
      );
    } else if (args.length === 2) {
      this.convCurToAnotherCur(...args, 1);
    } else if (args.length >= 3) {
      this.convCurToAnotherCur(...args);
    }
  }

  convCurToAnotherCur(fromCurrency, toCurrency, value) {
    this.fromCurrency = fromCurrency;
    this.toCurrency = toCurrency;
    this.value = parseInt(value, 10);
    try {
      request(
        `${fixerURL}/latest?access_key=${config.apikeys.fixer}`,
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
        this.message.channel.send(
          new ErrorEmbed(this.message)
            .setTitle("Sorry, the API request limit has been reached!")
            .setDescription(
              "Aldebaran has ran out of API requests for Fixer this month. Sorry for the inconvience!"
            )
        );
        return false;
      }
      console.log(
        `Fixer sent an unsuccessful message. The data is logged.\n${data}`
      );
      this.message.channel.send(
        new ErrorEmbed(this.message)
          .setTitle("API Error!")
          .setDescription(
            `Fixer responded with an error. Try again later. Error: ${data.error.type}`
          )
      );
      return false;
    } else if (data.success) {
      if (!data.rates[this.fromCurrency]) {
        this.message.channel.send(
          new ErrorEmbed(this.message)
            .setTitle("Invalid currency")
            .setDescription(`Currency ${this.fromCurrency} does not exist.`)
        );
        return false;
      }
      if (!data.rates[this.toCurrency]) {
        this.message.channel.send(
          new ErrorEmbed(this.message)
            .setTitle("Invalid currency")
            .setDescription(`Currency ${this.toCurrency} does not exist.`)
        );
        return false;
      }
    }
    return true;
  }

  requestCallback(err, res, body) {
    const data = JSON.parse(body);

    if (this.doChecks(err, data)) {
      // EUR is always base. Convert to EUR, then convert to toCurrency.
      const fromCurrencyRate = data.rates[this.fromCurrency];
      const toCurrencyRate = data.rates[this.toCurrency];

      // How much EUR is this value of fromCurrency worth?
      const valueInBase = this.value / fromCurrencyRate;

      // How much in the target currency is this amount of EUR worth?
      const valueInTarget = valueInBase * toCurrencyRate;

      // Rates to each other
      // Find value of 1 target currency in the other currency
      const rate = (1 / fromCurrencyRate) * toCurrencyRate;

      const str = `
**${valueInBase.toFixed(2)} ${
        this.fromCurrency
      }** is equal to **${valueInTarget.toFixed(2)} ${this.toCurrency}**
*as of ${new Date(data.timestamp * 1000).toISOString()}*.
Rate: ${rate.toFixed(2)}
      `;

      this.message.channel.send(
        new MessageEmbed()
          .setFooter(
            this.message.author.username,
            this.message.author.avatarURL()
          )
          .setColor(this.message.member.displayColor)
          .setTitle(
            `Conversion from ${this.fromCurrency} to ${this.toCurrency}`
          )
          .setDescription(str)
      );
    }
  }
};
