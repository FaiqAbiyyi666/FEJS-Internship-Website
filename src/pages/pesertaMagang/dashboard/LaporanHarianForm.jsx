import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../../../components/modals/Modal';

export default function LaporanHarianForm() {
  const navigate = useNavigate();
  const { minggu, hari } = useParams(); // ambil param dari URL

  const weekIndex = parseInt(minggu, 10);
  const dayIndex = parseInt(hari, 10);

  const [modalIndex, setModalIndex] = useState(null); // untuk input modal
  const [showFullIndex, setShowFullIndex] = useState(null); // untuk detail modal
  const [hariData, setHariData] = useState([
    {
      hari: 'Senin',
      tanggal: '30 November 2026',
      isi: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      hari: 'Selasa',
      tanggal: '1 Desember 2026',
      isi: '',
    },
    {
      hari: 'Rabu',
      tanggal: '2 Desember 2026',
      isi: '',
    },
    {
      hari: 'Kamis',
      tanggal: '3 Desember 2026',
      isi: '',
    },
    {
      hari: 'Jumat',
      tanggal: '4 Desember 2026',
      isi: '',
    },
  ]);

  const handleBack = () => navigate('/dashboard/laporan');

  const handleSubmitIsi = (index, text) => {
    const updated = [...hariData];
    updated[index].isi = text;
    setHariData(updated);
    setModalIndex(null);
  };

  return (
    <>
      {/* Modal Input */}
      {modalIndex !== null && (
        <Modal onClose={() => setModalIndex(null)}>
          <h2 className="text-xl font-bold text-center">Laporan Harian</h2>
          <p className="text-center mb-4">
            {hariData[modalIndex].hari}, {hariData[modalIndex].tanggal}
          </p>
          <label className="block font-semibold text-gray-700 mb-2">
            Bagaimana kegiatanmu hari ini?
          </label>
          <textarea
            className="w-full h-40 border rounded p-3 text-sm mb-4"
            placeholder="Tips: Deskripsikan kegiatanmu hari ini"
            defaultValue={hariData[modalIndex].isi}
            onBlur={(e) => handleSubmitIsi(modalIndex, e.target.value)}
          />
          <div className="text-center">
            <button
              onClick={() =>
                handleSubmitIsi(
                  modalIndex,
                  document.querySelector('textarea').value
                )
              }
              className="bg-[#006DA6] text-white px-6 py-2 rounded"
            >
              Kirim
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Detail */}
      {showFullIndex !== null && (
        <Modal onClose={() => setShowFullIndex(null)}>
          <h2 className="text-xl font-bold mb-2">
            {hari[showFullIndex].hari}, {hari[showFullIndex].tanggal}
          </h2>
          <hr className="my-6 border-t border-gray-200" />
          <p className="text-gray-800 whitespace-pre-line">
            {hari[showFullIndex].isi}
          </p>
        </Modal>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded shadow h-fit">
          <button
            onClick={handleBack}
            className="text-[#006DA6] flex items-center gap-1 mb-4 font-bold"
          >
            <span className="text-lg">←</span> Kembali
          </button>
          <p className="text-[#FF6B00] font-semibold mb-1">✏️ Belum Dibuat</p>
          <h2 className="text-lg font-bold">30 Nov – 4 Des 2026</h2>
          <hr className="my-4 border-t border-gray-300" />
          <div className="flex justify-between px-2">
            {hariData.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold">{item.hari[0]}</span>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
                    item.isi
                      ? 'bg-blue-500 text-white border-black border-2'
                      : 'bg-gray-200 text-gray-500 border-gray-500'
                  }`}
                >
                  {item.isi ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Konten laporan */}
        <div className="flex-1 space-y-6">
          {hariData.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded shadow">
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold ${
                    item.isi
                      ? 'bg-blue-500 text-white border-black'
                      : 'bg-gray-200 text-gray-500 border-gray-400'
                  }`}
                >
                  {item.isi ? '✓' : ''}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg mb-1">{item.hari}</h3>
                  <p className="text-sm text-gray-600">{item.tanggal}</p>
                </div>
              </div>

              {item.isi ? (
                <>
                  <div>
                    <p className="text-gray-700 mb-2 line-clamp-2">
                      {item.isi}
                    </p>
                    {item.isi.split(' ').length > 20 && (
                      <button
                        onClick={() => setShowFullIndex(i)}
                        className="text-[#006DA6] font-semibold text-sm"
                      >
                        selengkapnya
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <hr className="border-t border-gray-200 w-full my-6" />
                  <div className="flex justify-center">
                    <button
                      onClick={() => setModalIndex(i)}
                      className="bg-[#006DA6] text-white px-6 py-2 rounded"
                    >
                      Buat Laporan Harian
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
