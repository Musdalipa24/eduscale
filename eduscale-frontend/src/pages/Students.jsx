import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Edit, Trash2, Download, Upload, X } from "lucide-react";


export default function Students() {

    const { hasRole } = useAuth();
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [filterClass, setFilterClass] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        nis: "", name: "", gender: "", class_id: "", status: "Aktif",
        birth_place: "", birth_date: "", address: "", phone: "",
        parent_name: "", parent_phone: ""
    });
    const [importData, setImportData] = useState("");


    useEffect(() => { loadClasses(); }, []);
    useEffect(() => { loadStudents(); }, [page, search, filterClass, filterStatus]);


    const loadStudents = async () => {
        try {
            const params = { page, limit: 15 };
            if (search) params.search = search;
            if (filterClass) params.class_id = filterClass;
            if (filterStatus) params.status = filterStatus;

            const res = await api.get("/students", { params });
            setStudents(res.data.data);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadClasses = async () => {
        try {
            const res = await api.get("/classes");
            setClasses(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent.id}`, form);
            } else {
                await api.post("/students", form);
            }
            setShowModal(false);
            resetForm();
            loadStudents();
        } catch (error) {
            alert(error.response?.data?.message || "Error");
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setForm({
            nis: student.nis || "", name: student.name || "",
            gender: student.gender || "", class_id: student.class_id || "",
            status: student.status || "Aktif", birth_place: student.birth_place || "",
            birth_date: student.birth_date || "", address: student.address || "",
            phone: student.phone || "", parent_name: student.parent_name || "",
            parent_phone: student.parent_phone || ""
        });
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Hapus siswa "${name}"?`)) return;
        try {
            await api.delete(`/students/${id}`);
            loadStudents();
        } catch (error) {
            alert(error.response?.data?.message || "Error");
        }
    };

    const handleExport = async () => {
        try {
            const params = {};
            if (filterClass) params.class_id = filterClass;
            if (filterStatus) params.status = filterStatus;

            const res = await api.get("/students/export", { params });
            const data = res.data.data;

            if (data.length === 0) { alert("Tidak ada data untuk diexport"); return; }

            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(","),
                ...data.map(row => headers.map(h => `"${row[h] || ""}"`).join(","))
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "data_siswa.csv";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            alert("Error exporting data");
        }
    };

    const handleImport = async () => {
        try {
            const lines = importData.trim().split("\n");
            if (lines.length < 2) { alert("Data CSV tidak valid"); return; }

            const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
            const students = lines.slice(1).map(line => {
                const values = line.split(",").map(v => v.trim().replace(/"/g, ""));
                const obj = {};
                headers.forEach((h, i) => {
                    const key = h.toLowerCase().replace(/ /g, "_");
                    if (key === "nama") obj.name = values[i];
                    else if (key === "kelas") { /* skip, need class_id */ }
                    else obj[key] = values[i];
                });
                return obj;
            }).filter(s => s.name);

            await api.post("/students/import", { students });
            setShowImportModal(false);
            setImportData("");
            loadStudents();
            alert("Import berhasil!");
        } catch (error) {
            alert(error.response?.data?.message || "Error importing");
        }
    };

    const resetForm = () => {
        setEditingStudent(null);
        setForm({
            nis: "", name: "", gender: "", class_id: "", status: "Aktif",
            birth_place: "", birth_date: "", address: "", phone: "",
            parent_name: "", parent_phone: ""
        });
    };


    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Data Siswa</h1>
                <div className="flex gap-2">
                    {hasRole("Admin") && (
                        <>
                            <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                                <Upload size={18} /> Import CSV
                            </button>
                            <button onClick={handleExport} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
                                <Download size={18} /> Export CSV
                            </button>
                            <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                                <Plus size={18} /> Tambah Siswa
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text" placeholder="Cari nama atau NIS..."
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterClass} onChange={(e) => { setFilterClass(e.target.value); setPage(1); }}>
                    <option value="">Semua Kelas</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                    <option value="">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Pindah">Pindah</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Keluar">Keluar</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 font-medium text-gray-500">NIS</th>
                                <th className="text-left p-4 font-medium text-gray-500">Nama</th>
                                <th className="text-left p-4 font-medium text-gray-500">Gender</th>
                                <th className="text-left p-4 font-medium text-gray-500">Kelas</th>
                                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                                {hasRole("Admin") && <th className="text-left p-4 font-medium text-gray-500">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Memuat...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
                            ) : (
                                students.map(s => (
                                    <tr key={s.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-mono text-sm">{s.nis || "-"}</td>
                                        <td className="p-4 font-medium">{s.name}</td>
                                        <td className="p-4">{s.gender || "-"}</td>
                                        <td className="p-4">{s.class?.name || "-"}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                s.status === "Aktif" ? "bg-green-100 text-green-700" :
                                                s.status === "Lulus" ? "bg-blue-100 text-blue-700" :
                                                s.status === "Pindah" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        {hasRole("Admin") && (
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete(s.id, s.name)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 border-t">
                    <p className="text-sm text-gray-500">Total: {total} siswa</p>
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
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editingStudent ? "Edit Siswa" : "Tambah Siswa"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">NIS</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.nis} onChange={e => setForm({...form, nis: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama *</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                                        <option value="">Pilih</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Kelas</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})}>
                                        <option value="">Pilih Kelas</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Tempat Lahir</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.birth_place} onChange={e => setForm({...form, birth_place: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Lahir</label>
                                    <input type="date" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
                                <textarea className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Telepon</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                    <select className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Pindah">Pindah</option>
                                        <option value="Lulus">Lulus</option>
                                        <option value="Keluar">Keluar</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama Orang Tua</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.parent_name} onChange={e => setForm({...form, parent_name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Telepon Orang Tua</label>
                                    <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})} />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-3">
                                <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">Simpan</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Import Data Siswa (CSV)</h2>
                            <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Format: NIS, Nama, Gender, Status (satu baris per siswa, baris pertama adalah header)</p>
                        <textarea
                            className="w-full border rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="8"
                            placeholder={'NIS,Nama,Gender,Status\n"2024011","Nama Siswa","Laki-laki","Aktif"'}
                            value={importData}
                            onChange={e => setImportData(e.target.value)}
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={handleImport} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors">Import</button>
                            <button onClick={() => setShowImportModal(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
