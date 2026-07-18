import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            const msg = err.response?.data?.message || "Login gagal. Coba lagi.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }


    return (

        <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
        ">


            <div className="
            bg-white
            shadow-xl
            rounded-xl
            p-8
            w-96
            ">


                <h1 className="
                text-3xl
                font-bold
                text-blue-700
                text-center
                ">
                    EduScale
                </h1>


                <p className="
                text-center
                text-gray-500
                mb-6
                ">
                    School Management System
                </p>


                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}


                <form onSubmit={handleLogin}>

                    <input
                        className="
                        w-full
                        border
                        rounded-lg
                        p-3
                        mb-3
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />


                    <input
                        className="
                        w-full
                        border
                        rounded-lg
                        p-3
                        mb-5
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        "
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        w-full
                        bg-blue-700
                        text-white
                        p-3
                        rounded-lg
                        hover:bg-blue-800
                        transition-colors
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Memproses..." : "LOGIN"}
                    </button>

                </form>


            </div>


        </div>


    );
}