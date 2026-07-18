import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";


export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ nip: "", name: "", gender: "", phone: "", address: "" });

    useEffect(() => { loadTeachers(); }, [page, search]);

    const loadTeachers = async () => {
        try {
            const params = { page, limit: 15 };
            if (search) params.search = search;
            const res = await api.get("/teachers", { params });
            setTeachers(res.data.data);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/teachers/${editing.id}`, form); }
            else { await api.post("/teachers", form); }
            setShowModal(false); resetForm(); loadTeachers();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleEdit = (t) => {
        setEditing(t);
        setForm({ nip: t.nip || "", name: t.name, gender: t.gender || "", phone: t.phone || "", address: t.address || "" });
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Hapus guru "${name}"?`)) return;
        try { await api.delete(`/teachers/${id}`); loadTeachers(); }
        catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const resetForm = () => { setEditing(null); setForm({ nip: "", name: "", gender: "", phone: "", address: "" }); };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Data Guru</h1>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                    <Plus size={18} /> Tambah Guru
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <Search size={18} className="text-gray-400" />
                    <input type="text" placeholder="Cari nama atau NIP..." className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 font-medium text-gray-500">NIP</th>
                                <th className="text-left p-4 font-medium text-gray-500">Nama</th>
                                <th className="text-left p-4 font-medium text-gray-500">Gender</th>
                                <th className="text-left p-4 font-medium text-gray-500">Telepon</th>
                                <th className="text-left p-4 font-medium text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Memuat...</td></tr>
                            ) : teachers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
                            ) : teachers.map(t => (
                                <tr key={t.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-mono text-sm">{t.nip || "-"}</td>
                                    <td className="p-4 font-medium">{t.name}</td>
                                    <td className="p-4">{t.gender || "-"}</td>
                                    <td className="p-4">{t.phone || "-"}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(t)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(t.id, t.name)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center p-4 border-t">
                    <p className="text-sm text-gray-500">Total: {total} guru</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                        <span className="px-3 py-1 text-sm">Hal {page}/{totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editing ? "Edit Guru" : "Tambah Guru"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">NIP</label>
                                <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.nip} onChange={e => setForm({...form, nip: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Nama *</label>
                                <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                                    <option value="">Pilih</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                                </select></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Telepon</label>
                                <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
                                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                            <div className="flex gap-3 pt-3">
                                <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">Simpan</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
