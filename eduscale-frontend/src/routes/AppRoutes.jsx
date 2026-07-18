import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Classes from "../pages/Classes";
import TeachingJournal from "../pages/TeachingJournal";
import BKCases from "../pages/BKCases";
import Users from "../pages/Users";
import AuditLog from "../pages/AuditLog";
import Settings from "../pages/Settings";
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "./ProtectedRoute";


export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/students"
                    element={
                        <ProtectedRoute allowedRoles={["Admin", "Guru BK", "Wali Kelas", "Kepala Sekolah"]}>
                            <Students />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/teachers"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <Teachers />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/classes"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <Classes />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/teaching-journal"
                    element={
                        <ProtectedRoute allowedRoles={["Admin", "Guru", "Kepala Sekolah", "Wali Kelas"]}>
                            <TeachingJournal />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/bk"
                    element={
                        <ProtectedRoute allowedRoles={["Admin", "Guru BK", "Wali Kelas", "Kepala Sekolah"]}>
                            <BKCases />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/users"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <Users />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/audit-log"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AuditLog />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <Settings />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />


            </Routes>


        </BrowserRouter>

    );

}