import React, { useState, useEffect, useRef } from 'react';

function StatistikCard({ title, value, imageUrl }) {
  const formattedValue = new Intl.NumberFormat('id-ID').format(value);

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1">
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

  const effectRan = useRef(false);

  useEffect(() => {
    // 3. Cek apakah efek sudah berjalan (di development)
    if (effectRan.current === true) {
      return; // Hentikan jika ini adalah 'Run 2' dari Strict Mode
    }

    // Tandai bahwa 'Run 1' sedang berjalan
    effectRan.current = true;

    // --- Semua logika Anda sekarang aman di dalam sini ---

    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/peserta/statistik'
        );
        if (!response.ok) {
          throw new Error('Gagal mengambil data statistik');
        }
        const result = await response.json();
        return result.data;
      } catch (err) {
        setError(err.message);
        return { pengunjung: 150, aktif: 50, lulus: 75, pendaftar: 200 };
      }
    };

    const incrementVisit = async () => {
      try {
        await fetch('http://localhost:3000/api/peserta/statistik/increment', {
          method: 'POST',
        });
      } catch (err) {
        console.error('Gagal menambah hitungan pengunjung:', err);
        sessionStorage.removeItem('sessionTracked');
      }
    };

    const checkSessionAndFetch = async () => {
      let statsData = await fetchData();
      const sessionTracked = sessionStorage.getItem('sessionTracked');

      if (!sessionTracked) {
        sessionStorage.setItem('sessionTracked', 'true');
        incrementVisit();
        statsData = {
          ...statsData,
          pengunjung: statsData.pengunjung + 1,
        };
      }

      setStats(statsData);
      setLoading(false);
    };

    checkSessionAndFetch();
  }, []);

  const renderContent = () => {
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

    if (stats) {
      return (
        <>
          <StatistikCard
            title="Pengunjung Website Tahun Ini"
            value={stats.pengunjung}
            imageUrl="/statistik_pict/pengunjungWebsite2.jpg"
          />
          <StatistikCard
            title="Peserta Magang yang Aktif"
            value={stats.aktif}
            imageUrl="/statistik_pict/pesertaAktif2.jpg"
          />
          <StatistikCard
            title="Peserta Magang yang Telah Lulus"
            value={stats.lulus}
            imageUrl="/statistik_pict/graduatePeserta2.jpg"
          />
          <StatistikCard
            title="Jumlah Peserta yang Telah Mendaftar Magang"
            value={stats.pendaftar}
            imageUrl="/statistik_pict/jumlahPeserta2.jpg"
          />
        </>
      );
    }

    return null;
  };

  return (
    <section className="bg-[#ffffff] py-12">
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
