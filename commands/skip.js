const skip = (message, serverQueue) => {
    if (!message.member.voice.channel)
        return message.channel.send("Bạn phải tham gia kênh music để skip :v");
    if (!serverQueue)
        return message.channel.send("Làm gì còn bài nào mà skip :v");
    serverQueue.connection.dispatcher.end();
};
module.exports = skip;
