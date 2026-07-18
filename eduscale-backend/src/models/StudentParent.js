const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const StudentParent = sequelize.define(
"student_parents",

{

id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
},


student_id:{
    type:DataTypes.INTEGER,
    allowNull:false
},


user_id:{
    type:DataTypes.INTEGER,
    allowNull:false
}

},

{
timestamps:true
}

);


module.exports = StudentParent;
