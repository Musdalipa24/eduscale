const {
    DataTypes
} = require("sequelize");

const sequelize = require("../config/database");


const ActivityLog = sequelize.define(
"activity_logs",

{

id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
},


user_id:{
    type:DataTypes.INTEGER
},


activity:{
    type:DataTypes.STRING
},


description:{
    type:DataTypes.TEXT
}

},

{
timestamps:true
}

);


module.exports = ActivityLog;