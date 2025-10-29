import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function UlasanMagangPage({ onSubmit }) {
  const [ulasan, setUlasan] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (rating === 0 || ulasan.trim() === '') {
      alert('Silakan isi ulasan dan pilih rating.');
      return;
    }

    setIsLoading(true);

    // Kirim data ke API
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Langsung gagalkan jika user tidak punya token
        throw new Error('Autentikasi gagal. Silakan login kembali.');
      }

      // 2. Siapkan headers dengan token
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // <-- TAMBAHKAN INI
      };

      const response = await fetch(
        'http://localhost:3000/api/peserta/ulasan-magang',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ ulasan, rating }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengirim ulasan');
      }

      // Jika sukses
      setMessage({ type: 'success', text: 'Ulasan berhasil dikirim!' });
      setUlasan('');
      setRating(0);
      setHover(null);

      // Panggil prop onSubmit jika ada (misal untuk menutup modal)
      if (onSubmit) {
        onSubmit({ ulasan, rating });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {/* Judul rata tengah */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Berikan Ulasan Magang
      </h2>

      {/* Tampilkan pesan sukses atau error */}
      {message && (
        <div
          className={`p-3 rounded-md mb-4 text-center ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {message?.type !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (rest of the form: textarea, rating stars) ... */}
          {/* Input Ulasan */}
          <div>
            <label className="block text-gray-700 mb-2">Ulasan</label>
            <textarea
              value={ulasan}
              onChange={(e) => setUlasan(e.target.value)}
              rows="4"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              placeholder="Tulis pengalaman magang kamu..."
              disabled={isLoading}
            />
          </div>

          {/* Rating Bintang */}
          <div className="text-center">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => !isLoading && setRating(star)}
                  onMouseEnter={() => !isLoading && setHover(star)}
                  onMouseLeave={() => !isLoading && setHover(null)}
                  disabled={isLoading}
                >
                  <FaStar
                    className={`h-6 w-6 ${
                      star <= (hover || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#005a88] transition disabled:bg-gray-400"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
