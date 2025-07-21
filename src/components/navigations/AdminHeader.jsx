import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const AdminHeader = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate(); // ✅ Pindahkan ke dalam komponen
  const notifications = [
    {
      id: 1,
      type: 'Pendaftaran',
      message: 'Pengajuan magang baru dari Universitas A.',
      date: '16 Juli 2025',
    },
    {
      id: 2,
      type: 'Laporan',
      message: 'Laporan harian dari peserta B telah dikirim.',
      date: '15 Juli 2025',
    },
    {
      id: 3,
      type: 'Akun',
      message: 'Akun sub koordinator berhasil ditambahkan.',
      date: '14 Juli 2025',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login-admin'); // ✅ Navigasi ke halaman login
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002942]">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola sistem magang dengan mudah
          </p>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-[#006DA6] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[420px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="p-4 border-b text-sm font-semibold text-gray-700">
                  Notifikasi
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className="px-5 py-4 hover:bg-gray-50 border-b text-sm"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {notif.type}
                          </p>
                          <p className="text-gray-600 mt-1">{notif.message}</p>
                        </div>
                        <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {notif.date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-[#006DA6] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700">
                  Administrator
                </p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <ul className="text-sm text-gray-700">
                  <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <User size={16} className="mr-2 text-[#006DA6]" />
                    Profile
                  </li>
                  <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <Settings size={16} className="mr-2 text-[#006DA6]" />
                    Pengaturan
                  </li>
                  <li
                    className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2 text-[#a60000]" />
                    Keluar
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
