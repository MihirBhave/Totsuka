const { Permissions, MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");

module.exports = {
    name : "support",
    description : "Generates a support server link.",
    slash : true,
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    async execute({message , interaction , options}){
        if(message) return;

        const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Support Server")
                            .setURL("https://discord.gg/536Ex6WCMG")
                            .setStyle("LINK")
                    )
        
        const embed = new MessageEmbed()
                        .setTitle("Support Server - Totsuka")
                        .setColor("RANDOM")
                        .setDescription("If you have any questions or concerns about using the bot , please join our support server by clicking on the button below !")

        await interaction.reply({embeds : [embed] , components : [row]});
    }
}