import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function UlasanMagangPage({ onSubmit }) {
  const [ulasan, setUlasan] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0 || ulasan.trim() === '') {
      alert('Silakan isi ulasan dan pilih rating.');
      return;
    }

    if (onSubmit) {
      onSubmit({ ulasan, rating });
    } else {
      console.log('Data Ulasan:', { ulasan, rating });
    }

    setUlasan('');
    setRating(0);
    setHover(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {/* Judul rata tengah */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Berikan Ulasan Magang
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Ulasan */}
        <div>
          <label className="block text-gray-700 mb-2">Ulasan</label>
          <textarea
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            rows="4"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
            placeholder="Tulis pengalaman magang kamu..."
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
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
              >
                <FaStar
                  className={`h-6 w-6 ${
                    star <= (hover || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Tombol Submit rata tengah */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#005a88] transition"
          >
            Kirim Ulasan
          </button>
        </div>
      </form>
    </div>
  );
}
