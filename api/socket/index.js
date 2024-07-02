const { Server } = require("socket.io");
const prettyMilliseconds = require("pretty-ms");

/**
 * @param {Server} io
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    //Bot's Main Page
    socket.on("dashboard", () => {
      if (socket.Dashboard) clearInterval(socket.Dashboard);
      socket.Dashboard = setInterval(() => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        socket.emit("dashboard", {
          commands: Client.CommandsRan,
          users: Client.users.cache.size,
          guilds: Client.guilds.cache.size,
          songs: Client.SongsPlayed,
        });
      }, 1000);
    });

    socket.on("removeLast", (ServerID) => {
      const Client = require("../../index");
      if (!Client.Ready) return;
      let Guild = Client.guilds.cache.get(ServerID);
      if (!Guild) return socket.emit("error", "Unable to find that server");
      let player = Client.Manager.get(Guild.id);
      if (!player) {
        return socket.emit("error", "No player exists");
      } else {
        player.queue.pop();
      }
    })

    socket.on("skipCurrent", (ServerID) => {
      const Client = require("../../index");
      if (!Client.Ready) return;
      let Guild = Client.guilds.cache.get(ServerID);
      if (!Guild) return socket.emit("error", "Unable to find that server");
      let player = Client.Manager.get(Guild.id);
      if (!player) {
        return socket.emit("error", "No player exists");
      } else {
        player.stop();
      }
    })

    socket.on("removeQueueIndex", (ServerID, index) => {
      const Client = require("../../index");
      if (!Client.Ready) return;
      let Guild = Client.guilds.cache.get(ServerID);
      if (!Guild) return socket.emit("error", "Unable to find that server");
      let player = Client.Manager.get(Guild.id);
      if (!player) {
        return socket.emit("error", "No player exists");
      } else {
        player.queue.remove(index);
      }
    })

    socket.on("manualAddSong", async (ServerID, query) => {
      const Client = require("../../index");
      if (!Client.Ready) return;
      let Guild = Client.guilds.cache.get(ServerID);
      if (!Guild) return socket.emit("error", "Unable to find that server");
      let player = Client.Manager.get(Guild.id);
      if (!player) {
        return socket.emit("error", "No player exists");
      } else {
        let defaultRequester = {
          id: "180530253112803328",
          system: null,
          locale: null,
          flags: 0,
          username: "moaratorium",
          bot: false,
          discriminator: "0",
          avatar: "28adafa05b805a818ee829ba3a37a6c9",
          lastMessageChannelID: null,
          createdTimestamp: 1463112166432,
          defaultAvatarURL: "https://cdn.discordapp.com/embed/avatars/0.png",
          tag: "moaratorium#0",
          avatarURL:
            "https://cdn.discordapp.com/avatars/180530253112803328/28adafa05b805a818ee829ba3a37a6c9.webp",
          displayAvatarURL:
            "https://cdn.discordapp.com/avatars/180530253112803328/28adafa05b805a818ee829ba3a37a6c9.webp",
        };
        let searched = await player.search(query, defaultRequester); // table requires requester, need a way to hook in a "owner" from bot setup
        player.queue.add(searched.tracks[0]); //adds first, need a check for no queue and potentially a url check
        console.log(searched);
      } 
    })


    socket.on("reorderQueue", async (ServerID, queueFromDash) => {
      const Client = require("../../index");
      if (!Client.Ready) return;
      let Guild = Client.guilds.cache.get(ServerID);
      if (!Guild) return socket.emit("error", "Unable to find that server");
      let player = Client.Manager.get(Guild.id);
      if (!player) {
        return socket.emit("error", "No player exists");
      } else {
        for (let i = 0; i <= player.queue.length; i++) {
          player.queue.remove()
          if (player.queue.length > 0){
            player.queue.remove()
          }
        }
        for (let i = 0; i < queueFromDash.length; i++) {
          let searched = await player.search(queueFromDash[i].uri, queueFromDash[i].requester);
          player.queue.add(searched.tracks);
        }
      } 
    })

    socket.on("server", (ServerID) => {
      if (socket.Server) clearInterval(socket.Server);
      socket.Server = setInterval(async () => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        let Guild = Client.guilds.cache.get(ServerID);
        if (!Guild) return socket.emit("error", "Unable to find that server");
        let GuildDB = await Client.GetGuild(Guild.id);
        let player = Client.Manager.get(Guild.id);
        if (!player) {
          socket.emit("server", {
            queue: 0,
            songsLoop: "Disabled",
            queueLoop: "Disabled",
            prefix: GuildDB ? GuildDB.prefix : Client.botconfig.DefaultPrefix,
          });
        } else {
          socket.emit("server", {
            queue: player.queue ? player.queue.length : 0,
            songsLoop: player.trackRepeat ? "Enabled" : "Disabled",
            queueLoop: player.queueRepeat ? "Enabled" : "Disabled",
            prefix: GuildDB ? GuildDB.prefix : Client.botconfig.DefaultPrefix,
            bar: player.queue.current
              ? Client.ProgressBar(
                  player.position,
                  player.queue.current.duration,
                  20
                ).Bar
              : false,
            maxDuration: player.queue.current
              ? prettyMilliseconds(player.queue.current.duration, {
                  colonNotation: true,
                })
              : false,
            position: player.queue.current
              ? prettyMilliseconds(player.position, { colonNotation: true })
              : false,
            nowPlaying: player.queue.current ? player.queue.current : false,
            queueDetails: player.queue ? player.queue : null,
          });
        }
      }, 5000);
    });
  });
};
