const { ActivityLog } = require("../models");


const logActivity = async (user_id, activity, description) => {

    try {

        await ActivityLog.create({
            user_id,
            activity,
            description
        });

    } catch (error) {
        console.error("Error logging activity:", error.message);
    }

};


module.exports = logActivity;
