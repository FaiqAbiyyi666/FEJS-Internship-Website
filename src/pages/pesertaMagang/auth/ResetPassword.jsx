import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Ambil token dari URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cek token saat halaman dimuat
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FA] px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Token Tidak Valid
          </h2>
          <p className="text-gray-600 mb-6">
            Token reset password tidak ditemukan. Silakan ulangi permintaan lupa
            password.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      // Panggil API backend 'resetPassword'
      const res = await fetch(
        `http://localhost:3000/api/auth/reset-password?token=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal mereset password.');
      }

      setSuccess(true); // Tampilkan pesan sukses
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan form jika belum sukses
  if (!success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FA] px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-[#002942] mb-6">
            Atur Password Baru
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#002942] mb-1">
                Password Baru
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#002942] mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Ulangi password baru"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#002942] to-[#006DA6] text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tampilkan pesan sukses jika sudah berhasil
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FA] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Password Berhasil Diubah!
        </h2>
        <p className="text-gray-600 mb-6">
          Anda sekarang dapat login dengan password baru Anda.
        </p>
        <button
          onClick={() => navigate('/login-peserta')}
          className="bg-[#006DA6] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
