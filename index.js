require("dotenv").config();
const fs = require("fs");
const ytdl = require("ytdl-core");
const { Client, Collection } = require("discord.js");

const token = process.env.DISCORD_TOKEN;
const prefix = "!";

const client = new Client();
const queue = new Map();

//commands
const play = require("./commands/play");
const skip = require("./commands/skip");
const stop = require("./commands/stop");

async function execute(message, serverQueue) {
    try {
        const args = message.content.split(" ");
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send("Bạn phải tham gia kênh music 😘");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("Bạn không đủ quyền 😒");
    }
    const songInfo = await ytdl.getInfo(args[1]);
    if (!songInfo) return message.channel.send(`Không có bài này :v`);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queue, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`Thêm nhạc ${song.title} 🤞🤞🤞`);
    }
    } catch (error) {
        return message.channel.send(`Commands error 😒`);
    }
}

client.on("message", async (message) => {
    const serverQueue = queue.get(message.guild.id);
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.split(" ");
    const command = args.shift();
    if (command.startsWith(prefix)) {
        switch (command) {
            case `${prefix}play`: {
                execute(message, serverQueue);
                return;
            }
            case `${prefix}skip`: {
                skip(message, serverQueue);
                return;
            }
            case `${prefix}stop`: {
                stop(message, serverQueue);
                return;
            }
            default: {
                await message.reply("éo có lệnh này 😉");
                break;
            }
        }
    }
});

client.once("ready", () => {
    console.log(`🏃‍♀️ ${client.user.tag} is online! 💨`);
});

client.once("reconnecting", () => {
    console.log("🔗 Reconnecting!");
});

client.once("disconnect", () => {
    console.log("🛑 Disconnect!");
});

client.login(token);
