const Invites = require("../models/inviteModel")

module.exports = {
    name : "inviteDelete",
    async run(invite){
             await Invites.findOneAndDelete({code : invite.code, guildId : invite.guild.id})
                            .then(() => console.log("Invite deleted"))
                            .catch((err) => console.log(err))
    }
}
