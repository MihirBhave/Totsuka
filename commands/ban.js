const {Constants , Permissions, MessageActionRow, MessageButton} = require('discord.js')

module.exports = {
    name : "ban",
    slash : true,
    description : "Bans a user from the server",
    permissions : [Permissions.FLAGS.BAN_MEMBERS],
    options : [
        {
            name : 'member',
            description : 'The member to be banned.',
            type : Constants.ApplicationCommandOptionTypes.USER,
            required : true
        },
        {
            name : 'reason',
            description : 'The reason for the ban.',
            type : Constants.ApplicationCommandOptionTypes.STRING,  
        }
    ],
    async execute({interaction , options , message}){
        if(message) return;


        const member = await interaction.guild.members.fetch(options.getUser("member").id)
                        .catch((err) => interaction.reply({content : "Invalid Member" , ephemeral : true}));

        let reason = options.getString("reason") || "No reason provided.";

        if(reason.length > 512) reason = reason.substring(0, 500);

        console.log(reason.length)
        const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ban_yes')
                            .setStyle('SUCCESS')
                            .setLabel('Proceed')
                            .setEmoji('🔨')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ban_no')
                            .setStyle('DANGER')
                            .setLabel('Cancel')
                            .setEmoji('❌')
                    )

        const msg = await interaction.reply({content : "Would you like to ban?" , components : [row] , fetchReply : true , ephemeral:true})

        if(!member) return interaction.editReply({content : "Invalid Member" , ephemeral : true});
       // if(!member.banable) return interaction.editReply({content : "I cannot ban this member." , ephemeral : true});

        const filter = (i) => i.user.id === interaction.user.id
        const collecter =   await msg.createMessageComponentCollector({filter , time :30000 , max : 1 , type : "BUTTON"})

        collecter.on('collect' , async(btnInt) => {
            if(!msg) return;
            if(btnInt.customId == 'ban_yes'){
                await member.ban({reason})
                    .then(async () => {
                        // msg.edit({content : "Action Taken." , ephemeral : true , components : []})
                        //     .catch(() => null)
                        await btnInt.update({content : `Banned ${member.user.tag} \n Reason : ${reason}` , ephemeral : true , components : []})
                        .catch(() => null)
                        collecter.stop()
                    })
                    .catch(() => btnInt.update({content : `Failed to ban ${member.user.tag}` , ephemeral : true , components : []}))
            }
            else if(btnInt.customId == 'ban_no'){
                // interaction.editReply({content : "Action Taken." , ephemeral : true , components: []})
                //     .catch(() => null)
                await btnInt.update({content : `Cancelled Ban` , ephemeral : true , components : []})
                    .catch(() => null)
                collecter.stop()
            }
        })

        collecter.on('end' , async(collected)  =>{

            if(collected.size === 0){
                if(!msg) return;
                interaction.editReply({content : "You took too long to respond." , ephemeral : true , components : []})
                    .catch(() => null)
            }
        })
        
        
    }
}