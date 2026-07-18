import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { Search } from "lucide-react";


export default function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadLogs(); }, [page, dateFrom, dateTo]);

    const loadLogs = async () => {
        try {
            const params = { page, limit: 20 };
            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;
            const res = await api.get("/activities", { params });
            setLogs(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Audit Log Aktivitas</h1>

            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 flex-wrap items-end">
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Dari Tanggal</label>
                    <input type="date" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Sampai Tanggal</label>
                    <input type="date" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
                </div>
                {(dateFrom || dateTo) && (
                    <button onClick={() => { setDateFrom(""); setDateTo(""); setPage(1); }} className="text-blue-600 hover:underline text-sm">Reset Filter</button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 font-medium text-gray-500">Waktu</th>
                                <th className="text-left p-4 font-medium text-gray-500">User</th>
                                <th className="text-left p-4 font-medium text-gray-500">Role</th>
                                <th className="text-left p-4 font-medium text-gray-500">Aktivitas</th>
                                <th className="text-left p-4 font-medium text-gray-500">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Memuat...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Tidak ada log</td></tr>
                            ) : logs.map(log => (
                                <tr key={log.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString("id-ID")}</td>
                                    <td className="p-4 font-medium">{log.user?.name || "-"}</td>
                                    <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{log.user?.role?.name || "-"}</span></td>
                                    <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">{log.activity}</span></td>
                                    <td className="p-4 text-sm text-gray-600">{log.description || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center p-4 border-t">
                    <p className="text-sm text-gray-500">Total: {total} log</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                        <span className="px-3 py-1 text-sm">Hal {page}/{totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
