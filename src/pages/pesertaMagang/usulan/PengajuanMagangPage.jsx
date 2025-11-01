import React, { useState, createContext } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';
import Navbar from '../../../../src/components/navigations/Navbar';

export const FormDataContext = createContext(null);

export default function PengajuanMagangPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Formulir
    namaLengkap: '',
    nis_nim: '',
    kategori: '',
    statusPendidikan: '',
    jenjangPendidikan: '',
    instansi: '',
    jurusan: '',
    durasiMulai: '',
    durasiSelesai: '',
    tema: '',
    // Step 2: Berkas
    suratBakesbangSDA: null,
    suratBakesbangProv: null,
    suratPengantar: null,
    proposalMagang: null,
    cvPeserta: null,
    ktp: null,
    // Step 3: Bidang
    bidangPilihan: '',
    // Step 4: Konfirmasi
    isAgreed: false,
  });

  const steps = [
    { label: 'Formulir Pendaftaran', path: 'formulir' },
    { label: 'Unggah Berkas', path: 'berkas' },
    { label: 'Pilih Bidang', path: 'bidang' },
    { label: 'Simpan', path: 'konfirmasi' },
  ];

  const currentPath = location.pathname.split('/').pop();
  const currentStepIndex = steps.findIndex((step) => step.path === currentPath);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(`/pengajuan-magang/${steps[currentStepIndex + 1].path}`);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      navigate(`/pengajuan-magang/${steps[currentStepIndex - 1].path}`);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowModal(false);
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Autentikasi gagal. Silakan login kembali.');
      }

      const data = new FormData();

      data.append('namaLengkap', formData.namaLengkap);
      data.append('nis_nim', formData.nis_nim);
      data.append('kategori', formData.kategori);
      data.append('statusPendidikan', formData.statusPendidikan);
      data.append('jenjangPendidikan', formData.jenjangPendidikan);
      data.append('instansi', formData.instansi);
      data.append('jurusan', formData.jurusan);
      data.append('durasiMulai', formData.durasiMulai);
      data.append('durasiSelesai', formData.durasiSelesai);
      data.append('tema', formData.tema);
      data.append('bidangPilihan', formData.bidangPilihan);

      data.append('proposal_magang', formData.proposalMagang);
      data.append('cv', formData.cvPeserta);
      data.append('ktp', formData.ktp);
      data.append('surat_pengantar', formData.suratPengantar);
      data.append('surat_bakesbang_sda', formData.suratBakesbangSDA);
      data.append('surat_bakesbang_prov', formData.suratBakesbangProv);

      const response = await fetch(
        'http://localhost:3000/api/peserta/ajuan-magang',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim ajuan.');
      }

      setIsLoading(false);
      console.log('Ajuan berhasil dikirim:', result.data);
      alert('Data berhasil disimpan!');
      navigate('/usulan');
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      console.error('Error saat submit:', err);
      alert(`Terjadi kesalahan: ${err.message}`);
    }
  };

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      <Navbar />
      <div className="pt-[100px] min-h-screen bg-[#F5F7FA] px-6">
        <div className="max-w-6xl mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/usulan')}
              className="text-sm text-[#006DA6] hover:underline bg-white border-2 border-[#006DA6] px-4 py-2 rounded-lg font-semibold hover:bg-[#f0f9ff] transition-all"
            >
              ← Kembali ke Usulan
            </button>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#002942] to-[#006DA6] bg-clip-text text-transparent text-center flex-1">
              Laman Pengajuan Magang
            </h1>
            <div className="w-[160px]"></div>
          </div>

          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div
                key={step.label}
                onClick={() => navigate(`/pengajuan-magang/${step.path}`)}
                className={`flex-1 py-3 px-2 text-sm text-center font-medium border-b-4 transition-all duration-200 cursor-pointer ${
                  currentStepIndex === index
                    ? 'border-[#006DA6] text-[#006DA6]'
                    : 'border-transparent text-gray-500'
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-lg shadow p-6">
            <Outlet />
          </div>

          <div className="flex justify-between mt-6">
            {currentStepIndex > 0 ? (
              <button
                onClick={handlePrev}
                className="bg-[#006DA6] text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <FaArrowLeft /> Sebelumnya
              </button>
            ) : (
              <div></div>
            )}

            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-[#006DA6] text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                Selanjutnya <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                disabled={!formData.isAgreed}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 ${
                  formData.isAgreed
                    ? 'bg-[#DDB900] text-black font-medium hover:bg-yellow-500'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                <FaSave /> Simpan
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <ModalKonfirmasi
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </FormDataContext.Provider>
  );
}

function ModalKonfirmasi({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">
          Apakah anda setuju untuk mengirim berkas pengajuan magang?
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-[#B00000] hover:bg-red-800 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#006DA6] hover:bg-[#005580] text-white font-semibold py-2 px-6 rounded-lg"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
}
