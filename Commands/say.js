exports.run = (client, message, args) => {
   const sayMessage = args.join(" ");
   message.delete().catch(O_o=>{});
   message.channel.send({embed:{
        author:{
        name: client.user.username,
        icon_url: client.user.avatarURL
        },
        title: (sayMessage),
        timestamp: new Date()
    
    }}
)};