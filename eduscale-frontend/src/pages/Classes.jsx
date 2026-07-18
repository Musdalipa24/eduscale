import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { Plus, Edit, Trash2, X, Users } from "lucide-react";


export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStudents, setShowStudents] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [form, setForm] = useState({ name: "", wali_kelas_id: "" });

    useEffect(() => { loadClasses(); loadTeachers(); }, []);

    const loadClasses = async () => {
        try { const res = await api.get("/classes"); setClasses(res.data.data); }
        catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const loadTeachers = async () => {
        try { const res = await api.get("/teachers"); setTeachers(res.data.data); }
        catch (error) { console.error(error); }
    };

    const loadClassStudents = async (classId) => {
        try { const res = await api.get(`/classes/${classId}/students`); setClassStudents(res.data.data); }
        catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...form };
            if (!data.wali_kelas_id) data.wali_kelas_id = null;
            if (editing) { await api.put(`/classes/${editing.id}`, data); }
            else { await api.post("/classes", data); }
            setShowModal(false); resetForm(); loadClasses();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name, wali_kelas_id: c.wali_kelas_id || "" });
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Hapus kelas "${name}"?`)) return;
        try { await api.delete(`/classes/${id}`); loadClasses(); }
        catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleViewStudents = (cls) => {
        setShowStudents(cls);
        loadClassStudents(cls.id);
    };

    const resetForm = () => { setEditing(null); setForm({ name: "", wali_kelas_id: "" }); };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Data Kelas</h1>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                    <Plus size={18} /> Tambah Kelas
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    <p className="text-gray-400 col-span-3 text-center py-8">Memuat...</p>
                ) : classes.length === 0 ? (
                    <p className="text-gray-400 col-span-3 text-center py-8">Tidak ada data kelas</p>
                ) : classes.map(c => (
                    <div key={c.id} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-blue-700">{c.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Wali Kelas: {c.wali_kelas?.name || "Belum ditentukan"}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(c)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users size={16} />
                                <span className="font-semibold">{c.student_count || 0}</span>
                                <span className="text-sm">siswa</span>
                            </div>
                            <button onClick={() => handleViewStudents(c)} className="text-blue-600 text-sm hover:underline">Lihat siswa →</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editing ? "Edit Kelas" : "Tambah Kelas"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Nama Kelas *</label>
                                <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Wali Kelas</label>
                                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.wali_kelas_id} onChange={e => setForm({...form, wali_kelas_id: e.target.value})}>
                                    <option value="">Pilih Guru</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select></div>
                            <div className="flex gap-3 pt-3">
                                <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">Simpan</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Students List Modal */}
            {showStudents && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStudents(null)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Siswa Kelas {showStudents.name}</h2>
                            <button onClick={() => setShowStudents(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        {classStudents.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Belum ada siswa di kelas ini</p>
                        ) : (
                            <table className="w-full">
                                <thead><tr className="border-b"><th className="text-left pb-2 text-gray-500">No</th><th className="text-left pb-2 text-gray-500">NIS</th><th className="text-left pb-2 text-gray-500">Nama</th><th className="text-left pb-2 text-gray-500">Gender</th></tr></thead>
                                <tbody>{classStudents.map((s, i) => (
                                    <tr key={s.id} className="border-b last:border-0"><td className="py-2">{i + 1}</td><td className="py-2 font-mono text-sm">{s.nis || "-"}</td><td className="py-2">{s.name}</td><td className="py-2">{s.gender || "-"}</td></tr>
                                ))}</tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
