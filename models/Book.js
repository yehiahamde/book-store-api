const mongoose  = require('mongoose');

const BooksSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        milength:3,
        maxlength:250
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Team",
    },
    description:{
        type:String,
        trim:true,
        minlength:5,
        maxlength:250
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    cover:{
        type:String,
        required:true,
        enum:["soft cover","hard cover"]
    }
},{timestamps:true});

const Book = mongoose.model("Book",BooksSchema);

module.exports={
    Book
}