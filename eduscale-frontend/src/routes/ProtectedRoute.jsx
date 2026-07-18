import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({ children, allowedRoles }) {

    const { isAuthenticated, user } = useAuth();


    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }


    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-100">
                    <div className="bg-white shadow-xl rounded-xl p-8 text-center">
                        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
                        <p className="text-gray-600 text-lg mb-2">Akses Ditolak</p>
                        <p className="text-gray-400">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                    </div>
                </div>
            );
        }
    }


    return children;
}
