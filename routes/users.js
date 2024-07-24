const express=require("express");
const router =express.Router();
const asyncHandler=require("express-async-handler");
const bcrypt=require("bcryptjs")
const {User,validateUpdateUser}=require("../models/Users")
const {verifyTokenAndAuthorization,verifyTokenAndAdmin}=require("../middlewares/verifyToken");


router.put("/:id",verifyTokenAndAuthorization,asyncHandler(async(req,res)=>{

        
    const{error}=validateUpdateUser(req.body);
    if(error){
        return res.status(400)//ممنوعة
        .json({message: error.details[0].message});
    }
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(req.body.password,salt);//تشفير الباسورد
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            email:req.body.email,
            password:req.body.password,
            username:req.body.username,
        }
    },{new:true}).select("-password");//مبعتوش لليوزر
    res.status(200).json(updatedUser);
}));
//get users
router.get("/",verifyTokenAndAdmin,asyncHandler(async(req,res)=>{
   const users= await User.find().select("-password");
    res.status(200).json(users);
}));
//get user by id
router.get("/:id",verifyTokenAndAuthorization,asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id).select("-password");
    if(user){
        res.status(200).json(user)
    }elseres.status(404).json({message:"user not found"})
     
 }));

 // delete
 router.delete("/:id",verifyTokenAndAuthorization,asyncHandler(async(req,res)=>{
    const user= await User.findById(req.params.id).select("-password");
    if(user){
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"user has been deleted successfuly"});
    }else{
        res.status(404).json({message:"user not found"});
    }
     
 }));
module.exports=router;