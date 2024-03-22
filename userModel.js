
const mongoose =  require("mongoose")
const bcrypt= require("bcryptjs")
const jwt =require("jsonwebtoken")


//User Model
const userSchema = new mongoose.Schema({
    firstname:{
        type: 'String',
        required: [true,'A user must have a first name']
    },
    lastname:{
        type: 'String',
        required: [true,'A user must have a last name']
    },
    username:{
        type: 'String',
        required: [true,'Please enter a username'],
        unique: true
    },
    email:{
        type: 'String',
        required: [true,'Please enter your emailID'],
        unique: true
    },
    password:{
        type: 'String',
        required: [true,'Please enter your password']
    },
    confirmPassword:{
        type: 'String',
        required: true
    },
    profile_picature:{
        type: Array //[name of collection whose object ]
    },
    folders:{
        type: Array
    },
    communities:{
        type: Array
    },
    recent_chats:{
        type: Array
    },
    wishlist:{
        type: Array
    },
    events:{
        type: Array
    },
    recommendations:{
        type: Array
    }
})

//Securing User Password
userSchema.pre("save", async function(next){
    
    const user = this

        if(!user.isModified("password")){
        next()
        }
        try{
        const saltRound = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, saltRound)
        user.password=hashPassword
        }
        catch(error){
        next(error)
        }
    
})


//json web token
userSchema.methods.generateToken = async function(){
    try{
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d"
            }
        )

    }
    catch(error){
        console.error(error)
    }
}


//Creating new User and exporting
const User = new mongoose.model('User',userSchema)
module.exports = User