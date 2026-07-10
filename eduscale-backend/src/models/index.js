const sequelize = require("../config/database");

const Role = require("./Role");
const User = require("./User");

const Student = require("./Student");
const Teacher = require("./Teacher");
const Class = require("./Class");
const Subject = require("./Subject");

const TeachingJournal = require("./TeachingJournal");

const BKCase = require("./BKCase");
const BKCounseling = require("./BKCounseling");

const ActivityL = require("./Activity");


// =====================
// RELATIONSHIP
// =====================


// Role - User

Role.hasMany(User,{
    foreignKey:"role_id"
});


User.belongsTo(Role,{
    foreignKey:"role_id"
});


// Class - Student

Class.hasMany(Student,{
    foreignKey:"class_id"
});


Student.belongsTo(Class,{
    foreignKey:"class_id"
});


// Teacher - Subject

Teacher.hasMany(Subject,{
    foreignKey:"teacher_id"
});


Subject.belongsTo(Teacher,{
    foreignKey:"teacher_id"
});


// Teaching Journal

Teacher.hasMany(TeachingJournal,{
    foreignKey:"teacher_id"
});


Class.hasMany(TeachingJournal,{
    foreignKey:"class_id"
});


Subject.hasMany(TeachingJournal,{
    foreignKey:"subject_id"
});


TeachingJournal.belongsTo(Teacher,{
    foreignKey:"teacher_id"
});


TeachingJournal.belongsTo(Class,{
    foreignKey:"class_id"
});


TeachingJournal.belongsTo(Subject,{
    foreignKey:"subject_id"
});


// BK

Student.hasMany(BKCase,{
    foreignKey:"student_id"
});


BKCase.belongsTo(Student,{
    foreignKey:"student_id"
});


module.exports={
    sequelize,
    Role,
    User,
    Student,
    Teacher,
    Class,
    Subject,
    TeachingJournal,
    BKCase,
    BKCounselingNote,
    ActivityLog
};