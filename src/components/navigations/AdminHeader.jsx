import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';

// Menerima props 'user' dari AdminDashboard
const AdminHeader = ({ title, user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login-admin');
  };

  // Helper Format Role agar enak dibaca
  const formatRoleLabel = (role, bidangName) => {
    if (!role) return 'Memuat...';

    if (role === 'admin') {
      return 'Super Admin';
    }

    if (role === 'sub_koordinator_bidang') {
      // Jika ada nama bidang, tampilkan. Jika tidak, tampilkan default.
      return bidangName ? `Sub Koor Bidang - ${bidangName}` : 'Sub Koordinator Bidang';
    }

    return role;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Data Display Logic
  const displayName = user?.nama || 'Administrator';
  const displayRole = formatRoleLabel(user?.role, user?.bidang?.nama);
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#002942]">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola sistem magang dengan mudah
          </p>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* User Dropdown */}
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
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
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
