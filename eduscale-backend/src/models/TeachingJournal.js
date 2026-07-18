const {
DataTypes
}=require("sequelize");


const sequelize=require("../config/database");


const TeachingJournal=sequelize.define(
"teaching_journals",

{

id:{
type:DataTypes.INTEGER,
autoIncrement:true,
primaryKey:true
},


teacher_id:{
type:DataTypes.INTEGER
},


class_id:{
type:DataTypes.INTEGER
},


subject_id:{
type:DataTypes.INTEGER
},


semester_id:{
type:DataTypes.INTEGER
},


date:{
type:DataTypes.DATEONLY
},


material:{
type:DataTypes.TEXT
},


method:{
type:DataTypes.STRING
},


note:{
type:DataTypes.TEXT
}


},

{
timestamps:true
}

);


module.exports=TeachingJournal;