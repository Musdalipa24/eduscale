const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Semester = sequelize.define(
"semesters",

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


academic_year_id:{
    type:DataTypes.INTEGER,
    allowNull:false
},


is_active:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
}

},

{
timestamps:true
}

);


module.exports = Semester;
