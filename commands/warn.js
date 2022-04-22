const {Permissions, Constants, MessageEmbed} = require('discord.js')
const WarnModel = require('../models/warnModel')

module.exports = {
    name : "warn",
    description : "Warns a User",
    slash : true,
    permissions : [Permissions.FLAGS.MODERATE_MEMBERS],
    options : [
        {
            name : "add",
            description : "Adds a warning to the user",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "member",
                    description : "Member",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                },
                {
                    name : "reason",
                    description : "The reason",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        },
        {
            name : "remove",
            description : "Removes a warn for a user.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "warn_id",
                    description : "The Warn's ID",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        },
        {
            name : "display",
            description : "Displays a Member's Warns in the guild.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "member",
                    description : "The Member",
                    type : Constants.ApplicationCommandOptionTypes.USER,
                    required : true
                }
            ]
        }
    ],
    async execute({interaction , options , message}){
        if(message) return;

        await interaction.deferReply()

        const query = options.getSubcommand()
        
        if(query === "add"){
            let member , reason;
            try{
            member = await interaction.guild.members.fetch(options.getUser("member").id)
            reason = options.getString('reason')
            }
            catch(e){
                console.log(e)
                return interaction.editReply({content : "Invalid Member" , ephemeral : true})
            }

            if(!member) return interaction.editReply({content : "Invalid Member."});
            if(member.id === interaction.guild.ownerId) return interaction.editReply({content : "You can't warn the owner."})
            
            if(interaction.member.roles.highest.position > member.roles.highest.position || interaction.member.id === interaction.guild.ownerId){
                
            reason = reason.length > 500 ? reason.substring(0, 50) : reason

            const Warn = new WarnModel({
                memberId : member.id,
                reason : reason,
                guildId : interaction.guild.id,
            })

            await Warn.save()
                    .then(async(warn) => {
                        interaction.editReply({content : `<@${member.id}> has been warned for **${reason}**`})
                        await member.send({content :  `You were warned in ${interaction.guild.name} \n Reason :  **${reason}**`})
                            .then(() => console.log("success"))
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            }
            else{
                interaction.editReply({content : `You cannot warn <@${member.id}>`})
            }
            
        }
        else if(query === "remove"){
            const warnId = options.getString('warn_id')
            let memberId , member  ,warn;
            
            try{
               warn = await WarnModel.findById(warnId)
               memberId = warn.memberId
                    

            }
            catch(e){
                return interaction.editReply({content : `Warn with ID ${warnId} not found.`});
            }
            
            //Checking for the member.
            try{
                member = await interaction.guild.members.fetch(memberId)
                console.log(interaction.member.id === interaction.guild.ownerId)
            }
            catch{
                return interaction.editReply({content : `Member with ID ${memberId} not found.`});
            }

            if(interaction.member.roles.highest.position > member.roles.highest.position || interaction.member.id === interaction.guild.ownerId){
                await WarnModel.findByIdAndDelete(warnId)
                .then((warn) => interaction.editReply({content : `Warn ID - ${warnId} removed by <@${interaction.member.id}>`}))
                .catch(() => interaction.editReply({content : `Warn ID with ${warnId} not found`}))
        }
        else{
            interaction.editReply({content : "You don't have permission to remove warns from this member."})
        }
            }
        else if(query === "display"){

            let member;
            try{
                member = await interaction.guild.members.fetch(options.getUser("member").id)
            }
            catch{
                return interaction.editReply({content : "Invalid Member."});
            }

            const Warns = await WarnModel.find({memberId : member.id , guildId : interaction.guild.id})

            if(!Warns.length) return interaction.editReply({content : `<@${member.id}> has no warns.`});

            const WarnsEmbedDescription = Warns.map((warn) => {
                return [
                    `Warn ID : ${warn._id}`,
                    `Reason :  ${warn.reason}`,
                    `--------------------------------------`

                ].join("\n")
            }).join("\n \n")

            const embed = new MessageEmbed()
                            .setTitle(`${Warns.length} warning(s) found for ${member.user.username}`)
                            .setDescription(WarnsEmbedDescription)
                            .setColor("#ff0000")
            
            interaction.editReply({embeds : [embed]})


        }
    }
}