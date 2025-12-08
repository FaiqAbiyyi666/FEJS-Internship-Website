import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';

const AdminHeader = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const formatRole = (role) => {
    if (!role) return 'Admin';
    return role
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login-admin');
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:3000/api/admin/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          if (response.status === 401) {
            handleLogout();
          }
          console.error('Gagal mengambil profil');
        }
      } catch (error) {
        console.error('Error koneksi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login-admin');
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = loading ? 'Memuat...' : profile?.nama || 'Admin';

  const displayRole = loading
    ? '...'
    : profile?.bidang
    ? `${formatRole(profile.role)}`
    : formatRole(profile?.role);

  const userInitial = profile?.nama
    ? profile.nama.charAt(0).toUpperCase()
    : 'A';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title Halaman */}
        <div>
          <h1 className="text-2xl font-bold text-[#002942]">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola sistem magang dengan mudah
          </p>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Bagian Notifikasi */}
          <div className="relative" ref={notifRef}>
            {/* ... kode notifikasi ... */}
          </div>

          {/* --- User Menu --- */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-[#006DA6] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {userInitial}
                </span>
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {displayRole}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <ul className="text-sm text-gray-700">
                  <li
                    className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate('/dashboard-admin/profile')}
                  >
                    <User size={16} className="mr-2 text-gray-500" />
                    Profile Saya
                  </li>
                  <li
                    className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-t border-gray-100"
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
