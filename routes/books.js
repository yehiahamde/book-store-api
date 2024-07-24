const express=require("express");
const joi =require('joi');
const router =express.Router();
const asyncHandler=require("express-async-handler")
const {Book} = require("../models/Book")
const {verifyTokenAndAdmin}=require("../middlewares/verifyToken");

const books=[
    {
        id:1,
        title:"Black",
        auther:"yehia",
        des:"sun",
        price:10,
        cover:"soft"
    },
    {
        id:2,
        title:"swan",
        auther:"hamdy",
        des:"moon",
        price:15,
        cover:"soft"
    },
]

router.get("/",asyncHandler(async(req,res)=>{
    const books = await Book.find().populate("auther",["name"]);
    res.status(200).json(books);  
}));
router.get("/:id",asyncHandler(async(req,res)=>{
    const book=await Book.findById(req.params.id).populate("auther");
    if(book){
        res.status(200).json(book);
    }else{
        res.status(404).json({message:"book not found"});
    }
})); 

router.post("/",verifyTokenAndAdmin,asyncHandler(async(req,res)=>{
  const{error}= validateCreateBook(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }
    const book = new Book ({
        title:req.body.title,
        auther:req.body.auther,
        description:req.body.description,
        price:req.body.price,
        cover:req.body.cover
    })
    const result = await book.save();
    res.status(201).json(result);
}));

router.put("/:id",verifyTokenAndAdmin,asyncHandler(async(req,res)=>{
    const{error}= validateUbdateBook(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }
  const book = await Book.findByIdAndUpdate(req.params.id,{
   $set:{
    title:req.body.title,
    auther:req.body.auther,
    description:req.body.description,
    price:req.body.price,
    cover:req.body.cover
   }
  },{new:true});
  res.status(200).json(updatedBook)
}));

router.delete("/:id",verifyTokenAndAdmin,asyncHandler(async(req,res)=>{
  const book=await Book.findById(req.params.id);
  if(book){
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"book has been deleted"});
  }else{
    res.status(404).json({message:"book not found"});
  }
}));

function validateCreateBook(obj){
    const schema =joi.object({
        title:joi.string().trim().min(3).max(200).required(),
        auther:joi.string().trim().min(3).max(200).required(),
        description:joi.string().min(5).required(),
        price:joi.number().min(0).required(),
       cover:joi.string().valid("soft cover","hard cover").required(),
      });

  return schema.validate(obj);
}

function validateUbdateBook(obj){
    const schema =joi.object({
        title:joi.string().trim().min(3).max(200),
        auther:joi.string().trim().min(3).max(200),
        description:joi.string().min(3).max(500),
        price:joi.number().min(0),
       // cover:joi.string().trim(),
      });

  return schema.validate(obj);
}
module.exports=router;
 
 


 