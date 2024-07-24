const mongoose=require("mongoose")

const TeamSchema=new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Name is required']
    },
    trophies:{
        type:String,
        required: [true, 'trophies is required']
    },
    leaguePoints:{
        type:Number,
        required: [true, 'leaguePoints is required']
    }, 
},{
    timestamps:true
    
});

const Team = mongoose.model("Team",TeamSchema); 

module.exports={
    Team
}