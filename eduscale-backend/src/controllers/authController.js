const bcrypt = require("bcrypt");

const {
User,
Role
}=require("../models");


const generateToken=require("../utils/generateToken");



// REGISTER

exports.register = async(req,res)=>{


try{


const {
name,
email,
password,
role_id
}=req.body;



const existingUser = await User.findOne({
where:{
email
}
});


if(existingUser){

return res.status(400).json({

message:"Email sudah digunakan"

});

}



const hashedPassword =
await bcrypt.hash(password,10);



const user = await User.create({

name,
email,
password:hashedPassword,
role_id

});



res.status(201).json({

message:"User berhasil dibuat",

user

});


}catch(error){

res.status(500).json({

message:error.message

});

}

};




// LOGIN

exports.login = async(req,res)=>{


try{


const {
email,
password
}=req.body;



const user = await User.findOne({

where:{
email
},

include:[
{
model:Role
}
]

});



if(!user){

return res.status(404).json({

message:"User tidak ditemukan"

});

}




const validPassword =
await bcrypt.compare(
password,
user.password
);



if(!validPassword){

return res.status(401).json({

message:"Password salah"

});

}




const token =
generateToken(user);



res.json({

message:"Login berhasil",

token,


user:{
id:user.id,
name:user.name,
email:user.email,
role:user.role.name
}

});



}catch(error){


res.status(500).json({

message:error.message

});


}


};