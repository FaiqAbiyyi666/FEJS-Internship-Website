import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginMitra() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulasi login admin (tanpa fetch ke backend)
    if (email === 'admin@simagang.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard-admin');
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Kiri */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <Link to="/">
            <img
              src="/LogoSimagang.svg"
              alt="Logo SIMAGANG"
              className="h-12 mb-4"
            />
          </Link>
          <h2 className="text-2xl font-bold text-[#004A72] mb-2">
            Masuk Akun ADMIN dan BIDANG
          </h2>

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
                href="/lupa-password"
                className="text-[#004A72] hover:underline font-semibold"
              >
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#004A72] text-white py-2 rounded-md hover:bg-[#005b8c] transition"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>

      {/* Background Kanan */}
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
