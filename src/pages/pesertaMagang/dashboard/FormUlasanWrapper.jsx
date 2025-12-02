import React, { useState, useEffect } from 'react';
import UlasanMagangPage from './UlasanMagangPage';

export default function FormUlasanWrapper() {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAjuanId, setSelectedAjuanId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

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

  const handleOpenModal = (ajuan) => {
    setSelectedAjuanId(ajuan.ajuanId);
    setSelectedReview(ajuan.existingReview);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAjuanId(null);
    setSelectedReview(null);
    window.location.reload();
  };

  if (isLoading) {
    return <div className="text-center p-4">Mengecek status magang...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white space-y-4 p-4 border rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
        Ulasan Magang
      </h2>
      {eligibilityData.length === 0 && (
        <p className="text-gray-500">
          Anda tidak memiliki data magang yang telah disetujui.
        </p>
      )}

      {eligibilityData.map((ajuan) => (
        <div
          key={ajuan.ajuanId}
          className="p-6 border rounded-md flex flex-col items-center justify-center text-center gap-3 shadow-sm bg-white"
        >
          <div className="w-full">
            <h3 className="font-semibold text-lg">{ajuan.namaBidang}</h3>
            <p
              className={`text-sm mt-1 ${
                ajuan.eligible ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {ajuan.message}
            </p>
          </div>

          {ajuan.eligible && (
            <button
              onClick={() => handleOpenModal(ajuan)}
              className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Beri Ulasan
            </button>
          )}

          {ajuan.status === 'COMPLETED' && (
            <button
              onClick={() => handleOpenModal(ajuan)}
              className="mt-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
            >
              Lihat Ulasan
            </button>
          )}
        </div>
      ))}

      {/* Modal untuk menampilkan form ulasan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-lg w-full">
            <UlasanMagangPage
              ajuanId={selectedAjuanId}
              existingReview={selectedReview}
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
