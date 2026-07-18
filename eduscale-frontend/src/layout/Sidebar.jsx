import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Home,
    Users,
    BookOpen,
    ClipboardList,
    Settings,
    LogOut,
    GraduationCap,
    UserCog,
    FileText,
    School
} from "lucide-react";


export default function Sidebar() {

    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `flex gap-3 items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
                ? "bg-blue-700 text-white font-semibold shadow-lg"
                : "text-blue-100 hover:bg-blue-800 hover:text-white"
        }`;

    return (
        <div className="
        w-64
        bg-blue-900
        text-white
        min-h-screen
        p-5
        flex
        flex-col
        ">

            <h1 className="
            text-2xl
            font-bold
            mb-8
            flex items-center gap-2
            ">
                <School size={28} />
                EduScale
            </h1>

            <nav className="space-y-2 flex-1">

                <NavLink to="/dashboard" className={linkClass}>
                    <Home size={20} />
                    Dashboard
                </NavLink>

                {hasRole("Admin", "Guru BK", "Wali Kelas", "Kepala Sekolah") && (
                    <NavLink to="/students" className={linkClass}>
                        <GraduationCap size={20} />
                        Data Siswa
                    </NavLink>
                )}

                {hasRole("Admin") && (
                    <NavLink to="/teachers" className={linkClass}>
                        <Users size={20} />
                        Data Guru
                    </NavLink>
                )}

                {hasRole("Admin") && (
                    <NavLink to="/classes" className={linkClass}>
                        <School size={20} />
                        Data Kelas
                    </NavLink>
                )}

                {hasRole("Admin", "Guru", "Kepala Sekolah", "Wali Kelas") && (
                    <NavLink to="/teaching-journal" className={linkClass}>
                        <BookOpen size={20} />
                        Jurnal Mengajar
                    </NavLink>
                )}

                {hasRole("Admin", "Guru BK", "Wali Kelas", "Kepala Sekolah") && (
                    <NavLink to="/bk" className={linkClass}>
                        <ClipboardList size={20} />
                        BK
                    </NavLink>
                )}

                {hasRole("Admin") && (
                    <NavLink to="/users" className={linkClass}>
                        <UserCog size={20} />
                        Manajemen User
                    </NavLink>
                )}

                {hasRole("Admin") && (
                    <NavLink to="/audit-log" className={linkClass}>
                        <FileText size={20} />
                        Audit Log
                    </NavLink>
                )}

                {hasRole("Admin") && (
                    <NavLink to="/settings" className={linkClass}>
                        <Settings size={20} />
                        Pengaturan
                    </NavLink>
                )}

            </nav>

            <div className="border-t border-blue-800 pt-4 mt-4">
                <div className="text-blue-200 text-sm mb-3 px-4">
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-xs">{user?.role}</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex gap-3 items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition-all duration-200 w-full"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
}