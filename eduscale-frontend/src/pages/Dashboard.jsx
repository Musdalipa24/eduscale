import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Users, GraduationCap, School, AlertTriangle, BookOpen } from "lucide-react";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, Title, Tooltip, Legend
);


function Card({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h2 className="text-3xl font-bold mt-1">{value}</h2>
            </div>
        </div>
    );
}


export default function Dashboard() {

    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [activities, setActivities] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {
        try {
            const [statsRes, activitiesRes, chartRes] = await Promise.all([
                api.get("/dashboard/stats"),
                api.get("/dashboard/activities"),
                api.get("/dashboard/charts")
            ]);

            setStats(statsRes.data);
            setActivities(activitiesRes.data.data);
            setChartData(chartRes.data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };


    const barData = chartData ? {
        labels: chartData.studentsPerClass.map(d => d.class_name),
        datasets: [{
            label: "Jumlah Siswa",
            data: chartData.studentsPerClass.map(d => d.count),
            backgroundColor: "rgba(29, 78, 216, 0.8)",
            borderRadius: 6
        }]
    } : null;


    const lineData = chartData ? {
        labels: chartData.journalsPerMonth.map(d => `${d.month} ${d.year}`),
        datasets: [{
            label: "Jurnal Mengajar",
            data: chartData.journalsPerMonth.map(d => d.count),
            borderColor: "rgb(29, 78, 216)",
            backgroundColor: "rgba(29, 78, 216, 0.1)",
            fill: true,
            tension: 0.4
        }]
    } : null;


    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };


    return (

        <AdminLayout>

            <h1 className="text-3xl font-bold mb-6">
                Selamat Datang, {user?.name} 👋
            </h1>


            {loading ? (
                <p className="text-gray-500">Memuat data...</p>
            ) : (
                <>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <Card
                            title="Total Siswa Aktif"
                            value={stats.totalStudents || 0}
                            icon={GraduationCap}
                            color="bg-blue-600"
                        />
                        <Card
                            title="Total Guru"
                            value={stats.totalTeachers || 0}
                            icon={Users}
                            color="bg-emerald-600"
                        />
                        <Card
                            title="Total Kelas"
                            value={stats.totalClasses || 0}
                            icon={School}
                            color="bg-violet-600"
                        />
                        <Card
                            title="Kasus BK Aktif"
                            value={stats.activeBKCases || 0}
                            icon={AlertTriangle}
                            color="bg-amber-500"
                        />
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                        {barData && (
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="font-bold text-lg mb-4">Siswa per Kelas</h2>
                                <Bar data={barData} options={chartOptions} />
                            </div>
                        )}

                        {lineData && (
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="font-bold text-lg mb-4">Jurnal Mengajar (6 Bulan Terakhir)</h2>
                                <Line data={lineData} options={chartOptions} />
                            </div>
                        )}

                    </div>


                    <div className="bg-white rounded-xl shadow mt-8 p-6">

                        <h2 className="font-bold text-xl mb-4">
                            Aktivitas Terbaru
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="pb-3 text-gray-500 font-medium">User</th>
                                        <th className="pb-3 text-gray-500 font-medium">Aktivitas</th>
                                        <th className="pb-3 text-gray-500 font-medium">Deskripsi</th>
                                        <th className="pb-3 text-gray-500 font-medium">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-gray-400">
                                                Belum ada aktivitas
                                            </td>
                                        </tr>
                                    ) : (
                                        activities.map((act) => (
                                            <tr key={act.id} className="border-b last:border-0">
                                                <td className="py-3">
                                                    <span className="font-medium">{act.user?.name || "-"}</span>
                                                    {act.user?.role && (
                                                        <span className="text-xs text-gray-400 ml-1">
                                                            ({act.user.role.name})
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                                                        {act.activity}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-600 text-sm">{act.description}</td>
                                                <td className="py-3 text-gray-400 text-sm">
                                                    {new Date(act.createdAt).toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </>
            )}

        </AdminLayout>

    );
}