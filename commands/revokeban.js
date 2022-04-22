const { Constants ,Permissions } = require("discord.js");

module.exports = {
    name : 'revokeban',
    description : 'Revokes a ban',
    slash : true,
    permissions : [Permissions.FLAGS.BAN_MEMBERS],
    options : [
        {
            name : "member_id",
            description : "The ID of the member.",
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true

        }
    ],
    async execute({ interaction , options , message  }){
        if(message) return;

        await interaction.deferReply()
        
        const id = options.getString('member_id');

        await interaction.guild.members.unban(id)
                .then(() => interaction.editReply(`Successfully unbanned **${id}**`))
                .catch(() => interaction.editReply(`Failed to unban **${id}**`));

    }

}   