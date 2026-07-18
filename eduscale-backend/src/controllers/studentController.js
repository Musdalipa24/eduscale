const { Student, Class } = require("../models");
const { Op } = require("sequelize");
const logActivity = require("../utils/logActivity");


// Get All Students
exports.getAll = async (req, res) => {
    try {
        const { search, class_id, status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { nis: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (class_id) where.class_id = class_id;
        if (status) where.status = status;

        const { count, rows } = await Student.findAndCountAll({
            where,
            include: [{ model: Class, attributes: ["id", "name"] }],
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


// Get Student By ID
exports.getById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [{ model: Class, attributes: ["id", "name"] }]
        });

        if (!student) {
            return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Student
exports.create = async (req, res) => {
    try {
        const student = await Student.create(req.body);

        await logActivity(
            req.user.id,
            "Tambah Siswa",
            `Menambahkan siswa: ${student.name}`
        );

        res.status(201).json({
            message: "Siswa berhasil ditambahkan",
            student
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Student
exports.update = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        await student.update(req.body);

        await logActivity(
            req.user.id,
            "Update Siswa",
            `Mengupdate data siswa: ${student.name}`
        );

        res.json({
            message: "Siswa berhasil diupdate",
            student
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Student
exports.delete = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        const name = student.name;
        await student.destroy();

        await logActivity(
            req.user.id,
            "Hapus Siswa",
            `Menghapus siswa: ${name}`
        );

        res.json({ message: "Siswa berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Student Status
exports.updateStatus = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        const { status } = req.body;
        await student.update({ status });

        await logActivity(
            req.user.id,
            "Update Status Siswa",
            `Status siswa ${student.name} diubah menjadi: ${status}`
        );

        res.json({
            message: "Status siswa berhasil diupdate",
            student
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Import Students from CSV data
exports.importStudents = async (req, res) => {
    try {
        const { students } = req.body;

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: "Data siswa tidak valid" });
        }

        const created = await Student.bulkCreate(students, {
            ignoreDuplicates: true
        });

        await logActivity(
            req.user.id,
            "Import Siswa",
            `Mengimport ${created.length} data siswa`
        );

        res.status(201).json({
            message: `${created.length} siswa berhasil diimport`,
            count: created.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Export Students
exports.exportStudents = async (req, res) => {
    try {
        const { class_id, status } = req.query;
        const where = {};

        if (class_id) where.class_id = class_id;
        if (status) where.status = status;

        const students = await Student.findAll({
            where,
            include: [{ model: Class, attributes: ["name"] }],
            order: [["name", "ASC"]],
            raw: true,
            nest: true
        });

        const data = students.map(s => ({
            NIS: s.nis || "",
            Nama: s.name,
            Gender: s.gender || "",
            Kelas: s.class ? s.class.name : "",
            Status: s.status,
            Alamat: s.address || "",
            Telepon: s.phone || "",
            Tempat_Lahir: s.birth_place || "",
            Tanggal_Lahir: s.birth_date || "",
            Nama_Orang_Tua: s.parent_name || "",
            Telepon_Orang_Tua: s.parent_phone || ""
        }));

        res.json({ data });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
