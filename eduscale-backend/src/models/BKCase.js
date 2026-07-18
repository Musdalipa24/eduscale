const {
DataTypes
}=require("sequelize");


const sequelize=require("../config/database");


const BKCase=sequelize.define(
"bk_cases",

{

id:{
type:DataTypes.INTEGER,
autoIncrement:true,
primaryKey:true
},


student_id:{
type:DataTypes.INTEGER
},


case_type:{
type:DataTypes.STRING
},


description:{
type:DataTypes.TEXT
},


status:{
type:DataTypes.STRING,
defaultValue:"Proses"
}


},

{
timestamps:true
}

);


module.exports=BKCase;