import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);


    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });

        const { token: newToken, user: userData } = res.data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);

        return userData;
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };


    const isAuthenticated = !!token && !!user;


    const hasRole = (...roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Memuat...</p>
            </div>
        );
    }


    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            login,
            logout,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}


export default AuthContext;
