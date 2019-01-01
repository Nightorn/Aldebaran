exports.run = (bot, message, args) => {
    message.channel.send(`The year 2019 is **${Math.round(1000 * (100 * (Date.now() - 1546300800000) / 31536000000)) / 1000}%** complete.`)
};

exports.infos = {
    category: "Fun",
    description: "Shows the year completion percentage",
    usage: "\`&yearcompletion\`",
    example: "\`&yearcompletion\`"
}