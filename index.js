const express = require("express")
const mongoose = require("mongoose")
const app= express()

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


const route = require("./routes/route")
app.use(express.json())


app.get("/home",(req,res)=>{
    res.send("authentication generate")
})
mongoose.connect("mongodb+srv://nitukumari:Kashyapnitu8271@cluster0.5uwtnyo.mongodb.net/authentication", {useNewUrlParser:true})
.then(()=>console.log("mongodb is connected"))
.catch((error)=>console.log(error.message))

const PORT = 3000
app.use("/",route)
app.listen(PORT,function(){
    console.log(`server is running on this ${PORT}`)
})