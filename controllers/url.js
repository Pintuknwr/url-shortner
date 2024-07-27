const shortid=require("shortid");
const URL=require("../models/url");
async function handleGenerateURL(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:"URL is required"})
const shortID = shortid();
await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory:[],



}) ;
return res.render("home",{
    id: shortID,

})
}



async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result= await URL.findOne({shortId});
    return res.json({titalClicks:result.visitHistory.length,
     analytics:result.visitHistory,
    })
 
 }
module.exports={
    handleGenerateURL,
    handleGetAnalytics,
}