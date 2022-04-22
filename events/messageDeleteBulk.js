const { MessageEmbed } = require("discord.js");
const guildConfig = require("../models/guildConfig");

module.exports = {
    name : "messageDeleteBulk",
    async run(client , messages){
        if(!client.guildConfig.get(messages.first().guild.id)) {
            const result = await guildConfig.findOne({guildId : messages.first().guild.id})
            if(!result){
                const newGuildConfig = new guildConfig({
                    guildId : messages.first().guild.id
                })
                await newGuildConfig.save()
                    .then(() => console.log(`New Guild Config Created for ${messages.first().guild.name}`))
                    .catch(err => console.log(err))

                return;
            }
        }
        if(!client.guildConfig.get(messages.first().guild.id).logging) return;
        if(client.guildConfig.get(messages.first().guild.id).modLog == undefined || client.guildConfig.get(messages.first().guild.id).modLog == null) return;

        const guild = client.guilds.cache.get(messages.first().guild.id);
        if(!guild) return;

        let modLog;
           try{
             modLog = await guild.channels.fetch(client.guildConfig.get(messages.first().guild.id).modLog);
           }

           catch(e){
               //console.log(e)
               return;
           }
           
           modLog.send({embeds : [new MessageEmbed().setTitle("Bulk Message Delete").setColor("#ff0000").setDescription(`** ${messages.size} Messages were deleted in ${messages.first().channel}**`)]});

    }
}