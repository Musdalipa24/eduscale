const bcrypt = require("bcrypt");
const { User, Role } = require("../models");
const { Op } = require("sequelize");
const logActivity = require("../utils/logActivity");


// Get All Users
exports.getAll = async (req, res) => {
    try {
        const { search, role_id, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (role_id) where.role_id = role_id;

        const { count, rows } = await User.findAndCountAll({
            where,
            include: [{ model: Role, attributes: ["id", "name"] }],
            attributes: { exclude: ["password"] },
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


// Get User By ID
exports.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{ model: Role, attributes: ["id", "name"] }],
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create User
exports.create = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role_id
        });

        await logActivity(
            req.user.id,
            "Tambah User",
            `Menambahkan user: ${name} (${email})`
        );

        res.status(201).json({
            message: "User berhasil dibuat",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update User
exports.update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const { name, email, role_id } = req.body;
        await user.update({ name, email, role_id });

        await logActivity(
            req.user.id,
            "Update User",
            `Mengupdate user: ${user.name}`
        );

        res.json({
            message: "User berhasil diupdate",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete User
exports.delete = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const name = user.name;
        await user.destroy();

        await logActivity(
            req.user.id,
            "Hapus User",
            `Menghapus user: ${name}`
        );

        res.json({ message: "User berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Reset Password (Admin only)
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const { new_password } = req.body;
        const hashedPassword = await bcrypt.hash(new_password, 10);

        await user.update({ password: hashedPassword });

        await logActivity(
            req.user.id,
            "Reset Password",
            `Mereset password user: ${user.name}`
        );

        res.json({ message: "Password berhasil direset" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Change Own Password
exports.changePassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        const { old_password, new_password } = req.body;

        const validPassword = await bcrypt.compare(old_password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Password lama salah" });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await user.update({ password: hashedPassword });

        await logActivity(
            req.user.id,
            "Ganti Password",
            `User mengganti password sendiri`
        );

        res.json({ message: "Password berhasil diubah" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
