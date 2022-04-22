const { Permissions , Constants, MessageEmbed } = require("discord.js");
const Invites = require('../models/inviteModel');

module.exports = {
    name : "invite",
    description : "Performs various actions on an invite.",
    slash : true,
    permissions : [Permissions.FLAGS.MANAGE_GUILD],
    options : [
        {
            name : "create",
            description : "Creates an invite for the guild",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "time_limit",
                    description : "The time limit for the invite keep it empty for no time limit (days)",
                    type : Constants.ApplicationCommandOptionTypes.NUMBER,
                    maxValue : 7,
                    minValue : 1,
                },
                {
                    name : "max_uses",  
                    description : "The max uses for the invite keep it empty for no max uses",
                    type : Constants.ApplicationCommandOptionTypes.NUMBER,
                    maxValue : 100,
                    minValue : 1
                }
            ]
        },
        {
            name : "delete",
            description : "Deletes an invite code",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "code",
                    description : "The code of the invite to delete",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        },
        {
            name : "info",
            description : "Gets information about an invite",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "code",
                    description : "The code of the invite ",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        }
    ],
    async execute({interaction , message , options , client}){
        if(message) return;
        await interaction.deferReply()
            .catch(() => console.log('.'))

        if(options.getSubcommand() === 'create'){
            await interaction.editReply({content : "Creating an invite..."})

        let time = options.getNumber("time_limit") * 3600 * 24;
        let max = options.getNumber("max_uses");

        if(!time) time = 0
        if(!max) max = 0
        
        try{
            const invite = await interaction.channel.createInvite({
                maxAge : time,
                maxUses : max,
                temporary : false,
                unique : true,
                reason : `${interaction.user.tag}`
            })

            interaction.editReply({content : `Created invite ${invite.url}`})

            const invites = new Invites({
                code : invite.code,
                guildId : interaction.guild.id,
                member : interaction.user.tag
            })

           await invites.save()
                    .then(() => console.log("Data saved successfully."))
        }
        
        catch(err){
            interaction.editReply({content : `Error creating an invite.`})
        }

        
        }
        else if(options.getSubcommand() === "delete"){
            let invite;
            try{
                invite = await interaction.guild.invites.fetch(options.getString("code"))
            }
            catch(e){
               // console.log(e)
            }

            if(!invite) return interaction.editReply({content : `Invite with code **${options.getString("code")}** not found`})

            await interaction.editReply({content : "Deleting invite link...."})
                    .catch(e => console.log(e))

      
            await invite.delete(`Requested by ${interaction.user.tag}`)
                .then(() => interaction.editReply({content : `Deleted invite with code **${options.getString("code")}**`}))
                .catch(() => interaction.editReply({content : `Failed to delete invite with code **${options.getString("code")}**`}))
        }

        else if(options.getSubcommand() === "info"){
            let invite;
            try{
                invite = await interaction.guild.invites.fetch(options.getString("code"))

            }
            catch(e){
                //console.log(e)
            }

            if(!invite) return interaction.editReply({content : `Invite with code **${options.getString("code")}** not found`})

    
            await interaction.editReply({content : "Fetching invite info...."})

            let user ;
            await Invites.findOne({code : invite.code})
                            .then(invite => user = invite.member)
                            .catch(err => console.log(err))
                            
            if(!user) user = invite.inviter.tag

            const embed1 = new MessageEmbed()
                            .setTitle('Invite Info')
                            .setDescription(`**Code** : ${invite.code}`)
                            .addFields(
                                {name : "Created at", value : `${invite.createdAt}`},
                                {name : "Max uses", value : `${invite.uses}`},
                                {name : "Max age", value : `${invite.maxAge}`},
                                {name : "Temporary", value : `${invite.temporary}`},
                                {name : "Channel", value : `${invite.channel.name}`},
                                {name : "Guild", value : `${invite.guild.name}`},
                                {name : "Inviter", value : `${user}`}
                            )
                            .setColor("RANDOM")
                            .setFooter({text : `Requested by ${interaction.user.tag}`})

                try{
                    await interaction.editReply({content : "Here is the info !" , embeds : [embed1]})
                }
                catch(err){
                    console.log(err)
                    interaction.editReply({content : "Something went wrong , please try again later"})
                }

                
        }
    }
} 