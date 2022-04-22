const warnModel = require('../models/warnModel');
const guildConfig = require('../models/guildConfig');
const inviteModel = require('../models/inviteModel');

module.exports = {
    name : "guildDelete",
    async run(client , guild) {
        await guildConfig.findOneAndDelete({guildId : guild.id})
            .then(async() => {
                await warnModel.findOneAndDelete({guildId : guild.id})
                    .then(async() => {
                        await inviteModel.findOneAndDelete({guildId : guild.id})
                            .then(() => console.log(`Deleted Guild Config for ${guild.name}`))
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        
        try{
            client.guildConfig.delete(guild.id) 
        }
        catch(err){
            console.log(err)
        }
    }
}