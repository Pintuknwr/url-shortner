const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const {restrictToLoggedInOnly}=require("./middlewares/auth")

const URL=require("./models/url")

const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter")
const userRoute=require("./routes/user");
const { default: mongoose } = require("mongoose");
const app=express();
const port=9008;

mongoose.connect("mongodb://localhost:27017/urlservice").then(()=>{
    console.log("connected")
}).catch((err) => {
    console.error("Connection error", err);
});
//templating language ejs
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/url",restrictToLoggedInOnly,urlRoute);
app.use("/", staticRoute);
app.use("/user",userRoute);



app.get("/url/:shortId",async(req,res)=>{
    const shortId=req.params.shortId;
   const entry= await URL.findOneAndUpdate({
        shortId
    },{ $push:{
        visitHistory : {timestamp: Date.now(),},
    },})

  res.redirect(entry.redirectURL);
})



app.listen(port,()=>{
    console.log("server started at port",port);
})