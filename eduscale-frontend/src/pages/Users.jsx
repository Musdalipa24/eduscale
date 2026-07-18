import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { Plus, Search, Edit, Trash2, X, KeyRound } from "lucide-react";


export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(null);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState("");
    const [form, setForm] = useState({ name: "", email: "", password: "", role_id: "" });

    useEffect(() => { loadRoles(); }, []);
    useEffect(() => { loadUsers(); }, [page, search, filterRole]);

    const loadUsers = async () => {
        try {
            const params = { page, limit: 15 };
            if (search) params.search = search;
            if (filterRole) params.role_id = filterRole;
            const res = await api.get("/users", { params });
            setUsers(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const loadRoles = async () => {
        try { const res = await api.get("/roles"); setRoles(res.data.data); }
        catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/users/${editing.id}`, { name: form.name, email: form.email, role_id: form.role_id }); }
            else { await api.post("/users", form); }
            setShowModal(false); resetForm(); loadUsers();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleEdit = (u) => {
        setEditing(u);
        setForm({ name: u.name, email: u.email, password: "", role_id: u.role_id });
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Hapus user "${name}"?`)) return;
        try { await api.delete(`/users/${id}`); loadUsers(); }
        catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleResetPassword = async () => {
        if (!newPassword) { alert("Masukkan password baru"); return; }
        try {
            await api.put(`/users/${showResetModal.id}/reset-password`, { new_password: newPassword });
            alert("Password berhasil direset");
            setShowResetModal(null); setNewPassword("");
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const resetForm = () => { setEditing(null); setForm({ name: "", email: "", password: "", role_id: "" }); };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manajemen User</h1>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                    <Plus size={18} /> Tambah User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search size={18} className="text-gray-400" />
                    <input type="text" placeholder="Cari nama atau email..." className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }}>
                    <option value="">Semua Role</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 font-medium text-gray-500">Nama</th>
                                <th className="text-left p-4 font-medium text-gray-500">Email</th>
                                <th className="text-left p-4 font-medium text-gray-500">Role</th>
                                <th className="text-left p-4 font-medium text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Memuat...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
                            ) : users.map(u => (
                                <tr key={u.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{u.role?.name || "-"}</span></td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(u)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg" title="Edit"><Edit size={16} /></button>
                                            <button onClick={() => { setShowResetModal(u); setNewPassword(""); }} className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg" title="Reset Password"><KeyRound size={16} /></button>
                                            <button onClick={() => handleDelete(u.id, u.name)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg" title="Hapus"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center p-4 border-t">
                    <p className="text-sm text-gray-500">Total: {total} user</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                        <span className="px-3 py-1 text-sm">Hal {page}/{totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editing ? "Edit User" : "Tambah User"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Nama *</label>
                                <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                                <input type="email" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                            {!editing && <div><label className="block text-sm font-medium text-gray-600 mb-1">Password *</label>
                                <input type="password" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>}
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Role *</label>
                                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})} required>
                                    <option value="">Pilih Role</option>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                            <div className="flex gap-3 pt-3">
                                <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">Simpan</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResetModal(null)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-2">Reset Password</h2>
                        <p className="text-gray-500 text-sm mb-4">User: {showResetModal.name}</p>
                        <input type="password" placeholder="Password Baru" className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <div className="flex gap-3">
                            <button onClick={handleResetPassword} className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors">Reset</button>
                            <button onClick={() => setShowResetModal(null)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
