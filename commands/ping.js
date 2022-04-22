const { Permissions } = require("discord.js");

module.exports = {
    name : "ping",
    description : "Shows the Current Ping of the bot",
    slash : true,
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    async execute({client , interaction , message}){
        if(message) return;

        await interaction.deferReply()

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        interaction.editReply({content : `Pong! The current ping is : **${client.ws.ping}ms**\nUptime : **${uptime}**`})
    }
}