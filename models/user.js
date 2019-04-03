var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog',{useNewUrlParser: true})

var Schema = mongoose.Schema 

var userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('User',userSchema)