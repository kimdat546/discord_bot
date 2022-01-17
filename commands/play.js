const ytdl = require("ytdl-core");

const play = (guild, queue, song) => {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.textChannel.send(`Hết nhạc đi về 😎`)
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url,{filter: "audioonly",fmt: "mp3",opusEncoded: true,encoderArgs: ['-af', 'bass=g=10']}))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, queue, serverQueue.songs[0]);
        })
        .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Lên nhạc: **${song.title}** 🤞🤞🤞`);
};

module.exports = play;
