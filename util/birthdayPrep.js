const fs = require("fs");
const path = require("path");
const { MessageEmbed } = require("discord.js");
const { BirthdayReminder } = require('../botconfig.js');
// const  client  = require("./index.js");
// const client = require("./structures/DiscordMusicBot.js")

/* 
Remember that everything needs to be passed once, perhaps only on botstart or perhaps we suck it up and loop hourly or something.
ALSO REMEMBER YOU MADE FORMAT CHANGES TO BOTCONFIG THAT SHOULD BE SANITIZED AND COMMITTED AT STORY ENDSTEP
*/

// core control: should get the current date, should loop through server list running a checker function that returns a new object(?) of any matches or false
function birthdayReminderCore() {
    let today = getCurrentDate();
   // BirthdayReminder.forEach();
   console.log("func birthdayReminderCore hit")
   sendEmbedToChannel();
   //setInterval((console.log('int'), 20000))
    
};

function getCurrentDate() {
    let currentDate = new Date();
    //let currentDate = new Date(Date.UTC(initDate.getFullYear(),initDate.getMonth(), initDate.getDate())); // checks for date accuracy
    // note: it returns in UTC for now, but strict equivalency check can be added if it needs to be timezone based
    return currentDate;
};
/**
 * 
 * @param {require("../structures/DiscordMusicBot")} client
 */
// function checkBirthdayReminder() {
    
//     client.log('birthday reminder test')
//     client.guilds.cache.forEach((guild) => {
//     client.log(`Birthday Test Loaded`);
//     client.botconfig.BirthdayReminder.forEach((server) => {
//       if (server.serverID === guild.id) {
//         birthdayReminderCore();
//         this.log(`Birthday Test Loaded ServerID: ${server.serverID}`)
//       }
//     })  
//   });
// };

module.exports = (client) => {
    function checkBirthdayReminder() {
        //const client = this;
        client.log('birthday reminder test')
        client.guilds.cache.forEach((guild) => {
        client.log(`Birthday Test Loaded`);
        client.botconfig.BirthdayReminder.forEach((server) => {
          if (server.serverID === guild.id) {
           // birthdayReminderCore();
            client.log(`Birthday Test Loaded ServerID: ${server.serverID}`)
          }
        })  
      });
    };
  let ClientAPI = client.api.applications(client.user.id);
  checkBirthdayReminder();
};
