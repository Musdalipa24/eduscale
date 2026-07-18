const { TeachingJournal, Teacher, Class, Subject, Semester } = require("../models");
const { Op } = require("sequelize");
const logActivity = require("../utils/logActivity");


// Get All Journals
exports.getAll = async (req, res) => {
    try {
        const { teacher_id, class_id, date_from, date_to, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (teacher_id) where.teacher_id = teacher_id;
        if (class_id) where.class_id = class_id;

        if (date_from && date_to) {
            where.date = { [Op.between]: [date_from, date_to] };
        } else if (date_from) {
            where.date = { [Op.gte]: date_from };
        } else if (date_to) {
            where.date = { [Op.lte]: date_to };
        }

        const { count, rows } = await TeachingJournal.findAndCountAll({
            where,
            include: [
                { model: Teacher, attributes: ["id", "name"] },
                { model: Class, attributes: ["id", "name"] },
                { model: Subject, attributes: ["id", "name"] },
                { model: Semester, attributes: ["id", "name"] }
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


// Get Journal By ID
exports.getById = async (req, res) => {
    try {
        const journal = await TeachingJournal.findByPk(req.params.id, {
            include: [
                { model: Teacher, attributes: ["id", "name"] },
                { model: Class, attributes: ["id", "name"] },
                { model: Subject, attributes: ["id", "name"] }
            ]
        });

        if (!journal) {
            return res.status(404).json({ message: "Jurnal tidak ditemukan" });
        }

        res.json(journal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Journal
exports.create = async (req, res) => {
    try {
        const journal = await TeachingJournal.create(req.body);

        await logActivity(
            req.user.id,
            "Input Jurnal Mengajar",
            `Menginput jurnal mengajar tanggal ${journal.date}`
        );

        res.status(201).json({
            message: "Jurnal berhasil ditambahkan",
            journal
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Journal
exports.update = async (req, res) => {
    try {
        const journal = await TeachingJournal.findByPk(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: "Jurnal tidak ditemukan" });
        }

        await journal.update(req.body);

        await logActivity(
            req.user.id,
            "Update Jurnal Mengajar",
            `Mengupdate jurnal mengajar tanggal ${journal.date}`
        );

        res.json({
            message: "Jurnal berhasil diupdate",
            journal
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Journal
exports.delete = async (req, res) => {
    try {
        const journal = await TeachingJournal.findByPk(req.params.id);

        if (!journal) {
            return res.status(404).json({ message: "Jurnal tidak ditemukan" });
        }

        await journal.destroy();

        await logActivity(
            req.user.id,
            "Hapus Jurnal Mengajar",
            `Menghapus jurnal mengajar`
        );

        res.json({ message: "Jurnal berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Recap by Teacher
exports.getRekapByTeacher = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]]
        });

        const result = [];
        for (const teacher of teachers) {
            const count = await TeachingJournal.count({
                where: { teacher_id: teacher.id }
            });
            result.push({
                teacher_id: teacher.id,
                teacher_name: teacher.name,
                total_journals: count
            });
        }

        res.json({ data: result });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Recap by Class
exports.getRekapByClass = async (req, res) => {
    try {
        const classes = await Class.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]]
        });

        const result = [];
        for (const cls of classes) {
            const count = await TeachingJournal.count({
                where: { class_id: cls.id }
            });
            result.push({
                class_id: cls.id,
                class_name: cls.name,
                total_journals: count
            });
        }

        res.json({ data: result });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
