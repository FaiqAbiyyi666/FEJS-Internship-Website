import React from 'react';
import {
  Users,
  FileText,
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    {
      title: 'Total Peserta',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Users,
      gradient: 'from-pink-400 to-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-600',
    },
    {
      title: 'Laporan Pending',
      value: '23',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-gradient-to-br from-[#006DA6] to-[#002942]',
    },
    {
      title: 'Mitra Aktif',
      value: '45',
      change: '+5%',
      trend: 'up',
      icon: Building,
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      title: 'Selesai Magang',
      value: '89',
      change: '+18%',
      trend: 'up',
      icon: CheckCircle,
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'new',
      message: 'Peserta baru mendaftar: Ahmad Rizki',
      time: '2 menit lalu',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 2,
      type: 'report',
      message: 'Laporan harian dari Siti Aminah',
      time: '15 menit lalu',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 3,
      type: 'approval',
      message: 'Persetujuan magang untuk Budi Santoso',
      time: '1 jam lalu',
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 4,
      type: 'complete',
      message: 'Magang selesai: Dian Permata',
      time: '2 jam lalu',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 55 },
    { month: 'Jul', value: 80 },
  ];

  const trafficSources = [
    { source: 'Universitas', percentage: 45, color: 'bg-[#006DA6]' },
    { source: 'Website', percentage: 30, color: 'bg-[#BFDCFF]' },
    { source: 'Referral', percentage: 25, color: 'bg-[#002942]' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center">
                    {stat.trend === 'up' ? (
                      <ArrowUp size={16} className="text-green-500 mr-1" />
                    ) : (
                      <ArrowDown size={16} className="text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Statistik Peserta Magang
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#006DA6] rounded-full mr-2"></div>
                  <span className="text-gray-600">Aktif</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#BFDCFF] rounded-full mr-2"></div>
                  <span className="text-gray-600">Selesai</span>
                </div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between h-64 space-x-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center">
                    <div
                      className="w-8 bg-gradient-to-t from-[#006DA6] to-[#BFDCFF] rounded-t-md transition-all duration-300 hover:from-[#002942] hover:to-[#006DA6]"
                      style={{ height: `${(item.value / 100) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">
                      {item.month}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Sumber Pendaftar
            </h3>

            {/* Donut Chart Representation */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <div
                  className="w-32 h-32 rounded-full border-8 border-[#006DA6]"
                  style={{
                    background: `conic-gradient(#006DA6 0deg ${
                      45 * 3.6
                    }deg, #BFDCFF ${45 * 3.6}deg ${
                      (45 + 30) * 3.6
                    }deg, #002942 ${(45 + 30) * 3.6}deg 360deg)`,
                  }}
                ></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${source.color} mr-3`}
                    ></div>
                    <span className="text-sm text-gray-700">
                      {source.source}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {source.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#006DA6] mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${activity.color}`}
              >
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
