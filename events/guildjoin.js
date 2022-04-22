const { MessageEmbed } = require("discord.js")
const guildConfig = require("../models/guildConfig")

module.exports = {
    name : "guildCreate",
    async run(client ,  guild1){
        //console.log(guild)
        const GuildConfig = await guildConfig.findOne({guildId : guild1.id})
        //console.log(GuildConfig)
        if(!GuildConfig) {
            const newGuildConfig = new guildConfig({
                guildId : guild1.id
            })

            await newGuildConfig.save()
                .then(() => console.log(`New Guild Config Created for ${guild1.name}`))
                .catch(err => console.log(err))

           // console.log(client.botDevOnly)
            const channelId = client.botDevOnly.get("ownerOnly").channelId
            const guildId = client.botDevOnly.get("ownerOnly").guildId

            const guild = await client.guilds.fetch(guildId)
            if(guild) {
                const channel = await guild.channels.fetch(channelId)
                if(channel) {
                    const owner = await guild1.members.fetch(guild1.ownerId)
                    let members =await  guild1.members.fetch()
                    members = members.filter(m => !m.user.bot).size
                    const totalmembers = guild1.members.cache.size
                    const embed = new MessageEmbed()
                                    .setTitle(`${guild1.name}`)
                                    .setColor("RANDOM")
                                    .setDescription(`Your Bot was added to a new Guild!`)
                                    .addFields(
                                        { name : "Guild Name" , value : `${guild1.name}` , inline : true},
                                        { name : "Guild ID" , value : `${guild1.id}` , inline : true},
                                        { name : "Guild Owner" , value : `${owner ? owner : "Could not be found."}` , inline : true},
                                        { name : "Guild Members" , value : `${totalmembers}` , inline : true},
                                        { name : "Guild Member Count(Not bots)" , value : `${members}` , inline : true},
                                    )

                    channel.send({embeds : [embed]})
                }
            }

            
        }
    }
}