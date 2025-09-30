import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';
import Navbar from '../../../../src/components/navigations/Navbar';
import FormulirPendaftaran from './FormulirPendaftaran';
import UnggahBerkas from './UnggahBerkas';
import PilihBidang from './PilihBidang';
import KonfirmasiSimpan from './KonfirmasiSimpan';

export default function PengajuanMagangPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const steps = [
    'Formulir Pendaftaran Magang',
    'Unggah Berkas',
    'Pilih Bidang',
    'Simpan',
  ];

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <FormulirPendaftaran />;
      case 1:
        return <UnggahBerkas />;
      case 2:
        return <PilihBidang />;
      case 3:
        return (
          <KonfirmasiSimpan isAgreed={isAgreed} setIsAgreed={setIsAgreed} />
        );
      default:
        return null;
    }
  };

  const handleConfirmSubmit = () => {
    setShowModal(false);
    alert('Data berhasil disimpan!');
    // lanjutkan simpan ke backend jika diperlukan
  };

  return (
    <>
      <Navbar />
      <div className="pt-[100px] min-h-screen bg-[#F5F7FA] px-6">
        <div className="max-w-6xl mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/usulan')}
              className="text-sm text-[#006DA6] hover:underline bg-white border-2 border-[#006DA6] px-4 py-2 rounded-lg font-semibold hover:bg-[#f0f9ff] transition-all"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#002942] to-[#006DA6] bg-clip-text text-transparent text-center flex-1">
              Laman Pengajuan Magang
            </h1>
            <div className="w-[110px]"></div>
          </div>

          <div className="flex items-center justify-between mb-6">
            {steps.map((label, index) => (
              <button
                key={label}
                onClick={() => setStep(index)}
                className={`flex-1 py-3 px-2 text-sm font-medium border-b-4 transition-all duration-200 ${
                  step === index
                    ? 'border-[#006DA6] text-[#006DA6]'
                    : 'border-transparent text-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white border rounded-lg shadow p-6">
            {renderStepComponent()}
          </div>

          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="bg-[#006DA6] text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <FaArrowLeft />
                Sebelumnya
              </button>
            ) : (
              <div></div>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((prev) => prev + 1)}
                className="bg-[#006DA6] text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                Selanjutnya
                <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                disabled={!isAgreed}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 ${
                  isAgreed
                    ? 'bg-[#DDB900] text-black font-medium hover:bg-yellow-500'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                <FaSave />
                Simpan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal ditaruh di bawah */}
      {showModal && (
        <ModalKonfirmasi
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </>
  );
}

// Modal Konfirmasi disimpan di bawah
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
