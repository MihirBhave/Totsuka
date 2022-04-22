const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const inviteSchema = new Schema({
    code : {
        type : String,
        required : true
    },
    guildId : {
        type : String,
        required : true
    },
    member : {
        type : String,
        required : true
    }
})

module.exports =  mongoose.model("Invites", inviteSchema)