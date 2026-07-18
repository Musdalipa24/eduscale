import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";


const pageTitles = {
    "/dashboard": "Dashboard",
    "/students": "Data Siswa",
    "/teachers": "Data Guru",
    "/classes": "Data Kelas",
    "/teaching-journal": "Jurnal Mengajar",
    "/bk": "Bimbingan Konseling",
    "/users": "Manajemen User",
    "/audit-log": "Audit Log",
    "/settings": "Pengaturan",
    "/change-password": "Ganti Password"
};


export default function Navbar() {

    const { user } = useAuth();
    const location = useLocation();

    const pageTitle = pageTitles[location.pathname] || "EduScale";


    return (

        <div className="
        h-16
        bg-white
        shadow
        flex
        justify-between
        items-center
        px-6
        ">


            <h2 className="
            font-semibold
            text-lg
            text-gray-700
            ">
                {pageTitle}
            </h2>


            <div className="flex items-center gap-4">

                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={20} />
                </button>

                <div className="text-right">
                    <p className="font-semibold text-gray-700 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.role}</p>
                </div>

                <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                </div>

            </div>


        </div>

    );
}