import React, { useState, useEffect } from 'react';

function StatistikCard({ title, value, imageUrl }) {
  const formattedValue = new Intl.NumberFormat('id-ID').format(value);

  return (
    // 'transition-all' dan 'duration-300' telah dihapus dari sini
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1">
      <div className="w-full h-32 rounded-t-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={`Ilustrasi untuk ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-6 text-center">
        <p className="text-base font-semibold text-[#002942] mb-2 h-12 flex items-center justify-center">
          {title}
        </p>
        <p className="text-4xl font-bold text-[#006DA6]">{formattedValue}</p>
      </div>
    </div>
  );
}

function StatistikCardSkeleton() {
  return (
    // 'transition-all', 'duration-300', dan 'animate-pulse' telah dihapus
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="w-full h-32 rounded-t-lg bg-gray-200" />
      <div className="p-6 text-center">
        <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto" />
      </div>
    </div>
  );
}

export default function StatistikMagang() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/statistik');

        if (!response.ok) {
          throw new Error('Gagal mengambil data statistik');
        }

        const result = await response.json();
        setStats(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStats({
          pengunjung: 150,
          aktif: 50,
          lulus: 75,
          pendaftar: 200,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData(); // Hapus setTimeout ini di produksi
  }, []);

  const renderContent = () => {
    // 1. Saat Loading
    if (loading) {
      return (
        <>
          <StatistikCardSkeleton />
          <StatistikCardSkeleton />
          <StatistikCardSkeleton />
          <StatistikCardSkeleton />
        </>
      );
    }

    if (error && !stats) {
      return (
        <div className="lg:col-span-4 md:col-span-2 col-span-1 text-center py-10 bg-white border border-red-300 rounded-lg">
          <p className="text-red-500">
            Terjadi kesalahan saat memuat data: {error}
          </p>
        </div>
      );
    }

    // 3. Saat Sukses
    if (stats) {
      return (
        <>
          <StatistikCard
            title="Pengunjung Website Tahun Ini"
            value={stats.pengunjung}
            // Gambar: Tim/mahasiswa berkolaborasi di depan laptop
            imageUrl="/statistik_pict/pengunjungWebsite2.jpg"
          />
          <StatistikCard
            title="Peserta Magang yang Aktif"
            value={stats.aktif}
            // Gambar: Suasana kerja magang di kantor modern
            imageUrl="/statistik_pict/pesertaAktif2.jpg"
          />
          <StatistikCard
            title="Peserta Magang yang Telah Lulus"
            value={stats.lulus}
            // Gambar: Mahasiswa merayakan kelulusan/keberhasilan
            imageUrl="/statistik_pict/graduatePeserta2.jpg"
          />
          <StatistikCard
            title="Jumlah Peserta yang Telah Mendaftar Magang"
            value={stats.pendaftar}
            // Gambar: Seseorang mendaftar/mengisi form di laptop
            imageUrl="/statistik_pict/jumlahPeserta2.jpg"
          />
        </>
      );
    }

    return null; // Fallback jika tidak ada kondisi yang terpenuhi
  };

  return (
    <section className="bg-[#F7FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Judul Bagian */}
        <div className="text-center mb-12">
          <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-normal text-[#002942]">
            <span className="font-bold text-[#006DA6]">Statistik</span>{' '}
            <span className="text-[#002942]">Data Magang Saat Ini</span>
          </h2>
        </div>

        {/* Grid untuk Card Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
