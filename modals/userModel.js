const mongoose = require("mongoose")
const bcrpyt= require("bcrypt")

const userModel= mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    }
},{
    timeStamp: true,
});
    userModel.methods.matchPassword= async function(enteredPassword){
        return await bcrpyt.compare(enteredPassword, this.password);
    };

    userModel.pre("save", async function(next){
        if(!this.isModified("password")){
            next();
        }
        const salt= await bcrpyt.genSalt(10);
        this.password = await bcrpyt.hash(this.password, salt);
    }
);


const User =mongoose.model("User", userModel);
module.exports= User;