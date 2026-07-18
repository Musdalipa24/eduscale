import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { KeyRound } from "lucide-react";


export default function ChangePassword() {
    const [form, setForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");

        if (form.new_password !== form.confirm_password) {
            setError("Konfirmasi password tidak cocok");
            return;
        }

        if (form.new_password.length < 6) {
            setError("Password baru minimal 6 karakter");
            return;
        }

        setLoading(true);
        try {
            await api.put("/users/change-password/me", {
                old_password: form.old_password,
                new_password: form.new_password
            });
            setMessage("Password berhasil diubah!");
            setForm({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengubah password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Ganti Password</h1>

            <div className="bg-white rounded-xl shadow p-6 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <KeyRound size={20} className="text-blue-700" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Ubah Password</h2>
                        <p className="text-sm text-gray-400">Masukkan password lama dan password baru</p>
                    </div>
                </div>

                {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password Lama</label>
                        <input type="password" className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.old_password} onChange={e => setForm({...form, old_password: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password Baru</label>
                        <input type="password" className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.new_password} onChange={e => setForm({...form, new_password: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi Password Baru</label>
                        <input type="password" className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50">
                        {loading ? "Memproses..." : "Ubah Password"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
