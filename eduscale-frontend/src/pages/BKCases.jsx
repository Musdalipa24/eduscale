import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit, Trash2, X, Search, BarChart3, Eye } from "lucide-react";


export default function BKCases() {
    const { hasRole } = useAuth();
    const [activeTab, setActiveTab] = useState("cases");
    const [data, setData] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRekap, setShowRekap] = useState(null);
    const [rekapData, setRekapData] = useState(null);
    const [rekapClass, setRekapClass] = useState([]);
    const [form, setForm] = useState({});

    const tabs = [
        { key: "cases", label: "Kasus BK" },
        { key: "counseling", label: "Konseling" },
        { key: "violations", label: "Pelanggaran" },
        { key: "achievements", label: "Prestasi" },
        { key: "rekap", label: "Rekap" }
    ];

    useEffect(() => { loadStudents(); loadTeachers(); }, []);
    useEffect(() => { setPage(1); setSearch(""); if (activeTab !== "rekap") loadData(); else loadRekapClass(); }, [activeTab]);
    useEffect(() => { if (activeTab !== "rekap") loadData(); }, [page, search]);

    const loadStudents = async () => { try { const r = await api.get("/students", { params: { limit: 500 } }); setStudents(r.data.data); } catch (e) { console.error(e); } };
    const loadTeachers = async () => { try { const r = await api.get("/teachers"); setTeachers(r.data.data); } catch (e) { console.error(e); } };

    const loadData = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (search) params.search = search;
            let url = "/bk/cases";
            if (activeTab === "counseling") url = "/bk/counseling";
            if (activeTab === "violations") url = "/bk/violations";
            if (activeTab === "achievements") url = "/bk/achievements";
            const res = await api.get(url, { params });
            setData(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const loadRekapClass = async () => {
        try { const r = await api.get("/bk/rekap/class"); setRekapClass(r.data.data); } catch (e) { console.error(e); }
    };

    const loadRekapStudent = async (studentId) => {
        try { const r = await api.get(`/bk/rekap/student/${studentId}`); setRekapData(r.data); setShowRekap(true); } catch (e) { console.error(e); }
    };

    const openAdd = () => {
        setEditing(null);
        if (activeTab === "cases") setForm({ student_id: "", case_type: "Pelanggaran", description: "", status: "Proses" });
        else if (activeTab === "counseling") setForm({ student_id: "", teacher_id: "", date: "", type: "Individual", note: "", result: "", follow_up: "" });
        else if (activeTab === "violations") setForm({ student_id: "", teacher_id: "", date: "", type: "", description: "", points: 0, follow_up: "" });
        else if (activeTab === "achievements") setForm({ student_id: "", date: "", title: "", description: "", level: "Sekolah" });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        if (activeTab === "cases") setForm({ student_id: item.student_id, case_type: item.case_type, description: item.description, status: item.status });
        else if (activeTab === "counseling") setForm({ student_id: item.student_id, teacher_id: item.teacher_id || "", date: item.date || "", type: item.type || "Individual", note: item.note || "", result: item.result || "", follow_up: item.follow_up || "" });
        else if (activeTab === "violations") setForm({ student_id: item.student_id, teacher_id: item.teacher_id || "", date: item.date || "", type: item.type || "", description: item.description || "", points: item.points || 0, follow_up: item.follow_up || "" });
        else if (activeTab === "achievements") setForm({ student_id: item.student_id, date: item.date || "", title: item.title || "", description: item.description || "", level: item.level || "Sekolah" });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = "/bk/cases";
            if (activeTab === "counseling") url = "/bk/counseling";
            if (activeTab === "violations") url = "/bk/violations";
            if (activeTab === "achievements") url = "/bk/achievements";
            if (editing) { await api.put(`${url}/${editing.id}`, form); }
            else { await api.post(url, form); }
            setShowModal(false); loadData();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus data ini?")) return;
        try {
            let url = "/bk/cases";
            if (activeTab === "counseling") url = "/bk/counseling";
            if (activeTab === "violations") url = "/bk/violations";
            if (activeTab === "achievements") url = "/bk/achievements";
            await api.delete(`${url}/${id}`); loadData();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const renderFormFields = () => {
        if (activeTab === "cases") return (<>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Siswa *</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                    <option value="">Pilih Siswa</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nis || "-"})</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Jenis Kasus</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.case_type} onChange={e => setForm({...form, case_type: e.target.value})}>
                    <option value="Pelanggaran">Pelanggaran</option><option value="Konseling">Konseling</option><option value="Pembinaan">Pembinaan</option><option value="Lainnya">Lainnya</option></select></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="Proses">Proses</option><option value="Selesai">Selesai</option></select></div>
        </>);
        if (activeTab === "counseling") return (<>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Siswa *</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                    <option value="">Pilih Siswa</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nis || "-"})</option>)}</select></div>
            <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Guru BK</label>
                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})}>
                        <option value="">Pilih</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Tanggal</label>
                    <input type="date" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Tipe</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="Individual">Individual</option><option value="Kelompok">Kelompok</option></select></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Catatan Konseling</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.note} onChange={e => setForm({...form, note: e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Hasil</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.result} onChange={e => setForm({...form, result: e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Tindak Lanjut</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.follow_up} onChange={e => setForm({...form, follow_up: e.target.value})} /></div>
        </>);
        if (activeTab === "violations") return (<>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Siswa *</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                    <option value="">Pilih Siswa</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nis || "-"})</option>)}</select></div>
            <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Tanggal *</label>
                    <input type="date" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Jenis Pelanggaran *</label>
                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.type} onChange={e => setForm({...form, type: e.target.value})} required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Poin</label>
                <input type="number" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.points} onChange={e => setForm({...form, points: parseInt(e.target.value) || 0})} /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Tindak Lanjut</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.follow_up} onChange={e => setForm({...form, follow_up: e.target.value})} /></div>
        </>);
        if (activeTab === "achievements") return (<>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Siswa *</label>
                <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required>
                    <option value="">Pilih Siswa</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nis || "-"})</option>)}</select></div>
            <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Tanggal *</label>
                    <input type="date" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Level</label>
                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                        <option value="Sekolah">Sekolah</option><option value="Kota">Kota</option><option value="Provinsi">Provinsi</option><option value="Nasional">Nasional</option></select></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Judul Prestasi *</label>
                <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        </>);
    };

    const renderTable = () => {
        if (activeTab === "cases") return (
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="text-left p-4 font-medium text-gray-500">Siswa</th><th className="text-left p-4 font-medium text-gray-500">Kelas</th><th className="text-left p-4 font-medium text-gray-500">Jenis</th><th className="text-left p-4 font-medium text-gray-500">Deskripsi</th><th className="text-left p-4 font-medium text-gray-500">Status</th><th className="text-left p-4 font-medium text-gray-500">Aksi</th></tr></thead>
            <tbody>{data.length === 0 ? <tr><td colSpan="6" className="text-center py-8 text-gray-400">Tidak ada data</td></tr> : data.map(d => (
                <tr key={d.id} className="border-t hover:bg-gray-50"><td className="p-4 font-medium">{d.student?.name || "-"}</td><td className="p-4">{d.student?.class?.name || "-"}</td><td className="p-4"><span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs">{d.case_type}</span></td><td className="p-4 text-sm max-w-[200px] truncate">{d.description}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${d.status === "Proses" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{d.status}</span></td>
                <td className="p-4"><div className="flex gap-1">
                    <button onClick={() => loadRekapStudent(d.student_id)} className="text-violet-600 hover:bg-violet-50 p-1.5 rounded-lg" title="Lihat Rekap"><Eye size={16} /></button>
                    {hasRole("Admin", "Guru BK") && <><button onClick={() => openEdit(d)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button></>}
                </div></td></tr>
            ))}</tbody></table>
        );
        if (activeTab === "counseling") return (
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="text-left p-4 font-medium text-gray-500">Tanggal</th><th className="text-left p-4 font-medium text-gray-500">Siswa</th><th className="text-left p-4 font-medium text-gray-500">Guru BK</th><th className="text-left p-4 font-medium text-gray-500">Tipe</th><th className="text-left p-4 font-medium text-gray-500">Catatan</th><th className="text-left p-4 font-medium text-gray-500">Aksi</th></tr></thead>
            <tbody>{data.length === 0 ? <tr><td colSpan="6" className="text-center py-8 text-gray-400">Tidak ada data</td></tr> : data.map(d => (
                <tr key={d.id} className="border-t hover:bg-gray-50"><td className="p-4 text-sm">{d.date ? new Date(d.date).toLocaleDateString("id-ID") : "-"}</td><td className="p-4 font-medium">{d.student?.name || "-"}</td><td className="p-4">{d.teacher?.name || "-"}</td><td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{d.type}</span></td><td className="p-4 text-sm max-w-[200px] truncate">{d.note || "-"}</td>
                <td className="p-4">{hasRole("Admin", "Guru BK") && <div className="flex gap-1"><button onClick={() => openEdit(d)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button><button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button></div>}</td></tr>
            ))}</tbody></table>
        );
        if (activeTab === "violations") return (
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="text-left p-4 font-medium text-gray-500">Tanggal</th><th className="text-left p-4 font-medium text-gray-500">Siswa</th><th className="text-left p-4 font-medium text-gray-500">Jenis</th><th className="text-left p-4 font-medium text-gray-500">Deskripsi</th><th className="text-left p-4 font-medium text-gray-500">Poin</th><th className="text-left p-4 font-medium text-gray-500">Aksi</th></tr></thead>
            <tbody>{data.length === 0 ? <tr><td colSpan="6" className="text-center py-8 text-gray-400">Tidak ada data</td></tr> : data.map(d => (
                <tr key={d.id} className="border-t hover:bg-gray-50"><td className="p-4 text-sm">{d.date ? new Date(d.date).toLocaleDateString("id-ID") : "-"}</td><td className="p-4 font-medium">{d.student?.name || "-"}</td><td className="p-4"><span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">{d.type}</span></td><td className="p-4 text-sm max-w-[200px] truncate">{d.description || "-"}</td><td className="p-4 font-bold text-red-600">{d.points}</td>
                <td className="p-4">{hasRole("Admin", "Guru BK") && <div className="flex gap-1"><button onClick={() => openEdit(d)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button><button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button></div>}</td></tr>
            ))}</tbody></table>
        );
        if (activeTab === "achievements") return (
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="text-left p-4 font-medium text-gray-500">Tanggal</th><th className="text-left p-4 font-medium text-gray-500">Siswa</th><th className="text-left p-4 font-medium text-gray-500">Prestasi</th><th className="text-left p-4 font-medium text-gray-500">Level</th><th className="text-left p-4 font-medium text-gray-500">Aksi</th></tr></thead>
            <tbody>{data.length === 0 ? <tr><td colSpan="5" className="text-center py-8 text-gray-400">Tidak ada data</td></tr> : data.map(d => (
                <tr key={d.id} className="border-t hover:bg-gray-50"><td className="p-4 text-sm">{d.date ? new Date(d.date).toLocaleDateString("id-ID") : "-"}</td><td className="p-4 font-medium">{d.student?.name || "-"}</td><td className="p-4">{d.title}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-medium ${d.level === "Nasional" ? "bg-purple-100 text-purple-700" : d.level === "Provinsi" ? "bg-blue-100 text-blue-700" : d.level === "Kota" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{d.level}</span></td>
                <td className="p-4">{hasRole("Admin", "Guru BK") && <div className="flex gap-1"><button onClick={() => openEdit(d)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button><button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button></div>}</td></tr>
            ))}</tbody></table>
        );
    };

    const tabLabels = { cases: "Kasus BK", counseling: "Konseling", violations: "Pelanggaran", achievements: "Prestasi" };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Bimbingan Konseling</h1>
                {activeTab !== "rekap" && hasRole("Admin", "Guru BK") && (
                    <button onClick={openAdd} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                        <Plus size={18} /> Tambah {tabLabels[activeTab]}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? "bg-white text-blue-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === "rekap" ? (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-bold text-lg mb-4">Rekap BK per Kelas</h2>
                    <table className="w-full"><thead className="bg-gray-50"><tr><th className="text-left p-3 font-medium text-gray-500">Kelas</th><th className="text-right p-3 font-medium text-gray-500">Siswa</th><th className="text-right p-3 font-medium text-gray-500">Kasus</th><th className="text-right p-3 font-medium text-gray-500">Pelanggaran</th><th className="text-right p-3 font-medium text-gray-500">Prestasi</th></tr></thead>
                    <tbody>{rekapClass.map((r, i) => (
                        <tr key={i} className="border-t"><td className="p-3 font-medium">{r.class_name}</td><td className="p-3 text-right">{r.total_students}</td><td className="p-3 text-right">{r.total_cases}</td><td className="p-3 text-right text-red-600 font-bold">{r.total_violations}</td><td className="p-3 text-right text-green-600 font-bold">{r.total_achievements}</td></tr>
                    ))}</tbody></table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">{loading ? <p className="text-center py-8 text-gray-400">Memuat...</p> : renderTable()}</div>
                    <div className="flex justify-between items-center p-4 border-t">
                        <p className="text-sm text-gray-500">Total: {total}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                            <span className="px-3 py-1 text-sm">Hal {page}/{totalPages || 1}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editing ? "Edit" : "Tambah"} {tabLabels[activeTab]}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {renderFormFields()}
                            <div className="flex gap-3 pt-3">
                                <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">Simpan</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rekap Student Modal */}
            {showRekap && rekapData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRekap(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Rekap Pembinaan: {rekapData.student?.name}</h2>
                            <button onClick={() => setShowRekap(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <p className="text-gray-500 mb-4">Kelas: {rekapData.student?.class?.name || "-"} | NIS: {rekapData.student?.nis || "-"}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            <div className="bg-orange-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-orange-700">{rekapData.summary.total_cases}</p><p className="text-xs text-gray-500">Kasus</p></div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-blue-700">{rekapData.summary.total_counselings}</p><p className="text-xs text-gray-500">Konseling</p></div>
                            <div className="bg-red-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-red-700">{rekapData.summary.total_violations}</p><p className="text-xs text-gray-500">Pelanggaran ({rekapData.summary.total_violation_points} poin)</p></div>
                            <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-green-700">{rekapData.summary.total_achievements}</p><p className="text-xs text-gray-500">Prestasi</p></div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
