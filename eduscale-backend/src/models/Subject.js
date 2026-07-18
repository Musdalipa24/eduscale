const {
DataTypes
}=require("sequelize");


const sequelize=require("../config/database");


const Subject=sequelize.define(
"subjects",

{

id:{
type:DataTypes.INTEGER,
autoIncrement:true,
primaryKey:true
},


name:{
type:DataTypes.STRING,
allowNull:false
},


teacher_id:{
type:DataTypes.INTEGER
}


},

{
timestamps:true
}

);


module.exports=Subject;