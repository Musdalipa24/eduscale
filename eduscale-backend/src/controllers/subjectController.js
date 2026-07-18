const { Subject, Teacher } = require("../models");
const logActivity = require("../utils/logActivity");


// Get All Subjects
exports.getAll = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            include: [
                {
                    model: Teacher,
                    attributes: ["id", "name"]
                }
            ],
            order: [["name", "ASC"]]
        });

        res.json({ data: subjects });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Subject
exports.create = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);

        await logActivity(
            req.user.id,
            "Tambah Mata Pelajaran",
            `Menambahkan mata pelajaran: ${subject.name}`
        );

        res.status(201).json({
            message: "Mata pelajaran berhasil ditambahkan",
            subject
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Subject
exports.update = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: "Mata pelajaran tidak ditemukan" });
        }

        await subject.update(req.body);

        await logActivity(
            req.user.id,
            "Update Mata Pelajaran",
            `Mengupdate mata pelajaran: ${subject.name}`
        );

        res.json({
            message: "Mata pelajaran berhasil diupdate",
            subject
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Subject
exports.delete = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: "Mata pelajaran tidak ditemukan" });
        }

        const name = subject.name;
        await subject.destroy();

        await logActivity(
            req.user.id,
            "Hapus Mata Pelajaran",
            `Menghapus mata pelajaran: ${name}`
        );

        res.json({ message: "Mata pelajaran berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
