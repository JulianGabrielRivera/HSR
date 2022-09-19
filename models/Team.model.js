const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamName:{
    type:String,
    required:true
  },
  teamLogo:{
    type:String,
    
  }
  ,
  comments: [{type:Schema.Types.ObjectId, ref: 'Comment'}]
    
})

const Team = mongoose.model('Team',teamSchema)

module.exports = Team;