const {
DataTypes
}=require("sequelize");


const sequelize=require("../config/database");


const Student=sequelize.define(
"students",

{

id:{
type:DataTypes.INTEGER,
autoIncrement:true,
primaryKey:true
},


nis:{
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


birth_place:{
type:DataTypes.STRING
},


birth_date:{
type:DataTypes.DATEONLY
},


address:{
type:DataTypes.TEXT
},


phone:{
type:DataTypes.STRING
},


parent_name:{
type:DataTypes.STRING
},


parent_phone:{
type:DataTypes.STRING
},


class_id:{
type:DataTypes.INTEGER
},


status:{
type:DataTypes.STRING,
defaultValue:"Aktif"
}

},

{
timestamps:true
}

);


module.exports=Student;