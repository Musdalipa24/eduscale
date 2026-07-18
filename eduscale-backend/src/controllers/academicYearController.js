const { AcademicYear, Semester } = require("../models");
const logActivity = require("../utils/logActivity");


// Get All Academic Years
exports.getAllYears = async (req, res) => {
    try {
        const years = await AcademicYear.findAll({
            include: [{ model: Semester }],
            order: [["id", "DESC"]]
        });

        res.json({ data: years });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Academic Year
exports.createYear = async (req, res) => {
    try {
        const year = await AcademicYear.create(req.body);

        await logActivity(
            req.user.id,
            "Tambah Tahun Ajaran",
            `Menambahkan tahun ajaran: ${year.name}`
        );

        res.status(201).json({
            message: "Tahun ajaran berhasil ditambahkan",
            data: year
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Academic Year
exports.updateYear = async (req, res) => {
    try {
        const year = await AcademicYear.findByPk(req.params.id);

        if (!year) {
            return res.status(404).json({ message: "Tahun ajaran tidak ditemukan" });
        }

        await year.update(req.body);

        res.json({
            message: "Tahun ajaran berhasil diupdate",
            data: year
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Academic Year
exports.deleteYear = async (req, res) => {
    try {
        const year = await AcademicYear.findByPk(req.params.id);

        if (!year) {
            return res.status(404).json({ message: "Tahun ajaran tidak ditemukan" });
        }

        await year.destroy();

        res.json({ message: "Tahun ajaran berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create Semester
exports.createSemester = async (req, res) => {
    try {
        const semester = await Semester.create(req.body);

        res.status(201).json({
            message: "Semester berhasil ditambahkan",
            data: semester
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Semester
exports.updateSemester = async (req, res) => {
    try {
        const semester = await Semester.findByPk(req.params.id);

        if (!semester) {
            return res.status(404).json({ message: "Semester tidak ditemukan" });
        }

        await semester.update(req.body);

        res.json({
            message: "Semester berhasil diupdate",
            data: semester
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get All Semesters
exports.getAllSemesters = async (req, res) => {
    try {
        const semesters = await Semester.findAll({
            include: [{ model: AcademicYear, attributes: ["id", "name"] }],
            order: [["id", "DESC"]]
        });

        res.json({ data: semesters });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
