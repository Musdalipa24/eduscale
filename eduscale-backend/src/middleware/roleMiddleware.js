const { Role } = require("../models");


const authorizeRoles = (...allowedRoles) => {

    return async (req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    message: "Autentikasi diperlukan"
                });
            }


            const role = await Role.findByPk(req.user.role_id);

            if (!role) {
                return res.status(403).json({
                    message: "Role tidak ditemukan"
                });
            }


            if (!allowedRoles.includes(role.name)) {
                return res.status(403).json({
                    message: "Anda tidak memiliki akses"
                });
            }


            req.userRole = role.name;
            next();


        } catch (error) {

            return res.status(500).json({
                message: error.message
            });

        }

    };

};


module.exports = authorizeRoles;
