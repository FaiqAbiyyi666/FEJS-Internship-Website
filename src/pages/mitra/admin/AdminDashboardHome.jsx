import { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  ClipboardList,
  CheckCircle,
  FileCheck,
  Send,
  Mail,
  MessageSquare,
  Star,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>{children}</div>
  );
}
function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

const iconMap = {
  Users,
  FileText,
  ClipboardList,
  CheckCircle,
  FileCheck,
  Send,
  Mail,
  MessageSquare,
  Star,
};

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#6366F1'];

export default function AdminDashboardHome() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Otentikasi tidak ditemukan. Silakan login kembali.');
        }

        const response = await fetch(
          'http://localhost:3000/api/admin/dashboard-admin',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Gagal mengambil data dashboard');
        }

        const result = await response.json();

        if (result.status) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.message || 'Gagal memuat data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardData.stats.map((stat, idx) => {
          const IconComponent = iconMap[stat.iconName] || Users;
          return (
            <Card key={idx} className="hover:shadow-md transition">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <IconComponent size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- CHARTS (Data dari state) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Peserta per Bidang */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Peserta per Bidang</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dashboardData.charts.bidangData} // Data dari API
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value" // Sesuai 'value' dari controller
                label={({ name, value }) => `${name} (${value})`}
              >
                {dashboardData.charts.bidangData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 2: Tren Ajuan Magang */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Tren Ajuan Magang</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardData.charts.ajuanData}>
              {' '}
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#3B82F6" />{' '}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 3: Status Laporan */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Status Laporan</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dashboardData.charts.laporanStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {dashboardData.charts.laporanStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
