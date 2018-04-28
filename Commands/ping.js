exports.run = (client, message, args) => {
    message.reply(`
That only took me ${Math.round(client.ping)}ms !`);
};