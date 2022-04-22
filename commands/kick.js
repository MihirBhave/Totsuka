const {Constants , Permissions, MessageActionRow, MessageButton} = require('discord.js')

module.exports = {
    name : "kick",
    slash : true,
    description : "Kicks a user from the server",
    permissions : [Permissions.FLAGS.KICK_MEMBERS],
    options : [
        {
            name : 'member',
            description : 'The member to be kicked.',
            type : Constants.ApplicationCommandOptionTypes.USER,
            required : true
        },
        {
            name : 'reason',
            description : 'The reason for the kick.',
            type : Constants.ApplicationCommandOptionTypes.STRING,  
        }
    ],
    async execute({interaction , options , message}){
        if(message) return;

        const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('kick_yes')
                            .setStyle('SUCCESS')
                            .setLabel('Proceed')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('kick_no')
                            .setStyle('DANGER')
                            .setLabel('Cancel')
                    )

        const msg = await interaction.reply({content : "Would you like to kick?" , components : [row], fetchReply : true , ephemeral:true})

        const member = await interaction.guild.members.fetch(options.getUser("member").id)
                            .catch((err) => interaction.editReply({content : "Invalid Member" , ephemeral : true}));

        const reason = options.getString("reason") || "No reason provided.";
        if(reason.length > 512) reason = reason.substring(0, 500);

        if(!member) return interaction.editReply({content : "Invalid Member" , ephemeral : true}).catch(() => {null});
        if(!member.kickable) return interaction.editReply({content : "I cannot kick this member." , ephemeral : true}).catch(() => null);

        const filter = (i) => i.user.id === interaction.user.id

        const collecter =   await msg.createMessageComponentCollector({filter , time :30000 , max : 1})

        collecter.on('collect' , async(btnInt) => {
            //await btnInt.deferUpdate({fetchReply : true})
            if(btnInt.customId == 'kick_yes'){
                member.kick(reason)
                    .then(async () => {
                    await btnInt.update({content : `Kicked ${member.user.tag}` , ephemeral : true , components : []})
                            .catch(() => null)

                    collecter.stop()
                    })
                    .catch(() => btnInt.update({content : `Failed to kick ${member.user.tag}` , ephemeral : true , components : []})).catch(() => null)
            }
            else if(btnInt.customId == 'kick_no'){
             btnInt.update({content : `Cancelled Kick` , ephemeral : true , components : []}).catch(() => null)
             collecter.stop()
            }
        })

        collecter.on('end' , async(collected)  =>{

            if(collected.size === 0){
                interaction.editReply({content : "You took too long to respond." , ephemeral : true , components : []})
                    .catch(() => null)
            }
        })
        
        
    }
}