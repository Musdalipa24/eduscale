const {
    Student,
    Teacher,
    Class,
    BKCase,
    TeachingJournal,
    ActivityLog,
    User,
    Role
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");


// Get Dashboard Stats
exports.getStats = async (req, res) => {
    try {
        const totalStudents = await Student.count({ where: { status: "Aktif" } });
        const totalTeachers = await Teacher.count();
        const totalClasses = await Class.count();
        const activeBKCases = await BKCase.count({ where: { status: "Proses" } });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const journalsThisMonth = await TeachingJournal.count({
            where: {
                date: {
                    [Op.between]: [
                        startOfMonth.toISOString().split("T")[0],
                        endOfMonth.toISOString().split("T")[0]
                    ]
                }
            }
        });

        res.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            activeBKCases,
            journalsThisMonth
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Recent Activities
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name"],
                    include: [{ model: Role, attributes: ["name"] }]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: 10
        });

        res.json({ data: activities });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Chart Data
exports.getChartData = async (req, res) => {
    try {
        // Students per class
        const classes = await Class.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]]
        });

        const studentsPerClass = [];
        for (const cls of classes) {
            const count = await Student.count({
                where: { class_id: cls.id, status: "Aktif" }
            });
            studentsPerClass.push({
                class_name: cls.name,
                count
            });
        }

        // Journals per month (last 6 months)
        const journalsPerMonth = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

            const count = await TeachingJournal.count({
                where: {
                    date: {
                        [Op.between]: [
                            startOfMonth.toISOString().split("T")[0],
                            endOfMonth.toISOString().split("T")[0]
                        ]
                    }
                }
            });

            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
            ];

            journalsPerMonth.push({
                month: monthNames[monthDate.getMonth()],
                year: monthDate.getFullYear(),
                count
            });
        }

        res.json({
            studentsPerClass,
            journalsPerMonth
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
