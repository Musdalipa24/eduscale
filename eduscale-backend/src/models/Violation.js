const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Violation = sequelize.define(
"violations",

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


teacher_id:{
    type:DataTypes.INTEGER
},


date:{
    type:DataTypes.DATEONLY,
    allowNull:false
},


type:{
    type:DataTypes.STRING,
    allowNull:false
},


description:{
    type:DataTypes.TEXT
},


points:{
    type:DataTypes.INTEGER,
    defaultValue:0
},


follow_up:{
    type:DataTypes.TEXT
}

},

{
timestamps:true
}

);


module.exports = Violation;
