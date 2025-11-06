import React, { useState, useEffect } from 'react';
import UlasanMagangPage from './UlasanMagangPage'; // Impor form 'bodoh'

// Komponen 'wrapper' inilah yang Anda letakkan di halaman dashboard Anda
export default function FormUlasanWrapper() {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAjuanId, setSelectedAjuanId] = useState(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Anda harus login');

        const response = await fetch(
          'http://localhost:3000/api/peserta/ulasan-magang/status',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await response.json();
        if (!result.status) throw new Error(result.message);

        setEligibilityData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibility();
  }, []);

  // Fungsi untuk membuka modal
  const handleOpenModal = (ajuanId) => {
    setSelectedAjuanId(ajuanId);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal (dikirim ke UlasanMagangPage)
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAjuanId(null);
    // Refresh data kelayakan
    window.location.reload(); // Cara mudah, bisa diganti fetch ulang
  };

  if (isLoading) {
    return <div className="text-center p-4">Mengecek status magang...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white space-y-4 p-4 border rounded-lg text-center">
      <h2 className="text-xl font-semibold">Ulasan Magang Anda</h2>
      {eligibilityData.length === 0 && (
        <p className="text-gray-500">
          Anda tidak memiliki data magang yang telah disetujui.
        </p>
      )}

      {eligibilityData.map((ajuan) => (
        <div
          key={ajuan.ajuanId}
          className="p-4 border rounded-md flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{ajuan.temaMagang}</h3>
            <p
              className={`text-sm ${
                ajuan.eligible ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {ajuan.message}
            </p>
          </div>

          {/* INILAH LOGIKA UTAMA: Tampilkan tombol HANYA jika 'eligible' */}
          {ajuan.eligible && (
            <button
              onClick={() => handleOpenModal(ajuan.ajuanId)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
            >
              Beri Ulasan
            </button>
          )}
        </div>
      ))}

      {/* Modal untuk menampilkan form ulasan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-lg w-full">
            {/* Kirimkan ajuanId dan fungsi 'onSubmit' (untuk menutup modal) 
              ke komponen form 'bodoh' 
            */}
            <UlasanMagangPage
              ajuanId={selectedAjuanId}
              onSubmit={handleCloseModal}
            />
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 text-sm text-gray-600 w-full text-center"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
