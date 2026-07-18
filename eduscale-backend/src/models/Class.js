const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");


const Class=sequelize.define(
"classes",

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


wali_kelas_id:{
type:DataTypes.INTEGER
},


academic_year_id:{
type:DataTypes.INTEGER
}


},

{
timestamps:true
}

);


module.exports=Class;