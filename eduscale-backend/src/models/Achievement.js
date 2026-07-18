const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Achievement = sequelize.define(
"achievements",

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


date:{
    type:DataTypes.DATEONLY,
    allowNull:false
},


title:{
    type:DataTypes.STRING,
    allowNull:false
},


description:{
    type:DataTypes.TEXT
},


level:{
    type:DataTypes.STRING,
    defaultValue:"Sekolah"
}

},

{
timestamps:true
}

);


module.exports = Achievement;
