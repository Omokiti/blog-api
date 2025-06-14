const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: { 
        type: String, 
        required: true 
    },
    
        createdAt : {
        type: Date,
        default: Date.now
    },
    
})
// userSchema.plugin(passportLocalMongoose)
userSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);

// You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

// userSchema.methods.isValidPassword = async function(password) {
//     const user = this;
//     const compare = await bcrypt.compare(password, user.password);
  
//     return compare;
//   }


module.exports=mongoose.model('User',userSchema)

