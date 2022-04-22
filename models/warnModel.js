const mongoose = require('mongoose')

const warnSchema = new mongoose.Schema(
    {
        memberId : {
            type : String,
            required : true
        },
        reason : {
            type : String,
            required : true
        },
        guildId :{
            type : String,
            required : true
        }
    }
)

module.exports = mongoose.model('WarnModel' , warnSchema)