const { Permissions, Constants } = require("discord.js");

module.exports = {
    name : "channel",
    description : "Performs various actions on a text channel.",
    slash : true,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : "delete",
            description : "Deletes a channel",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "The name of the channel to delete",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                }
            ]
        },
        {
            name : "lock",
            description : "Locks a channel",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "The name of the channel to lock",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                },
                {
                    name : "role",
                    description : "The name of the role to lock the channel to , locks for everyone role by default.",
                    type : Constants.ApplicationCommandOptionTypes.ROLE,
                    required : false
                }
            ]
        },
        {
            name : "unlock",
            description : "Unlocks a channel",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "The name of the channel to unlock",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                },
                {
                    name : "role",
                    description : "The name of the role to unlock the channel to , unlocks for everyone role by default.",
                    type : Constants.ApplicationCommandOptionTypes.ROLE,
                    required : false
                }
            ]
        },
        {
            name : "private",
            description : "Make a channel private for a role",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "The name of the channel to make private",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                },
                {
                    name : "role",
                    description : "The name of the role to make the channel private for. Everyone role is taken by default.",
                    type : Constants.ApplicationCommandOptionTypes.ROLE,
                    required : false
                }
            ]
        },
        {
            name : "public",
            description : "Make a channel public for a role",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "The name of the channel to make public",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                },
                {
                    name : "role",
                    description : "The name of the role to make the channel public for. Everyone role is taken by default.",
                    type : Constants.ApplicationCommandOptionTypes.ROLE,
                    required : false
                }
            ]
        }
    ],
    async execute({interaction , message , options }){
        if(message) return;

        await interaction.deferReply();

        if(options.getSubcommand() === 'delete'){
            if(options.getChannel('channel').type != "GUILD_TEXT") return  interaction.reply("You can only specify a Text Channel.");

            await interaction.guild.channels.fetch(options.getChannel('channel').id)
                    .then(async channel =>{
                        interaction.editReply({content : `Deleting channel **${channel.name}** ...`})
                        setTimeout(async() => {
                            try{
                            
                            await channel.delete()
                                .then(() => interaction.editReply({content : `Deleted channel ${channel.name}`}))
                                .catch(() => interaction.editReply({content : `Failed to delete channel ${channel.name}`}))   
                            }
                            catch{
                                console.error()
                            }
                        }, 2000)

                    })
                    .catch(() => interaction.editReply({content : `Failed to find channel ${options.getChannel('channel').name}`}))
        }

        else if(options.getSubcommand() === 'lock'){
            let role;
            if(options.getChannel('channel').type != "GUILD_TEXT") return  interaction.reply("You can only specify a Text Channel.");

            role = options.getRole('role') ? options.getRole('role') : interaction.guild.roles.everyone

            await interaction.guild.channels.fetch(options.getChannel('channel').id)
                    .then(async channel =>{
                        interaction.editReply({content : `Locking channel **${channel.name}** for ${role.name} role ...`})
                        setTimeout(async() => {
                            try{
                            await channel.permissionOverwrites.edit(role.id, {
                                SEND_MESSAGES : false
                            })
                                .then(() => interaction.editReply({content : `Locked channel ${channel.name} for role **${role.name}**`}))
                                .catch(() => interaction.editReply({content : `Failed to lock channel ${channel.name}`}))   
                            }
                            catch(err){
                                console.log(err)
                            }
                        }, 2000)

                    })
                    .catch(() => interaction.editReply({content : `Failed to find channel ${options.getChannel('channel').name}`}))
        }

        else if(options.getSubcommand() === 'unlock'){
            let role;
            if(options.getChannel('channel').type != "GUILD_TEXT") return  interaction.reply("You can only specify a Text Channel.");
            role = options.getRole('role') ? options.getRole('role') : interaction.guild.roles.everyone

            await interaction.guild.channels.fetch(options.getChannel('channel').id)
                    .then(async channel =>{
                        interaction.editReply({content : `Unlocking channel **${channel.name}** for ${role.name} role ...`})
                        setTimeout(async() => {
                            try{
                            await channel.permissionOverwrites.edit(role.id, {
                                SEND_MESSAGES : true
                            })
                                .then(() => interaction.editReply({content : `Unlocked channel ${channel.name} for role **${role.name}**`}))
                                .catch(() => interaction.editReply({content : `Failed to unlock channel ${channel.name}`}))   
                            }
                            catch(err){
                                console.log(err)
                            }
                        }, 2000)

                    })
                    .catch((err) => console.log(err))
        }

        else if(options.getSubcommand() === "private"){
            if(options.getChannel('channel').type != "GUILD_TEXT") return  interaction.reply("You can only specify a Text Channel.");
            const role = options.getRole('role') ? options.getRole('role') : interaction.guild.roles.everyone

            await interaction.guild.channels.fetch(options.getChannel('channel').id)
                    .then(async(channel) => {
                        await channel.permissionOverwrites.edit(role.id , {
                            VIEW_CHANNEL : false,
                        })
                        .then(() => interaction.editReply({content : `Made channel **${channel.name}** private for role **${role.name}**`}))
                        .catch(() => interaction.editReply({content : `Failed to make channel **${channel.name}** private for role **${role.name}**`}))
                    })
                    .catch(() => interaction.editReply({content : `Failed to find channel ${options.getChannel('channel').name}`}))
        }

        else if(options.getSubcommand() === "public"){
            if(options.getChannel('channel').type != "GUILD_TEXT") return  interaction.reply("You can only specify a Text Channel.");
            const role = options.getRole('role') ? options.getRole('role') : interaction.guild.roles.everyone

            await interaction.guild.channels.fetch(options.getChannel('channel').id)
                    .then(async(channel) => {
                        await channel.permissionOverwrites.edit(role.id , {
                            VIEW_CHANNEL : true,
                        })
                        .then(() => interaction.editReply({content : `Made channel **${channel.name}** public for role **${role.name}**`}))
                        .catch(() => interaction.editReply({content : `Failed to make channel **${channel.name}** public for role **${role.name}**`}))
                    })
                    .catch(() => interaction.editReply({content : `Failed to find channel ${options.getChannel('channel').name}`}))
        }
    }
}