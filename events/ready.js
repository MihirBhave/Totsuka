const guildConfig = require("../models/guildConfig")

module.exports = {
    name : "ready",
    async run(client) {
        //console.log(client)
         guildConfig.find({})
            .then(async guildConfigs => {
                guildConfigs.map(config => client.guildConfig.set(config.guildId , config))
            })
            .catch((err) => console.log(err))
        //console.log("Set Guild Configs.")
    setInterval(async() => {
         guildConfig.find({})
            .then(async guildConfigs => {
                guildConfigs.map(config => client.guildConfig.set(config.guildId , config))
            })
            .catch((err) => console.log(err))
    
        } , 1000* 60 * 2)

    setInterval(async() => {
        await client.user.setActivity(`${client.guilds.cache.size} servers and ${client.users.cache.size} users. Use /guide!` , {type : "WATCHING"})
    } , 10000)
    client.botDevOnly.set("ownerOnly" , {
    channelId : "962346605774778428",
    guildId : "951847375016689765"
        })

    }
}