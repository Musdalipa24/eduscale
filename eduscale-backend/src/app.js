const express=require("express");
const cors=require("cors");


const app=express();


app.use(cors());

app.use(express.json({ limit: "10mb" }));


// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const teachingJournalRoutes = require("./routes/teachingJournalRoutes");
const bkRoutes = require("./routes/bkRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const academicYearRoutes = require("./routes/academicYearRoutes");
const activityRoutes = require("./routes/activityRoutes");
const roleController = require("./controllers/roleController");
const authMiddleware = require("./middleware/authMiddleware");


app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/journals", teachingJournalRoutes);
app.use("/api/bk", bkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/activities", activityRoutes);

// Roles endpoint
app.get("/api/roles", authMiddleware, roleController.getAll);


app.get("/",(req,res)=>{

res.json({

message:"EduScale API Running"

});

});


module.exports=app;