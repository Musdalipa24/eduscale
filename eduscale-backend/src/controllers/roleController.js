const { Role } = require("../models");


// Get All Roles
exports.getAll = async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [["id", "ASC"]]
        });

        res.json({ data: roles });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
