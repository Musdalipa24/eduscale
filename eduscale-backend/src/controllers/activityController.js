const { ActivityLog, User, Role } = require("../models");
const { Op } = require("sequelize");


// Get All Activity Logs
exports.getAll = async (req, res) => {
    try {
        const { user_id, date_from, date_to, page = 1, limit = 30 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (user_id) where.user_id = user_id;

        if (date_from && date_to) {
            where.createdAt = {
                [Op.between]: [
                    new Date(date_from + "T00:00:00"),
                    new Date(date_to + "T23:59:59")
                ]
            };
        }

        const { count, rows } = await ActivityLog.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                    include: [{ model: Role, attributes: ["name"] }]
                }
            ],
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
