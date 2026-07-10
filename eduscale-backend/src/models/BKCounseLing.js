const {
    DataTypes
} = require("sequelize");

const sequelize = require("../config/database");


const BKCounselingNote = sequelize.define(
"bk_counseling_notes",

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


note:{
    type:DataTypes.TEXT
},


follow_up:{
    type:DataTypes.TEXT
}

},

{
timestamps:true
}

);


module.exports = BKCounselingNote;