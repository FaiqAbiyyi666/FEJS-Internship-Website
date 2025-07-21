import { useState } from 'react';
import { Star } from 'react-feather';
import { FaStar } from 'react-icons/fa';

const testimonies = [
  {
    name: 'Lisa Blackpink',
    bidang: 'Tata Kelola Informatika',
    tanggal: '2025-03-15',
    foto: '/images/lisa.jpg',
    ulasan: 'Lorem Ipsum dummy text...',
    rating: 4,
  },
  {
    name: 'Jennie Blackpink',
    bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
    tanggal: '2025-03-14',
    foto: '/images/jennie.jpg',
    ulasan: 'Lorem Ipsum dummy text...',
    rating: 5,
  },
  {
    name: 'Rose Blackpink',
    bidang: 'Sekretariat',
    tanggal: '2025-03-13',
    foto: '/images/rose.jpg',
    ulasan: 'Lorem Ipsum dummy text...',
    rating: 5,
  },
  {
    name: 'Jisoo Blackpink',
    bidang: 'Statistik',
    tanggal: '2025-03-12',
    foto: '/images/jisoo.jpg',
    ulasan: 'Lorem Ipsum dummy text...',
    rating: 4,
  },
];

function TestimoniCard({ data }) {
  return (
    <div className="bg-white rounded-xl border text-[#1F2937] p-6 shadow-sm w-full">
      <div className="flex items-start gap-4 mb-3">
        <img
          src={data.foto}
          alt="Foto peserta"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold">{data.name}</h3>
          <p className="text-sm text-gray-700">{data.bidang}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(data.tanggal).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
      <p className="text-gray-600 mb-3">{data.ulasan}</p>
      <div className="flex gap-1 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < data.rating ? '#FACC15' : 'none'}
            stroke="#FACC15"
          />
        ))}
      </div>
    </div>
  );
}

export default function AllTestimoniPage() {
  const [sortBy, setSortBy] = useState('terbaru');
  const [filterRating, setFilterRating] = useState('');
  const [filterBidang, setFilterBidang] = useState('');

  // Ambil bidang unik dari data
  const bidangOptions = [...new Set(testimonies.map((t) => t.bidang))];

  const sortedFiltered = [...testimonies]
    .filter((t) => (filterRating ? t.rating === parseInt(filterRating) : true))
    .filter((t) => (filterBidang ? t.bidang === filterBidang : true))
    .sort((a, b) => {
      if (sortBy === 'terbaru')
        return new Date(b.tanggal) - new Date(a.tanggal);
      if (sortBy === 'terlama')
        return new Date(a.tanggal) - new Date(b.tanggal);
      if (sortBy === 'bintang') return b.rating - a.rating;
      return 0;
    });

  return (
    <section className="py-16 px-4 bg-[#F9FBFD] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={() => history.back()}
            className="text-sm text-[#006DA6] hover:underline bg-white border-2 border-[#006DA6] px-4 py-2 rounded-lg font-semibold hover:bg-[#f0f9ff] transition-all"
          >
            ← Kembali
          </button>
          <h1 className="text-3xl font-bold text-[#006DA6] text-center md:text-left">
            Apa Kata Mereka?
          </h1>
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          {/* Urutkan berdasarkan */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 text-sm px-3 py-2 rounded-lg"
          >
            <option value="terbaru">Urutkan: Terbaru</option>
            <option value="terlama">Urutkan: Terlama</option>
            <option value="bintang">Urutkan: Bintang Tertinggi</option>
          </select>

          {/* Filter Rating */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border border-gray-300 text-sm px-3 py-2 rounded-lg"
          >
            <option value="">Semua Rating</option>
            {[5, 4, 3, 2, 1].map((val) => (
              <option key={val} value={val}>
                {val} <FaStar className="inline text-yellow-400" />
              </option>
            ))}
          </select>

          {/* Filter Bidang */}
          <select
            value={filterBidang}
            onChange={(e) => setFilterBidang(e.target.value)}
            className="border border-gray-300 text-sm px-3 py-2 rounded-lg"
          >
            <option value="">Semua Posisi Magang</option>
            {bidangOptions.map((bidang, idx) => (
              <option key={idx} value={bidang}>
                {bidang}
              </option>
            ))}
          </select>
        </div>

        {/* Card Testimoni */}
        <div className="space-y-6">
          {sortedFiltered.length > 0 ? (
            sortedFiltered.map((item, index) => (
              <TestimoniCard key={index} data={item} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada testimoni ditemukan.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
