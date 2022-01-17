const stop = (message, serverQueue) => {
    if (!message.member.voice.channel)
        return message.channel.send("Bạn phải tham gia kênh music để stop :v");
    if (!serverQueue)
        return message.channel.send("Làm gì còn bài nào mà stop :v");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
module.exports = stop;