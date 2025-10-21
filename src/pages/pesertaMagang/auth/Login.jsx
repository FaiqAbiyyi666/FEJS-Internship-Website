import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login gagal, coba lagi.');
        setLoading(false);
        return;
      }

      // Simpan token JWT & user ke localStorage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userId', data.data.user.id);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Cek role
      if (data.data.user.role === 'peserta_magang') {
        navigate('/'); // ✅ arahkan ke dashboard peserta
      } else if (data.data.user.role === 'admin') {
        navigate('/dashboard-admin'); // ✅ arahkan ke dashboard admin
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Logo SIMAGANG */}
          <Link to="/">
            <img
              src="/LogoSimagang.svg"
              alt="Logo SIMAGANG"
              className="h-12 mb-4"
            />
          </Link>

          <h2 className="text-2xl font-bold text-[#004A72] mb-2">
            Masuk ke Akun Anda
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-bold text-[#004A72]">Masuk</span> dan dapatkan
            akses penuh untuk mengatur proses magang Anda!
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004A72]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004A72]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#004A72]" />
                Ingat saya
              </label>
              <a
                href="/forgot-password"
                className="text-[#004A72] hover:underline font-semibold"
              >
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004A72] text-white py-2 rounded-md hover:bg-[#005b8c] transition disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-2 text-sm text-left">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="text-[#004A72] font-bold hover:underline"
            >
              Daftar
            </a>
          </p>

          {/* Tambahan: Login sebagai Admin */}
          <div className="mt-2 text-sm text-left">
            <span className="text-black">Login sebagai </span>
            <Link
              to="/login-admin"
              className="text-[#004A72] font-bold hover:underline"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Kanan: Background dan Teks */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative items-center justify-center"
        style={{ backgroundImage: `url('/bg-login.png')` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
          <img
            src="/logo-kominfo.svg"
            alt="Logo Kominfo"
            className="h-10 mb-2 mx-auto"
          />
          <p className="text-white font-medium text-sm leading-tight">
            Dinas Komunikasi dan Informatika
            <br />
            Kabupaten Sidoarjo
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg px-6 text-center font-light">
          Tingkatkan Pengalaman Magang Bersama Diskominfo Sidoarjo
        </div>
      </div>
    </div>
  );
}
