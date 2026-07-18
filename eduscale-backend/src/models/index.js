const sequelize = require("../config/database");

const Role = require("./Role");
const User = require("./User");

const Student = require("./Student");
const Teacher = require("./Teacher");
const Class = require("./Class");
const Subject = require("./Subject");

const AcademicYear = require("./AcademicYear");
const Semester = require("./Semester");

const TeachingJournal = require("./TeachingJournal");

const BKCase = require("./BKCase");
const BKCounselingNote = require("./BKCounseling");
const Violation = require("./Violation");
const Achievement = require("./Achievement");

const StudentParent = require("./StudentParent");
const ActivityLog = require("./Activity");


// =====================
// RELATIONSHIPS
// =====================


// Role - User
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });


// AcademicYear - Semester
AcademicYear.hasMany(Semester, { foreignKey: "academic_year_id" });
Semester.belongsTo(AcademicYear, { foreignKey: "academic_year_id" });


// AcademicYear - Class
AcademicYear.hasMany(Class, { foreignKey: "academic_year_id" });
Class.belongsTo(AcademicYear, { foreignKey: "academic_year_id" });


// Class - Student
Class.hasMany(Student, { foreignKey: "class_id" });
Student.belongsTo(Class, { foreignKey: "class_id" });


// Class - Wali Kelas (Teacher)
Teacher.hasMany(Class, { foreignKey: "wali_kelas_id", as: "homeroom_classes" });
Class.belongsTo(Teacher, { foreignKey: "wali_kelas_id", as: "wali_kelas" });


// Teacher - User
User.hasOne(Teacher, { foreignKey: "user_id" });
Teacher.belongsTo(User, { foreignKey: "user_id" });


// Teacher - Subject
Teacher.hasMany(Subject, { foreignKey: "teacher_id" });
Subject.belongsTo(Teacher, { foreignKey: "teacher_id" });


// Teaching Journal
Teacher.hasMany(TeachingJournal, { foreignKey: "teacher_id" });
Class.hasMany(TeachingJournal, { foreignKey: "class_id" });
Subject.hasMany(TeachingJournal, { foreignKey: "subject_id" });
Semester.hasMany(TeachingJournal, { foreignKey: "semester_id" });

TeachingJournal.belongsTo(Teacher, { foreignKey: "teacher_id" });
TeachingJournal.belongsTo(Class, { foreignKey: "class_id" });
TeachingJournal.belongsTo(Subject, { foreignKey: "subject_id" });
TeachingJournal.belongsTo(Semester, { foreignKey: "semester_id" });


// BK Case
Student.hasMany(BKCase, { foreignKey: "student_id" });
BKCase.belongsTo(Student, { foreignKey: "student_id" });


// BK Counseling
Student.hasMany(BKCounselingNote, { foreignKey: "student_id" });
Teacher.hasMany(BKCounselingNote, { foreignKey: "teacher_id" });
BKCounselingNote.belongsTo(Student, { foreignKey: "student_id" });
BKCounselingNote.belongsTo(Teacher, { foreignKey: "teacher_id" });


// Violation
Student.hasMany(Violation, { foreignKey: "student_id" });
Teacher.hasMany(Violation, { foreignKey: "teacher_id" });
Violation.belongsTo(Student, { foreignKey: "student_id" });
Violation.belongsTo(Teacher, { foreignKey: "teacher_id" });


// Achievement
Student.hasMany(Achievement, { foreignKey: "student_id" });
Achievement.belongsTo(Student, { foreignKey: "student_id" });


// Student - Parent (through junction)
Student.hasMany(StudentParent, { foreignKey: "student_id" });
User.hasMany(StudentParent, { foreignKey: "user_id" });
StudentParent.belongsTo(Student, { foreignKey: "student_id" });
StudentParent.belongsTo(User, { foreignKey: "user_id" });


// Activity Log
User.hasMany(ActivityLog, { foreignKey: "user_id" });
ActivityLog.belongsTo(User, { foreignKey: "user_id" });


module.exports = {
    sequelize,
    Role,
    User,
    Student,
    Teacher,
    Class,
    Subject,
    AcademicYear,
    Semester,
    TeachingJournal,
    BKCase,
    BKCounselingNote,
    Violation,
    Achievement,
    StudentParent,
    ActivityLog
};