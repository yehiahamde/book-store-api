const express=require("express");
const joi =require('joi');
const router =express.Router();
const asyncHandler=require("express-async-handler")
const {Team} = require("../models/Teams")
const {verifyTokenAndAdmin}=require("../middlewares/verifyToken");

  
router.get("/",asyncHandler(
  async(req,res)=>{
   const teamsList=await Team.find();
  res.status(200).json(teamsList);     
}
));   
router.get("/:id",async(req,res)=>{
    
  try {
    const team= await Team.findById(req.params.id);
    if(team){ 
        res.status(200).json(team);
    }else{
        res.status(404).json({message:"team not found"});
    }
  } catch (error) {        
    console.log(error);
        res.status(500).json({message:"somthing went wrong"})
  }
}); 

router.post("/",verifyTokenAndAdmin,asyncHandler(
  async(req,res)=>{
    const{error}= validateCreateteam(req.body);
    if(error){
      return res.status(400).json({message: error.details[0].message});
    }
      const team = new Team({
          name:req.body.name,
          trophies:req.body.trophies,
          leaguePoints:req.body.leaguePoints
      });
     const result= await team.save();
      res.status(201).json(result);

  }
));

router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
   try {
    const{error}= validateUbdateteam(req.body);
    if(error){
      return res.status(400).json({message: error.details[0].message});
    }
    const team= await Team.findByIdAndUpdate(req.params.id,{
      $set:{
          name:req.body.name,
          trophies:req.body.trophies,
          leaguePoints:req.body.leaguePoints 
      }
    },{new:true});
    res.status(200).json(team);
   } catch (error) {
    console.log(error);
    res.status(500).json({message:"sonthing went wrong"}); 
   }
})

router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
   try {
    const team= await Team.findById(req.params.id);
    if(team){
        await Team.findByIdAndRemove(req.params.id);
      res.status(200).json({message:"team has been deleted"});
    }else{
      res.status(404).json({message:"team not found"});
    }
   } catch (error) {
    onsole.log(error);
    res.status(500).json({message:"sonthing went wrong"}); 
   }
}) 

function validateCreateteam(obj){
    const schema =joi.object({
        name:joi.string().trim().min(3).max(200).required(),
        trophies:joi.string().trim().min(3).max(200).required(),
        leaguePoints:joi.number() 
      });
  return schema.validate(obj);
}

function validateUbdateteam(obj){
    const schema =joi.object({
        name:joi.string().trim().min(3).max(200),
        trophies:joi.string().trim().min(3).max(200),
        leaguePoints:joi.number()     
      });

  return schema.validate(obj);
}
module.exports=router;