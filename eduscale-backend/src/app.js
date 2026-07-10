const express=require("express");
const cors=require("cors");


const app=express();


app.use(cors());

app.use(express.json());

const authRoutes =
require("./routes/authRoutes");


app.use(
"/api/auth",
authRoutes
);

app.get("/",(req,res)=>{

res.json({

message:"EduScale API Running"

});

});


module.exports=app;