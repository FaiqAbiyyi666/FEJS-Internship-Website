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

// ✅ Card & Button Custom (Tailwind)
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>{children}</div>
  );
}
function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function AdminDashboardHome() {
  // Dummy data → nanti tinggal dihubungkan ke backend
  const stats = [
    { title: 'Akun Pending', value: 5, icon: Users },
    { title: 'Peserta Aktif', value: 32, icon: CheckCircle },
    { title: 'Laporan Harian (Minggu Ini)', value: 120, icon: ClipboardList },
    { title: 'Laporan Akhir Pending', value: 7, icon: FileText },
    { title: 'Ajuan Magang Baru', value: 12, icon: FileCheck },
    { title: 'Sertifikat Perlu Dikirim', value: 4, icon: Send },
    { title: 'Surat Perlu Dikirim', value: 3, icon: Mail },
    { title: 'Kritik & Saran', value: 18, icon: MessageSquare },
    { title: 'Ulasan Magang', value: 25, icon: Star },
  ];

  const bidangData = [
    { name: 'Informatika', value: 12 },
    { name: 'IKP', value: 8 },
    { name: 'TIK', value: 6 },
    { name: 'Sekretariat', value: 4 },
    { name: 'Statistik', value: 2 },
  ];

  const ajuanData = [
    { month: 'Jan', jumlah: 5 },
    { month: 'Feb', jumlah: 8 },
    { month: 'Mar', jumlah: 12 },
    { month: 'Apr', jumlah: 15 },
    { month: 'Mei', jumlah: 9 },
  ];

  const laporanStatus = [
    { name: 'Selesai', value: 85 },
    { name: 'Pending', value: 15 },
  ];

  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#6366F1'];

  return (
    <div className="space-y-6">
      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-md transition">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Pie Bidang */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Peserta per Bidang</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bidangData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {bidangData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Grafik Tren Ajuan */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Tren Ajuan Magang</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ajuanData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Grafik Status Laporan */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Status Laporan</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={laporanStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {laporanStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
