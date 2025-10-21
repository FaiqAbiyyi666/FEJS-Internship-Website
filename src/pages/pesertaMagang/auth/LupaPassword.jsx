import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  // State tambahan untuk user experience yang lebih baik
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Ganti simulasi dengan API call sungguhan
      const res = await fetch(
        'http://localhost:3000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal mengirim email.');
      }

      // Jika sukses, tampilkan pesan sukses
      setSuccess(true);
    } catch (err) {
      // Tangkap dan tampilkan error
      setError(err.message);
    } finally {
      // Hentikan loading
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FA] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#002942] mb-2">
          Lupa Password
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Masukkan email yang terdaftar untuk menerima tautan reset password.
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-sm font-medium">
              Tautan reset password telah berhasil dikirim ke email Anda.
              Silakan periksa kotak masuk (atau folder spam) Anda.
            </div>
            <button
              onClick={() => navigate('/login-peserta')}
              className="bg-[#006DA6] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#002942] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>

            {/* Tampilkan pesan error jika ada */}
            {error && (
              <p className="text-sm text-red-600 text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading} // Nonaktifkan tombol saat loading
              className="w-full bg-gradient-to-r from-[#002942] to-[#006DA6] text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
