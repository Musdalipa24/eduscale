const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const AcademicYear = sequelize.define(
"academic_years",

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


is_active:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
}

},

{
timestamps:true
}

);


module.exports = AcademicYear;
