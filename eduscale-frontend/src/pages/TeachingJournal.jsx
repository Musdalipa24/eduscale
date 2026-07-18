import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit, Trash2, X, Search, BarChart3 } from "lucide-react";


export default function TeachingJournal() {
    const { hasRole } = useAuth();
    const [journals, setJournals] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterTeacher, setFilterTeacher] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("list");
    const [rekapTeacher, setRekapTeacher] = useState([]);
    const [rekapClass, setRekapClass] = useState([]);
    const [form, setForm] = useState({ teacher_id: "", class_id: "", subject_id: "", date: "", material: "", method: "", note: "" });

    useEffect(() => { loadDropdowns(); }, []);
    useEffect(() => { if (activeTab === "list") loadJournals(); }, [page, filterTeacher, filterClass, activeTab]);
    useEffect(() => { if (activeTab === "rekap") loadRekap(); }, [activeTab]);

    const loadDropdowns = async () => {
        try {
            const [t, c, s] = await Promise.all([api.get("/teachers"), api.get("/classes"), api.get("/subjects")]);
            setTeachers(t.data.data); setClasses(c.data.data); setSubjects(s.data.data);
        } catch (error) { console.error(error); }
    };

    const loadJournals = async () => {
        try {
            const params = { page, limit: 15 };
            if (filterTeacher) params.teacher_id = filterTeacher;
            if (filterClass) params.class_id = filterClass;
            const res = await api.get("/journals", { params });
            setJournals(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const loadRekap = async () => {
        try {
            const [rt, rc] = await Promise.all([api.get("/journals/rekap/teacher"), api.get("/journals/rekap/class")]);
            setRekapTeacher(rt.data.data); setRekapClass(rc.data.data);
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await api.put(`/journals/${editing.id}`, form); }
            else { await api.post("/journals", form); }
            setShowModal(false); resetForm(); loadJournals();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleEdit = (j) => {
        setEditing(j);
        setForm({ teacher_id: j.teacher_id || "", class_id: j.class_id || "", subject_id: j.subject_id || "", date: j.date || "", material: j.material || "", method: j.method || "", note: j.note || "" });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus jurnal ini?")) return;
        try { await api.delete(`/journals/${id}`); loadJournals(); }
        catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const resetForm = () => { setEditing(null); setForm({ teacher_id: "", class_id: "", subject_id: "", date: "", material: "", method: "", note: "" }); };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Jurnal Mengajar</h1>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab(activeTab === "list" ? "rekap" : "list")} className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <BarChart3 size={18} /> {activeTab === "list" ? "Rekap" : "Daftar"}
                    </button>
                    {hasRole("Admin", "Guru") && (
                        <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                            <Plus size={18} /> Input Jurnal
                        </button>
                    )}
                </div>
            </div>

            {activeTab === "list" ? (
                <>
                    <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 flex-wrap">
                        <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterTeacher} onChange={e => { setFilterTeacher(e.target.value); setPage(1); }}>
                            <option value="">Semua Guru</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
                            <option value="">Semua Kelas</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-gray-500">Tanggal</th>
                                        <th className="text-left p-4 font-medium text-gray-500">Guru</th>
                                        <th className="text-left p-4 font-medium text-gray-500">Kelas</th>
                                        <th className="text-left p-4 font-medium text-gray-500">Mata Pelajaran</th>
                                        <th className="text-left p-4 font-medium text-gray-500">Materi</th>
                                        <th className="text-left p-4 font-medium text-gray-500">Metode</th>
                                        {hasRole("Admin", "Guru") && <th className="text-left p-4 font-medium text-gray-500">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" className="text-center py-8 text-gray-400">Memuat...</td></tr>
                                    ) : journals.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
                                    ) : journals.map(j => (
                                        <tr key={j.id} className="border-t hover:bg-gray-50">
                                            <td className="p-4 text-sm">{j.date ? new Date(j.date).toLocaleDateString("id-ID") : "-"}</td>
                                            <td className="p-4">{j.teacher?.name || "-"}</td>
                                            <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">{j.class?.name || "-"}</span></td>
                                            <td className="p-4">{j.subject?.name || "-"}</td>
                                            <td className="p-4 text-sm max-w-[200px] truncate">{j.material || "-"}</td>
                                            <td className="p-4 text-sm">{j.method || "-"}</td>
                                            {hasRole("Admin", "Guru") && (
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(j)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button>
                                                        <button onClick={() => handleDelete(j.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center p-4 border-t">
                            <p className="text-sm text-gray-500">Total: {total} jurnal</p>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                                <span className="px-3 py-1 text-sm">Hal {page}/{totalPages || 1}</span>
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-bold text-lg mb-4">Rekap per Guru</h2>
                        <table className="w-full">
                            <thead><tr className="border-b"><th className="text-left pb-2 text-gray-500">Guru</th><th className="text-right pb-2 text-gray-500">Total Jurnal</th></tr></thead>
                            <tbody>{rekapTeacher.map((r, i) => (
                                <tr key={i} className="border-b last:border-0"><td className="py-3">{r.teacher_name}</td><td className="py-3 text-right font-bold">{r.total_journals}</td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-bold text-lg mb-4">Rekap per Kelas</h2>
                        <table className="w-full">
                            <thead><tr className="border-b"><th className="text-left pb-2 text-gray-500">Kelas</th><th className="text-right pb-2 text-gray-500">Total Jurnal</th></tr></thead>
                            <tbody>{rekapClass.map((r, i) => (
                                <tr key={i} className="border-b last:border-0"><td className="py-3">{r.class_name}</td><td className="py-3 text-right font-bold">{r.total_journals}</td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editing ? "Edit Jurnal" : "Input Jurnal Mengajar"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Guru *</label>
                                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})} required>
                                    <option value="">Pilih Guru</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Kelas *</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})} required>
                                        <option value="">Pilih Kelas</option>{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Mata Pelajaran *</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.subject_id} onChange={e => setForm({...form, subject_id: e.target.value})} required>
                                        <option value="">Pilih Mapel</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Tanggal *</label>
                                    <input type="date" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Metode</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ceramah, Diskusi, dll" value={form.method} onChange={e => setForm({...form, method: e.target.value})} /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Materi Pembelajaran *</label>
                                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" value={form.material} onChange={e => setForm({...form, material: e.target.value})} required /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Catatan</label>
                                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.note} onChange={e => setForm({...form, note: e.target.value})} /></div>
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
