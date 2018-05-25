exports.run = (client, message) => {
  //Pollux Lootbox Watcher
    if (message.author.id == `` ){
      console.log(message.content)
      if(message.content.endsWith(`a chance to claim it!`)) {
        message.channel.send(`Come Grab My Box <@310296184436817930> <@384996823556685824> <@266632489546678273>`)
      }

    };
  //DRPG Health Watcher? 7th or 8th Depending on Crit Line for health No EMBEDS  
    if (message.author.id == 170915625722576896){
      var test = message.content.split(`\n`)
      if(test[1] == undefined || test[0] == undefined || test == undefined) return;
      console.log(test[1])
      console.log(test[2])
      console.log(test[3])
      console.log(test[4])
      console.log(test[5])
      console.log(test[6])
      console.log(test[7])
      console.log(test[8])
      console.log(test[9])
      if (test[10] != undefined) console.log(test[10]);
      if (test[11] != undefined) console.log(test[11]);
      if (test[12] != undefined) console.log(test[12]);
      var healthraw = 1
      if (test[3] == `+ Critical hit!`) {
        healthraw = test[9]
      };
      if (test[3] != `+ Critical hit!`) {
        healthraw = test[8]
      };
      var editedhealth = healthraw.split(` `)[3]
      message.channel.send(`Current Health ${editedhealth}`)
      
      ///if (test[0].startsWith(`!`)){
      ///  console.log(test)
      ///};
      ///message.channel.send(`Null`)
    };

  }//11 lines with reward no crit
   ///12 lines with reward crit
   ///9 lines with no reward no crit
   ///10 lines with no reward and crit