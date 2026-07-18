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
},


gender:{
type:DataTypes.STRING
},


phone:{
type:DataTypes.STRING
},


address:{
type:DataTypes.TEXT
},


user_id:{
type:DataTypes.INTEGER
}


},

{
timestamps:true
}

);


module.exports=Teacher;