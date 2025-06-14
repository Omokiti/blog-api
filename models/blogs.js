const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const blogSchema = new Schema({
      
        title:{
        type:String,
        required:true,
        unique:true
        } ,
        body:{
        type:String,
        required:true,
        },
        description:{
        type:String,
        required:true,
        },
        author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        state: { 
        type: String, 
        enum:['draft','published'],
        default:'draft'
        },
        read_count:{
        type: Number,
         default: 0,
        },
        reading_time:{
        type: String
        },
        tags:{
        type: [String], // Array of strings
        default: [],
        },
       
     } ,{ timestamps: true })
        
        
        
   


module.exports = mongoose.model('blogs',blogSchema)