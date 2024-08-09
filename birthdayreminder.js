const { client, MessageEmbed } = require("discord.js");
const { BirthdayReminder } = require('./botconfig.js');
// const { client } = require("./structures/DiscordMusicBot");

/* 
Remember that everything needs to be passed once, perhaps only on botstart or perhaps we suck it up and loop hourly or something.
ALSO REMEMBER YOU MADE FORMAT CHANGES TO BOTCONFIG THAT SHOULD BE SANITIZED AND COMMITTED AT STORY ENDSTEP
*/




function sendDayOfMessage(serverIndex, birthDate, userID) {
    let birthdayChannelEmbed = new MessageEmbed();
    // let bdayCakeEmoji = Client.emojis.find(emoji => emoji.name === "birthday");
    // need to declare relevant server in botconfig programmatically, probably called in this function
            birthdayChannelEmbed.setAuthor(
              `Birthday Reminder`, // backtick jquery-esque method to place variable bday message
              bdayCakeEmoji
            );
            birthdayChannelEmbed.setColor(client.botconfig.EmbedColor);
            birthdayChannelEmbed.setDescription(
              `${BirthdayReminder[serverIndex].birthdayMessage.text}`
            );
            return interaction.send(birthdayChannelEmbed);
}; 

function sendEmbedToChannel() {
    // let bdayCakeEmoji = client.emojis.find(emoji => emoji.name === "birthday"
    // );
    let channel = client.channels.cache.get("1207461053949284395"); // MT general
    console.log('started')
    channel.send({embeds: [startUpEmbed]});
    BirthdayReminder.forEach((server) => {
        if (server.enabled === true) {
            let channel = server.targetChannelID;
            let startUpEmbed = new MessageEmbed();
            startUpEmbed.setAuthor(
                `Birthday Reminder`
            );
            startUpEmbed.setColor(Client.botconfig.EmbedColor);
            startUpEmbed.setDescription(
                `Birthday Reminder is now active!`
            );
            channel.send({embeds: [ startUpEmbed ]});
        }
    })
};

function intervalConversion(time) { 
    let minute = 60000;
    let hour = minute * 60;
    let timeArray = time.split(':');
    let minuteInt = parseInt(timeArray[1]);
    let hourInt = parseInt(timeArray[0]);
    let convertedToInterval = (minuteInt * minute) + (hourInt * hour);
    return convertedToInterval;
};

 function getCurrentDate() {
    let currentDate = new Date();
    //let currentDate = new Date(Date.UTC(initDate.getFullYear(),initDate.getMonth(), initDate.getDate())); // checks for date accuracy
    // note: it returns in UTC for now, but strict equivalency check can be added if it needs to be timezone based
    return currentDate;
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

function checkBirthdays(server, today) {
    //processes config object here
    if (server.enabled === true) {
        let formatCurrentDate = formatDate(today);
        let userList = server.listOfUserIDs;
        userList.forEach((user) => {
            // check for user.userBirthday to equal formatCurrentDate
            // maybe have a external boolean that we can toggle true if a match
            // then we can loop again and print to a new object? need to make sure it happens at right time and i don't want to orphan an object everytime it checks
        })

    } 
    return;

}

// core control: should get the current date, should loop through server list running a checker function that returns a new object(?) of any matches or false
 function birthdayReminderCore() {
    let today = getCurrentDate();
   // BirthdayReminder.forEach();
   console.log("func birthdayReminderCore hit")
   sendEmbedToChannel();
    
};
 


module.exports = { birthdayReminderCore, formatDate, getCurrentDate, checkBirthdays, intervalConversion }