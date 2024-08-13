const fs = require("fs"); //rm
const path = require("path"); //rm
const { MessageEmbed } = require("discord.js");
const { BirthdayReminder } = require("../botconfig.js");
const stringinject = require("stringinject").default;

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
      client.log("passing immediately to birthdayLoop");
    } else {
      nextDate.setHours(nextDate.getHours() + 1);
      nextDate.setMinutes(0);
      nextDate.setSeconds(0);
      let diff = nextDate - new Date();
      setTimeout(loopHandler, diff);
      client.log(`Delayed by ${diff} ms`);
    }
  }

  function loopHandler() {
    let hour = 3600000;
    setInterval(checkServers, hour);
    client.log(`Setting Loop For An Hour`);
  }

  function checkServers() {
    let now = new Date();
    client.log(`checking servers`);
    client.botconfig.BirthdayReminder.forEach((server) => {
      let hourCheck = now.getHours();
      if (hourCheck == server.alertHour) {
        client.log(`Birthday Test Ran ServerID: ${server.serverID}`);
        checkBirthdays(server, now);
      }
    });
  }

  function checkBirthdays(server, now) {
    let formattedCurrentDate = formatDate(now);
    let formattedWeekOut = aWeekBefore(now);
    if (server.enabled === true) {
      server.listOfUsers.forEach((user) => {
        if (user.userBirthday === formattedWeekOut) {
          let excludeBirthdayUser = user.userID;
          sendWeekOutDM(server, user, excludeBirthdayUser);
        }
        if (user.userBirthday === formattedCurrentDate) {
          sendDayOfMessage(server, user);
        }
      });
    }
  }

  function aWeekBefore(today) {
    let oneWeekAgo = today;
    oneWeekAgo.setDate(oneWeekAgo.getDate() + 7);
    let formattedWeekBefore = formatDate(oneWeekAgo);
    return formattedWeekBefore;
  }

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
      client.users.fetch(user.userID, false).then((thisUser) => {
        let updatedMessage = stringinject(server.birthdayMessage, [
          thisUser.username,
          user.userBirthday,
        ]);
        birthdayChannelEmbed.setAuthor(`Birthday Reminder`);
        birthdayChannelEmbed.setColor(client.botconfig.EmbedColor);
        birthdayChannelEmbed.setDescription(`${updatedMessage}`);
        return channel.send(birthdayChannelEmbed);
      });
    });
  }

  function sendWeekOutDM(server, user, excludeBirthdayUser) {
    client.channels.fetch(server.targetChannelID, false).then((channel) => {
      let channelMembers = channel.members;
      client.users.fetch(user.userID, false).then((thisUser) => {
        channelMembers.forEach((member) => {
          // only sends to active members in text channel, will want to switch to role?
          if (
            member.id !== excludeBirthdayUser &&
            member.id !== client.botconfig.ClientID
          ) {
            client.users.fetch(member.id, false).then((thisMember) => {
              let newMessage = stringinject(server.reminderMessage, [
                thisUser.username,
                user.userBirthday,
              ]);
              thisMember.send(newMessage);
            });
          } else {
            return;
          }
        });
      });
    });
  }

  let ClientAPI = client.api.applications(client.user.id);
  birthdayReminderCore();
};
