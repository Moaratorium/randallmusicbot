const fs = require("fs"); //rm
const path = require("path"); //rm
const { MessageEmbed } = require("discord.js");
const { BirthdayReminder } = require('../botconfig.js');

//REMEMBER YOU MADE FORMAT CHANGES TO BOTCONFIG THAT SHOULD BE SANITIZED AND COMMITTED AT STORY ENDSTEP
// TEST TEST TEST




module.exports = (client) => {
/**
 * 
 * @param {require("../structures/DiscordMusicBot")} client
 */
function birthdayReminderCore() {
  client.log(`Birthday Reminder Loaded`);
  let nextDate = new Date();
  if (nextDate.getMinutes() === 0) {
    loopHandler();
    console.log('passing immediately to birthdayLoop');
  } else {
    // console.log('needs to delay before loop')
    // nextDate.setHours(nextDate.getHours() + 1);
    // nextDate.setMinutes(0);
    // nextDate.setSeconds(0);
    // let diff = nextDate - new Date();
    // setTimeout(loopHandler, diff)
    // console.log(`delayed by ${diff}`)
    loopHandler();
    console.log('test loop sent')
  }
};

function loopHandler() {
  let hour = 3600000;
  let hourlyLoop = setInterval(checkServers, 10000);
  client.log(`Setting Loop For An Hour`)
}

function checkServers() {
  let now = new Date();
  client.log(`checking servers`)
  client.botconfig.BirthdayReminder.forEach((server) => {
    client.log(`Birthday Test Ran ServerID: ${server.serverID}`)
    checkBirthdays(server, now);
  });
}

function checkBirthdays(server, now) {
  let formattedCurrentDate = formatDate(now);
  let formattedWeekOut = aWeekBefore(now);
  if (server.enabled === true) {
      server.listOfUserIDs.forEach((user) => {
        //if (user.userBirthday === formattedWeekOut){
          let excludeBirthdayUser = "180530253112803328" // user.userID;
          sendWeekOutDM(server, user, excludeBirthdayUser);
        //}
        //if (user.userBirthday === formattedCurrentDate) {
          sendDayOfMessage(server, user);
        //}
        // return;
      });

  } 
  // return;
}

function aWeekBefore(today) {
  let oneWeekAgo = today;
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  let formattedWeekBefore = formatDate(oneWeekAgo);
  return formattedWeekBefore;
};

function formatDate(date) {
  let fixIndex = 1;
  let day = date.getDate();
  let month = date.getMonth() + fixIndex;
  let formatMonth = month.toString().padStart(2, "0"); // pads out days and months to make single digit days/months into mm/dd format
  let formatDay = day.toString().padStart(2, "0");
  let formattedDate = formatMonth + "/" + formatDay;
  return formattedDate;
}

function sendDayOfMessage(server, user) {
  client.channels.fetch(server.targetChannelID).then((channel) => {
    let birthdayChannelEmbed = new MessageEmbed();
    //let bdayCakeEmoji = client.emojis.find(emoji => emoji.name === "birthday");
          birthdayChannelEmbed.setAuthor(
            `Birthday Reminder`
          );
          birthdayChannelEmbed.setColor(client.botconfig.EmbedColor);
          birthdayChannelEmbed.setDescription(
            `${server.birthdayMessage}`,
            );
            return channel.send(birthdayChannelEmbed);
    });
}; 

function sendWeekOutDM(server, thisUser, excludeBirthdayUser) {
  let channel = client.channels.fetch(server.targetChannelID, false).then((channel) => {
    console.log(channel);
    let channelMembers = channel.members;
    console.log(channelMembers)
    channelMembers.forEach((member) => {
      console.log(member);
      if (member.id !== excludeBirthdayUser && member.id !== "1207468658427961416") {
        client.users.fetch("200444515633332226", false).then((thisMember) => {
          // thisMember.send(server.weekOutReminder);
          // console.log(member.id)
          let message = "this is a test message";
            const messageUser = "180530253112803328";
            client.users.fetch(messageUser, false).then((user) => {
              user.send(message);
            })
          console.log('asdasd')
        });
      } else {
        console.log('passing over iain')
        return;
      }
    })
    console.log('test')
  });
};

let ClientAPI = client.api.applications(client.user.id);
birthdayReminderCore();
};
