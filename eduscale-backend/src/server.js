// Load environment variable terlebih dahulu
require("dotenv").config();

// Import Express App
const app = require("./app");

// Import Database Sequelize
const sequelize = require("./config/database");

// Port Server
const PORT = process.env.PORT || 5000;


// ============================================
// Start Server Function
// ============================================

const startServer = async () => {
    try {
        // Mengecek koneksi PostgreSQL
        await sequelize.authenticate();
        console.log(
            "✅ Database Connected"
        );

        // Membuat tabel berdasarkan Sequelize Model
        await sequelize.sync({
            alter: true
        });
        console.log(
            "✅ Database Synchronized"
        );

        // Menjalankan Express Server
        app.listen(PORT, () => {
            console.log(
                `🚀 Server running on port ${PORT}`
            );
            console.log(
                `🌐 Access: http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "❌ Database Connection Error:"
        );
        console.error(
            error.message
        );
        process.exit(1);
    }
};

// Jalankan Server

startServer();