// src/components/navigations/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaUser,
  FaTachometerAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState('/');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setIsLoggedIn(false);
      return;
    }

    fetch(`http://localhost:3000/api/peserta/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setUser(data.data);
          setIsLoggedIn(true); // ✅ pastikan dianggap login
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        console.error('Gagal fetch user navbar:', err);
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login-peserta');
  };

  const handleScroll = (id) => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActive(`#${id}`);
      }
    }, 100);
  };

  const formatTanggalIndonesia = (tanggalISO) => {
    const hari = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const date = new Date(tanggalISO);
    return `${hari[date.getDay()]}, ${date.getDate()} ${
      bulan[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const notifikasi = [
    {
      id: 1,
      tipe: 'usulan',
      judul: 'Usulan',
      isi: 'Pendaftaran magang berhasil, silakan pantau pengumumannya.',
      tanggal: '2025-05-27',
      status: 'sukses',
    },
    {
      id: 2,
      tipe: 'logbook',
      judul: 'Logbook',
      isi: 'Pengisian logbook berhasil, jangan lupa mengisi selanjutnya.',
      tanggal: '2025-07-13',
      status: 'sukses',
    },
    {
      id: 3,
      tipe: 'autentikasi',
      judul: 'Login Gagal',
      isi: 'Login gagal, pastikan email dan password benar.',
      tanggal: '2025-07-16',
      status: 'gagal',
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-[100px] py-6 px-6 md:px-28 flex items-center justify-between">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname !== '/') navigate('/');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src="/LogoSimagang.svg" alt="SIMAGANG" className="h-12" />
        </Link>

        {/* Mobile menu button + notif */}
        <div className="flex items-center gap-4 md:hidden">
          {isLoggedIn && (
            <div ref={notifRef} className="relative">
              <FaBell
                className="text-[#002942] text-xl cursor-pointer hover:text-[#006DA6]"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
              />
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-[300px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                  <h3 className="text-center text-lg font-semibold py-3 border-b">
                    Notifikasi
                  </h3>
                  <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {notifikasi.map((notif) => (
                      <li
                        key={notif.id}
                        className="flex gap-3 px-4 py-3 text-sm items-start"
                      >
                        <div className="mt-1 text-lg">
                          {notif.tipe === 'usulan' && (
                            <FaEnvelope className="text-[#006DA6]" />
                          )}
                          {notif.tipe === 'logbook' && (
                            <FaTachometerAlt className="text-[#006DA6]" />
                          )}
                          {notif.tipe === 'autentikasi' && (
                            <FaUser
                              className={
                                notif.status === 'sukses'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold text-base">
                              {notif.judul}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTanggalIndonesia(notif.tanggal)}
                            </p>
                          </div>
                          <p className="text-gray-700 text-sm mt-1 leading-snug">
                            {notif.isi}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <button
            className="text-[#002942] text-xl"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Menu tengah (desktop) */}
      <ul className="hidden md:flex gap-8 text-sm text-[#002942] font-medium">
        {[
          ['/', 'Beranda'],
          ['#kuota-magang', 'Informasi Lowongan'],
          ['#tata-cara', 'Cara Mendaftar'],
        ].map(([hash, label]) => (
          <li key={hash}>
            <button
              onClick={() => handleScroll(hash.replace('#', ''))}
              className={`transition-colors ${
                active === hash
                  ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#002942] to-[#006DA6]'
                  : 'hover:text-[#006DA6]'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Login/Profile (desktop) */}
      <div className="hidden md:flex">
        {isLoggedIn ? (
          <div className="flex items-center gap-6 relative">
            {/* Notifikasi */}
            <div ref={notifRef} className="relative">
              <FaBell
                className="text-[#002942] text-xl cursor-pointer hover:text-[#006DA6]"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
              />
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-[500px] bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                  <h3 className="text-center text-lg font-semibold py-4 border-b">
                    Notifikasi
                  </h3>
                  <ul className="divide-y divide-gray-200 max-h-[480px] overflow-y-auto">
                    {notifikasi.map((notif) => (
                      <li
                        key={notif.id}
                        className="flex gap-4 px-5 py-4 text-sm items-start"
                      >
                        <div className="mt-1 text-xl">
                          {notif.tipe === 'usulan' && (
                            <FaEnvelope className="text-[#006DA6]" />
                          )}
                          {notif.tipe === 'logbook' && (
                            <FaTachometerAlt className="text-[#006DA6]" />
                          )}
                          {notif.tipe === 'autentikasi' && (
                            <FaUser
                              className={
                                notif.status === 'sukses'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold text-base">
                                {notif.judul}
                              </p>
                              <p className="text-gray-700 text-sm mt-1 leading-snug">
                                {notif.isi}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatTanggalIndonesia(notif.tanggal)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profil */}
            <div ref={profileRef} className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-xl bg-gradient-to-r from-[#002942] to-[#006DA6]"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src={user?.foto || '/default-profile.png'}
                  alt="Foto Profil"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <span className="text-sm text-white font-medium truncate max-w-[120px]">
                  {user?.namaLengkap || user?.email || 'User'}
                </span>
                <svg
                  className="w-3 h-3 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-[300px] bg-white border rounded shadow-lg text-sm p-6 z-50 text-[#002942]">
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 hover:text-[#006DA6]"
                      >
                        <FaUser /> Profil
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 hover:text-[#006DA6]"
                      >
                        <FaTachometerAlt /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/usulan"
                        className="flex items-center gap-3 hover:text-[#006DA6]"
                      >
                        <FaEnvelope /> Usulan Magang
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 hover:text-red-600 text-red-600 w-full"
                      >
                        <FaSignOutAlt /> Keluar
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/register"
              className="border-2 border-[#002942] text-[#002942] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#002942] hover:text-white"
            >
              Daftar
            </Link>
            <Link
              to="/login-peserta"
              className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-[#006DA6] hover:to-[#006DA6]"
            >
              Masuk
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
