require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const encrypt = require("mongoose-encryption")

app.use(bodyparser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1:27017/userDB") 

const userSchema= new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const users= new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",(req,res)=>{
    try{
        const newUser= users({
            email:req.body.username,
            password:req.body.password
        })
        newUser.save();
        res.render("secrets")

    }catch(err){
         
            console.log("error!!");
        
    }  
})

app.post("/login", async (req,res)=>{
    try{
        const userlist= await users.findOne(
            {email:req.body.username}
        );
        if(userlist.password===req.body.password){
            res.render("secrets");
        }

    }
    catch(err){
        console.log("error inside try block");
    }
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("Live NOW");
})