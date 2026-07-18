const {
    BKCase,
    BKCounselingNote,
    Violation,
    Achievement,
    Student,
    Teacher,
    Class
} = require("../models");
const { Op } = require("sequelize");
const logActivity = require("../utils/logActivity");


// ============================================
// BK CASES
// ============================================

// Get All BK Cases
exports.getAllCases = async (req, res) => {
    try {
        const { search, status, class_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;

        const includeStudent = {
            model: Student,
            attributes: ["id", "name", "nis", "class_id"],
            include: [{ model: Class, attributes: ["id", "name"] }]
        };

        if (search) {
            includeStudent.where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { nis: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }

        if (class_id) {
            includeStudent.where = {
                ...includeStudent.where,
                class_id
            };
        }

        const { count, rows } = await BKCase.findAndCountAll({
            where,
            include: [includeStudent],
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            data: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create BK Case
exports.createCase = async (req, res) => {
    try {
        const bkCase = await BKCase.create(req.body);

        const student = await Student.findByPk(req.body.student_id);

        await logActivity(
            req.user.id,
            "Tambah Kasus BK",
            `Menambahkan kasus BK untuk siswa: ${student ? student.name : "Unknown"}`
        );

        res.status(201).json({
            message: "Kasus BK berhasil ditambahkan",
            data: bkCase
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update BK Case
exports.updateCase = async (req, res) => {
    try {
        const bkCase = await BKCase.findByPk(req.params.id);

        if (!bkCase) {
            return res.status(404).json({ message: "Kasus BK tidak ditemukan" });
        }

        await bkCase.update(req.body);

        await logActivity(
            req.user.id,
            "Update Kasus BK",
            `Mengupdate kasus BK ID: ${bkCase.id}`
        );

        res.json({
            message: "Kasus BK berhasil diupdate",
            data: bkCase
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete BK Case
exports.deleteCase = async (req, res) => {
    try {
        const bkCase = await BKCase.findByPk(req.params.id);

        if (!bkCase) {
            return res.status(404).json({ message: "Kasus BK tidak ditemukan" });
        }

        await bkCase.destroy();

        await logActivity(
            req.user.id,
            "Hapus Kasus BK",
            `Menghapus kasus BK ID: ${req.params.id}`
        );

        res.json({ message: "Kasus BK berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ============================================
// COUNSELING NOTES
// ============================================

// Get All Counseling Notes
exports.getAllCounseling = async (req, res) => {
    try {
        const { student_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (student_id) where.student_id = student_id;

        const { count, rows } = await BKCounselingNote.findAndCountAll({
            where,
            include: [
                {
                    model: Student,
                    attributes: ["id", "name", "nis"],
                    include: [{ model: Class, attributes: ["id", "name"] }]
                },
                { model: Teacher, attributes: ["id", "name"] }
            ],
            order: [["date", "DESC"], ["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            data: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Counseling Note
exports.createCounseling = async (req, res) => {
    try {
        const note = await BKCounselingNote.create(req.body);

        await logActivity(
            req.user.id,
            "Tambah Konseling",
            `Menambahkan catatan konseling`
        );

        res.status(201).json({
            message: "Catatan konseling berhasil ditambahkan",
            data: note
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Counseling Note
exports.updateCounseling = async (req, res) => {
    try {
        const note = await BKCounselingNote.findByPk(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Catatan konseling tidak ditemukan" });
        }

        await note.update(req.body);

        res.json({
            message: "Catatan konseling berhasil diupdate",
            data: note
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Counseling Note
exports.deleteCounseling = async (req, res) => {
    try {
        const note = await BKCounselingNote.findByPk(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Catatan konseling tidak ditemukan" });
        }

        await note.destroy();

        res.json({ message: "Catatan konseling berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ============================================
// VIOLATIONS
// ============================================

// Get All Violations
exports.getAllViolations = async (req, res) => {
    try {
        const { student_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (student_id) where.student_id = student_id;

        const { count, rows } = await Violation.findAndCountAll({
            where,
            include: [
                {
                    model: Student,
                    attributes: ["id", "name", "nis"],
                    include: [{ model: Class, attributes: ["id", "name"] }]
                },
                { model: Teacher, attributes: ["id", "name"] }
            ],
            order: [["date", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            data: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Violation
exports.createViolation = async (req, res) => {
    try {
        const violation = await Violation.create(req.body);

        const student = await Student.findByPk(req.body.student_id);

        await logActivity(
            req.user.id,
            "Input Pelanggaran",
            `Mencatat pelanggaran siswa: ${student ? student.name : "Unknown"}`
        );

        res.status(201).json({
            message: "Pelanggaran berhasil dicatat",
            data: violation
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Violation
exports.updateViolation = async (req, res) => {
    try {
        const violation = await Violation.findByPk(req.params.id);

        if (!violation) {
            return res.status(404).json({ message: "Data pelanggaran tidak ditemukan" });
        }

        await violation.update(req.body);

        res.json({
            message: "Data pelanggaran berhasil diupdate",
            data: violation
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Violation
exports.deleteViolation = async (req, res) => {
    try {
        const violation = await Violation.findByPk(req.params.id);

        if (!violation) {
            return res.status(404).json({ message: "Data pelanggaran tidak ditemukan" });
        }

        await violation.destroy();

        res.json({ message: "Data pelanggaran berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ============================================
// ACHIEVEMENTS
// ============================================

// Get All Achievements
exports.getAllAchievements = async (req, res) => {
    try {
        const { student_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (student_id) where.student_id = student_id;

        const { count, rows } = await Achievement.findAndCountAll({
            where,
            include: [
                {
                    model: Student,
                    attributes: ["id", "name", "nis"],
                    include: [{ model: Class, attributes: ["id", "name"] }]
                }
            ],
            order: [["date", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            data: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Achievement
exports.createAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.create(req.body);

        const student = await Student.findByPk(req.body.student_id);

        await logActivity(
            req.user.id,
            "Input Prestasi",
            `Mencatat prestasi siswa: ${student ? student.name : "Unknown"}`
        );

        res.status(201).json({
            message: "Prestasi berhasil dicatat",
            data: achievement
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Achievement
exports.updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByPk(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: "Data prestasi tidak ditemukan" });
        }

        await achievement.update(req.body);

        res.json({
            message: "Data prestasi berhasil diupdate",
            data: achievement
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Achievement
exports.deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByPk(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: "Data prestasi tidak ditemukan" });
        }

        await achievement.destroy();

        res.json({ message: "Data prestasi berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ============================================
// REKAP
// ============================================

// Get Rekap by Student
exports.getRekapByStudent = async (req, res) => {
    try {
        const student_id = req.params.student_id;

        const student = await Student.findByPk(student_id, {
            include: [{ model: Class, attributes: ["id", "name"] }]
        });

        if (!student) {
            return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        const cases = await BKCase.findAll({
            where: { student_id },
            order: [["createdAt", "DESC"]]
        });

        const counselings = await BKCounselingNote.findAll({
            where: { student_id },
            include: [{ model: Teacher, attributes: ["id", "name"] }],
            order: [["date", "DESC"]]
        });

        const violations = await Violation.findAll({
            where: { student_id },
            include: [{ model: Teacher, attributes: ["id", "name"] }],
            order: [["date", "DESC"]]
        });

        const achievements = await Achievement.findAll({
            where: { student_id },
            order: [["date", "DESC"]]
        });

        res.json({
            student,
            summary: {
                total_cases: cases.length,
                total_counselings: counselings.length,
                total_violations: violations.length,
                total_achievements: achievements.length,
                total_violation_points: violations.reduce((sum, v) => sum + (v.points || 0), 0)
            },
            cases,
            counselings,
            violations,
            achievements
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Rekap by Class
exports.getRekapByClass = async (req, res) => {
    try {
        const classes = await Class.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]]
        });

        const result = [];

        for (const cls of classes) {
            const studentIds = await Student.findAll({
                where: { class_id: cls.id },
                attributes: ["id"],
                raw: true
            });
            const ids = studentIds.map(s => s.id);

            const totalCases = ids.length > 0 ? await BKCase.count({
                where: { student_id: { [Op.in]: ids } }
            }) : 0;

            const totalViolations = ids.length > 0 ? await Violation.count({
                where: { student_id: { [Op.in]: ids } }
            }) : 0;

            const totalAchievements = ids.length > 0 ? await Achievement.count({
                where: { student_id: { [Op.in]: ids } }
            }) : 0;

            result.push({
                class_id: cls.id,
                class_name: cls.name,
                total_students: ids.length,
                total_cases: totalCases,
                total_violations: totalViolations,
                total_achievements: totalAchievements
            });
        }

        res.json({ data: result });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
