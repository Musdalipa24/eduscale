const {
DataTypes
}=require("sequelize");

const sequelize=require("../config/database");


const Teacher=sequelize.define(
"teachers",

{

id:{
type:DataTypes.INTEGER,
autoIncrement:true,
primaryKey:true
},


nip:{
type:DataTypes.STRING,
unique:true
},


name:{
type:DataTypes.STRING,
allowNull:false
}


},

{
timestamps:true
}

);


module.exports=Teacher;