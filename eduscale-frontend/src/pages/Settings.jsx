import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { Plus, Edit, Trash2, X } from "lucide-react";


export default function Settings() {
    const [activeTab, setActiveTab] = useState("subjects");
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [modalType, setModalType] = useState("");

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        try {
            const [s, t, a] = await Promise.all([api.get("/subjects"), api.get("/teachers"), api.get("/academic-years")]);
            setSubjects(s.data.data); setTeachers(t.data.data); setAcademicYears(a.data.data);
        } catch (error) { console.error(error); }
    };

    const openSubjectModal = (subject = null) => {
        setModalType("subject"); setEditing(subject);
        setForm(subject ? { name: subject.name, teacher_id: subject.teacher_id || "" } : { name: "", teacher_id: "" });
        setShowModal(true);
    };

    const openYearModal = (year = null) => {
        setModalType("year"); setEditing(year);
        setForm(year ? { name: year.name, is_active: year.is_active } : { name: "", is_active: false });
        setShowModal(true);
    };

    const openSemesterModal = (yearId) => {
        setModalType("semester"); setEditing(null);
        setForm({ name: "", academic_year_id: yearId, is_active: false });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === "subject") {
                if (editing) await api.put(`/subjects/${editing.id}`, form);
                else await api.post("/subjects", form);
            } else if (modalType === "year") {
                if (editing) await api.put(`/academic-years/${editing.id}`, form);
                else await api.post("/academic-years", form);
            } else if (modalType === "semester") {
                await api.post("/academic-years/semesters", form);
            }
            setShowModal(false); loadAll();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    const handleDelete = async (type, id) => {
        if (!confirm("Hapus data ini?")) return;
        try {
            if (type === "subject") await api.delete(`/subjects/${id}`);
            else if (type === "year") await api.delete(`/academic-years/${id}`);
            loadAll();
        } catch (error) { alert(error.response?.data?.message || "Error"); }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Pengaturan</h1>

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                <button onClick={() => setActiveTab("subjects")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "subjects" ? "bg-white text-blue-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>Mata Pelajaran</button>
                <button onClick={() => setActiveTab("academic")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "academic" ? "bg-white text-blue-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>Tahun Ajaran</button>
            </div>

            {activeTab === "subjects" && (
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Mata Pelajaran</h2>
                        <button onClick={() => openSubjectModal()} className="flex items-center gap-2 bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-800 transition-colors"><Plus size={16} /> Tambah</button>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50"><tr><th className="text-left p-3 font-medium text-gray-500">Nama</th><th className="text-left p-3 font-medium text-gray-500">Guru Pengampu</th><th className="text-left p-3 font-medium text-gray-500">Aksi</th></tr></thead>
                        <tbody>{subjects.map(s => (
                            <tr key={s.id} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-medium">{s.name}</td>
                                <td className="p-3 text-gray-600">{s.teacher?.name || "-"}</td>
                                <td className="p-3"><div className="flex gap-1">
                                    <button onClick={() => openSubjectModal(s)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete("subject", s.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                </div></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {activeTab === "academic" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={() => openYearModal()} className="flex items-center gap-2 bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-800 transition-colors"><Plus size={16} /> Tambah Tahun Ajaran</button>
                    </div>
                    {academicYears.map(y => (
                        <div key={y.id} className="bg-white rounded-xl shadow p-5">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg">{y.name}</h3>
                                    {y.is_active && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">Aktif</span>}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openYearModal(y)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete("year", y.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {y.semesters?.map(s => (
                                    <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                                        <span>{s.name}</span>
                                        {s.is_active && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Aktif</span>}
                                    </div>
                                ))}
                                <button onClick={() => openSemesterModal(y.id)} className="text-blue-600 text-sm hover:underline mt-1">+ Tambah Semester</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {modalType === "subject" ? (editing ? "Edit Mapel" : "Tambah Mapel") :
                                 modalType === "year" ? (editing ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran") :
                                 "Tambah Semester"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {modalType === "subject" && (<>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Nama Mapel *</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Guru Pengampu</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})}>
                                        <option value="">Pilih Guru</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                            </>)}
                            {modalType === "year" && (<>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Nama Tahun Ajaran *</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2024/2025" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Aktif</label>
                            </>)}
                            {modalType === "semester" && (<>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Nama Semester *</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required>
                                        <option value="">Pilih</option><option value="Ganjil">Ganjil</option><option value="Genap">Genap</option></select></div>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Aktif</label>
                            </>)}
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
