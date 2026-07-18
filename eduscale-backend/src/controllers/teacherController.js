const { Teacher, User } = require("../models");
const { Op } = require("sequelize");
const logActivity = require("../utils/logActivity");


// Get All Teachers
exports.getAll = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { nip: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Teacher.findAndCountAll({
            where,
            order: [["name", "ASC"]],
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


// Get Teacher By ID
exports.getById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);

        if (!teacher) {
            return res.status(404).json({ message: "Guru tidak ditemukan" });
        }

        res.json(teacher);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Teacher
exports.create = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);

        await logActivity(
            req.user.id,
            "Tambah Guru",
            `Menambahkan guru: ${teacher.name}`
        );

        res.status(201).json({
            message: "Guru berhasil ditambahkan",
            teacher
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Teacher
exports.update = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);

        if (!teacher) {
            return res.status(404).json({ message: "Guru tidak ditemukan" });
        }

        await teacher.update(req.body);

        await logActivity(
            req.user.id,
            "Update Guru",
            `Mengupdate data guru: ${teacher.name}`
        );

        res.json({
            message: "Guru berhasil diupdate",
            teacher
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Teacher
exports.delete = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);

        if (!teacher) {
            return res.status(404).json({ message: "Guru tidak ditemukan" });
        }

        const name = teacher.name;
        await teacher.destroy();

        await logActivity(
            req.user.id,
            "Hapus Guru",
            `Menghapus guru: ${name}`
        );

        res.json({ message: "Guru berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
