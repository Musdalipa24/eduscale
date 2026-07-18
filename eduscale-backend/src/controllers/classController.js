const { Class, Teacher, Student, AcademicYear } = require("../models");
const logActivity = require("../utils/logActivity");


// Get All Classes
exports.getAll = async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [
                {
                    model: Teacher,
                    as: "wali_kelas",
                    attributes: ["id", "name"]
                },
                {
                    model: AcademicYear,
                    attributes: ["id", "name"]
                }
            ],
            order: [["name", "ASC"]]
        });

        // Count students per class
        const result = [];
        for (const cls of classes) {
            const studentCount = await Student.count({
                where: { class_id: cls.id }
            });
            const classData = cls.toJSON();
            classData.student_count = studentCount;
            result.push(classData);
        }

        res.json({ data: result });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Class By ID
exports.getById = async (req, res) => {
    try {
        const cls = await Class.findByPk(req.params.id, {
            include: [
                {
                    model: Teacher,
                    as: "wali_kelas",
                    attributes: ["id", "name"]
                }
            ]
        });

        if (!cls) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }

        res.json(cls);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Class
exports.create = async (req, res) => {
    try {
        const cls = await Class.create(req.body);

        await logActivity(
            req.user.id,
            "Tambah Kelas",
            `Menambahkan kelas: ${cls.name}`
        );

        res.status(201).json({
            message: "Kelas berhasil ditambahkan",
            class: cls
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Class
exports.update = async (req, res) => {
    try {
        const cls = await Class.findByPk(req.params.id);

        if (!cls) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }

        await cls.update(req.body);

        await logActivity(
            req.user.id,
            "Update Kelas",
            `Mengupdate kelas: ${cls.name}`
        );

        res.json({
            message: "Kelas berhasil diupdate",
            class: cls
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Class
exports.delete = async (req, res) => {
    try {
        const cls = await Class.findByPk(req.params.id);

        if (!cls) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }

        const name = cls.name;
        await cls.destroy();

        await logActivity(
            req.user.id,
            "Hapus Kelas",
            `Menghapus kelas: ${name}`
        );

        res.json({ message: "Kelas berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Students by Class
exports.getStudentsByClass = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { class_id: req.params.id },
            order: [["name", "ASC"]]
        });

        res.json({ data: students });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
