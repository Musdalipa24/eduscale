require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

const {
    Role,
    User,
    AcademicYear,
    Semester,
    Class,
    Teacher,
    Student,
    Subject,
    TeachingJournal,
    BKCase,
    BKCounselingNote,
    ActivityLog
} = require("../models");


const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database Connected");

        await sequelize.sync({ alter: true });
        console.log("✅ Database Synchronized");


        // =====================
        // ROLES
        // =====================
        const roles = [
            { name: "Admin" },
            { name: "Kepala Sekolah" },
            { name: "Guru" },
            { name: "Guru BK" },
            { name: "Wali Kelas" },
            { name: "Siswa" },
            { name: "Orang Tua" }
        ];

        for (const role of roles) {
            await Role.findOrCreate({
                where: { name: role.name },
                defaults: role
            });
        }
        console.log("✅ Roles seeded");


        // =====================
        // USERS
        // =====================
        const allRoles = await Role.findAll();
        const getRoleId = (name) => allRoles.find(r => r.name === name).id;

        const users = [
            { name: "Administrator", email: "admin@eduscale.com", password: "admin123", role_id: getRoleId("Admin") },
            { name: "Dr. Budi Santoso", email: "kepsek@eduscale.com", password: "kepsek123", role_id: getRoleId("Kepala Sekolah") },
            { name: "Siti Rahmawati", email: "guru@eduscale.com", password: "guru123", role_id: getRoleId("Guru") },
            { name: "Ahmad Fauzi", email: "bk@eduscale.com", password: "bk123", role_id: getRoleId("Guru BK") },
            { name: "Dewi Lestari", email: "walikelas@eduscale.com", password: "walikelas123", role_id: getRoleId("Wali Kelas") },
            { name: "Andi Pratama", email: "siswa@eduscale.com", password: "siswa123", role_id: getRoleId("Siswa") },
            { name: "Hj. Sriwardani", email: "ortu@eduscale.com", password: "ortu123", role_id: getRoleId("Orang Tua") }
        ];

        for (const userData of users) {
            const existing = await User.findOne({ where: { email: userData.email } });
            if (!existing) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await User.create({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    role_id: userData.role_id
                });
            }
        }
        console.log("✅ Users seeded");


        // =====================
        // ACADEMIC YEAR & SEMESTER
        // =====================
        const [academicYear] = await AcademicYear.findOrCreate({
            where: { name: "2024/2025" },
            defaults: { name: "2024/2025", is_active: true }
        });

        const [sem1] = await Semester.findOrCreate({
            where: { name: "Ganjil", academic_year_id: academicYear.id },
            defaults: { name: "Ganjil", academic_year_id: academicYear.id, is_active: false }
        });

        const [sem2] = await Semester.findOrCreate({
            where: { name: "Genap", academic_year_id: academicYear.id },
            defaults: { name: "Genap", academic_year_id: academicYear.id, is_active: true }
        });
        console.log("✅ Academic Year & Semesters seeded");


        // =====================
        // TEACHERS
        // =====================
        const guruUser = await User.findOne({ where: { email: "guru@eduscale.com" } });
        const waliKelasUser = await User.findOne({ where: { email: "walikelas@eduscale.com" } });
        const bkUser = await User.findOne({ where: { email: "bk@eduscale.com" } });

        const teachersData = [
            { nip: "198501012010011001", name: "Siti Rahmawati", gender: "Perempuan", phone: "081234567890", user_id: guruUser ? guruUser.id : null },
            { nip: "198602022011012002", name: "Dewi Lestari", gender: "Perempuan", phone: "081234567891", user_id: waliKelasUser ? waliKelasUser.id : null },
            { nip: "198703032012013003", name: "Ahmad Fauzi", gender: "Laki-laki", phone: "081234567892", user_id: bkUser ? bkUser.id : null },
            { nip: "198804042013014004", name: "Bambang Wijaya", gender: "Laki-laki", phone: "081234567893" },
            { nip: "198905052014015005", name: "Nur Hidayah", gender: "Perempuan", phone: "081234567894" }
        ];

        const teachers = [];
        for (const t of teachersData) {
            const [teacher] = await Teacher.findOrCreate({
                where: { nip: t.nip },
                defaults: t
            });
            teachers.push(teacher);
        }
        console.log("✅ Teachers seeded");


        // =====================
        // CLASSES
        // =====================
        const classesData = [
            { name: "X-A", wali_kelas_id: teachers[1].id, academic_year_id: academicYear.id },
            { name: "X-B", wali_kelas_id: teachers[3].id, academic_year_id: academicYear.id },
            { name: "XI-A", wali_kelas_id: teachers[0].id, academic_year_id: academicYear.id },
            { name: "XI-B", wali_kelas_id: teachers[4].id, academic_year_id: academicYear.id },
            { name: "XII-A", academic_year_id: academicYear.id }
        ];

        const classes = [];
        for (const c of classesData) {
            const [cls] = await Class.findOrCreate({
                where: { name: c.name },
                defaults: c
            });
            classes.push(cls);
        }
        console.log("✅ Classes seeded");


        // =====================
        // SUBJECTS
        // =====================
        const subjectsData = [
            { name: "Matematika", teacher_id: teachers[0].id },
            { name: "Bahasa Indonesia", teacher_id: teachers[1].id },
            { name: "Bahasa Inggris", teacher_id: teachers[3].id },
            { name: "Fisika", teacher_id: teachers[4].id },
            { name: "Biologi" }
        ];

        const subjects = [];
        for (const s of subjectsData) {
            const [subject] = await Subject.findOrCreate({
                where: { name: s.name },
                defaults: s
            });
            subjects.push(subject);
        }
        console.log("✅ Subjects seeded");


        // =====================
        // STUDENTS
        // =====================
        const studentsData = [
            { nis: "2024001", name: "Andi Pratama", gender: "Laki-laki", class_id: classes[0].id, status: "Aktif", birth_place: "Makassar", birth_date: "2008-05-15", parent_name: "Hj. Sriwardani", parent_phone: "081111111111" },
            { nis: "2024002", name: "Budi Setiawan", gender: "Laki-laki", class_id: classes[0].id, status: "Aktif", birth_place: "Jakarta", birth_date: "2008-03-20", parent_name: "Suharto", parent_phone: "081222222222" },
            { nis: "2024003", name: "Citra Dewi", gender: "Perempuan", class_id: classes[0].id, status: "Aktif", birth_place: "Bandung", birth_date: "2008-07-10", parent_name: "Dewi Sartika", parent_phone: "081333333333" },
            { nis: "2024004", name: "Dian Permata", gender: "Perempuan", class_id: classes[1].id, status: "Aktif", birth_place: "Surabaya", birth_date: "2008-01-25" },
            { nis: "2024005", name: "Eko Prasetyo", gender: "Laki-laki", class_id: classes[1].id, status: "Aktif", birth_place: "Yogyakarta", birth_date: "2008-11-30" },
            { nis: "2024006", name: "Fitri Handayani", gender: "Perempuan", class_id: classes[2].id, status: "Aktif", birth_place: "Semarang", birth_date: "2007-04-12" },
            { nis: "2024007", name: "Gunawan Wibowo", gender: "Laki-laki", class_id: classes[2].id, status: "Aktif", birth_place: "Medan", birth_date: "2007-08-18" },
            { nis: "2024008", name: "Hani Susanti", gender: "Perempuan", class_id: classes[3].id, status: "Aktif", birth_place: "Palembang", birth_date: "2007-02-14" },
            { nis: "2024009", name: "Irfan Hakim", gender: "Laki-laki", class_id: classes[3].id, status: "Pindah", birth_place: "Denpasar", birth_date: "2007-06-22" },
            { nis: "2024010", name: "Jasmine Putri", gender: "Perempuan", class_id: classes[4].id, status: "Aktif", birth_place: "Pontianak", birth_date: "2006-09-05" }
        ];

        const students = [];
        for (const s of studentsData) {
            const [student] = await Student.findOrCreate({
                where: { nis: s.nis },
                defaults: s
            });
            students.push(student);
        }
        console.log("✅ Students seeded");


        // =====================
        // TEACHING JOURNALS
        // =====================
        const journalsData = [
            { teacher_id: teachers[0].id, class_id: classes[0].id, subject_id: subjects[0].id, semester_id: sem2.id, date: "2025-01-15", material: "Persamaan Linear", method: "Ceramah & Diskusi", note: "Siswa aktif berdiskusi" },
            { teacher_id: teachers[0].id, class_id: classes[1].id, subject_id: subjects[0].id, semester_id: sem2.id, date: "2025-01-16", material: "Pertidaksamaan Linear", method: "Latihan Soal", note: "Perlu remedial untuk beberapa siswa" },
            { teacher_id: teachers[1].id, class_id: classes[0].id, subject_id: subjects[1].id, semester_id: sem2.id, date: "2025-01-15", material: "Teks Narasi", method: "Presentasi", note: "Tugas dikumpulkan minggu depan" },
            { teacher_id: teachers[3].id, class_id: classes[2].id, subject_id: subjects[2].id, semester_id: sem2.id, date: "2025-01-17", material: "Present Perfect Tense", method: "Role Play", note: "Siswa antusias" }
        ];

        for (const j of journalsData) {
            await TeachingJournal.findOrCreate({
                where: { teacher_id: j.teacher_id, class_id: j.class_id, date: j.date, subject_id: j.subject_id },
                defaults: j
            });
        }
        console.log("✅ Teaching Journals seeded");


        // =====================
        // BK CASES
        // =====================
        const casesData = [
            { student_id: students[0].id, case_type: "Pelanggaran", description: "Terlambat masuk sekolah 3 kali berturut-turut", status: "Proses" },
            { student_id: students[4].id, case_type: "Konseling", description: "Konsultasi masalah belajar", status: "Selesai" },
            { student_id: students[6].id, case_type: "Pelanggaran", description: "Tidak mengerjakan tugas berulang kali", status: "Proses" }
        ];

        for (const c of casesData) {
            await BKCase.findOrCreate({
                where: { student_id: c.student_id, description: c.description },
                defaults: c
            });
        }
        console.log("✅ BK Cases seeded");


        // =====================
        // COUNSELING NOTES
        // =====================
        const counselingData = [
            { student_id: students[0].id, teacher_id: teachers[2].id, date: "2025-01-18", type: "Individual", note: "Siswa mengaku sering tidur larut malam", result: "Membuat jadwal belajar bersama", follow_up: "Monitoring 2 minggu ke depan" }
        ];

        for (const c of counselingData) {
            await BKCounselingNote.findOrCreate({
                where: { student_id: c.student_id, date: c.date },
                defaults: c
            });
        }
        console.log("✅ Counseling Notes seeded");


        // =====================
        // ACTIVITY LOGS
        // =====================
        const adminUser = await User.findOne({ where: { email: "admin@eduscale.com" } });

        if (adminUser) {
            const activityData = [
                { user_id: adminUser.id, activity: "Login", description: "Admin login ke sistem" },
                { user_id: adminUser.id, activity: "Tambah Siswa", description: "Menambahkan data siswa baru" },
                { user_id: adminUser.id, activity: "Update Kelas", description: "Mengupdate data kelas X-A" }
            ];

            for (const a of activityData) {
                await ActivityLog.create(a);
            }
        }
        console.log("✅ Activity Logs seeded");


        console.log("\n🎉 Semua data berhasil di-seed!");
        console.log("\n📋 Akun Demo:");
        console.log("  Admin       : admin@eduscale.com / admin123");
        console.log("  Kepsek      : kepsek@eduscale.com / kepsek123");
        console.log("  Guru        : guru@eduscale.com / guru123");
        console.log("  Guru BK     : bk@eduscale.com / bk123");
        console.log("  Wali Kelas  : walikelas@eduscale.com / walikelas123");
        console.log("  Siswa       : siswa@eduscale.com / siswa123");
        console.log("  Orang Tua   : ortu@eduscale.com / ortu123");

        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding Error:", error.message);
        console.error(error);
        process.exit(1);
    }
};


seed();
