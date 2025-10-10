import { useState, useContext, useRef } from 'react';
import { FormDataContext } from './PengajuanMagangPage';

// Ikon untuk tombol hapus
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function UnggahBerkas() {
  const { formData, setFormData } = useContext(FormDataContext);
  const [errors, setErrors] = useState({});
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const fileInputRefs = {
    suratBakesbangSDA: useRef(null),
    suratBakesbangProv: useRef(null),
    suratPengantar: useRef(null),
    proposalMagang: useRef(null),
    cvPeserta: useRef(null),
    ktp: useRef(null),
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const isFileTypeAllowed = file.type === 'application/pdf';
      const isFileSizeAllowed = file.size <= MAX_SIZE;

      if (!isFileTypeAllowed || !isFileSizeAllowed) {
        setErrors((prev) => ({
          ...prev,
          [name]: !isFileTypeAllowed
            ? 'Hanya file PDF yang diizinkan.'
            : 'Ukuran file maksimal 5MB.',
        }));
        setFormData((prev) => ({ ...prev, [name]: null }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: '' }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleRemoveFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    if (fileInputRefs[name].current) {
      fileInputRefs[name].current.value = '';
    }
  };

  const renderFileInput = (label, name, description = null) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <input
        ref={fileInputRefs[name]}
        id={`file-input-${name}`}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileChange(e, name)}
        className="hidden"
      />

      <div
        className={`form-input w-full flex items-center p-0 ${
          errors[name] ? 'border-red-500' : ''
        }`}
      >
        <label
          htmlFor={`file-input-${name}`}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-l-md border-r border-gray-300 cursor-pointer transition-colors whitespace-nowrap"
        >
          Choose File
        </label>

        <div className="px-3 truncate flex-grow flex items-center">
          {/* 👇 PERBAIKAN: Nama file kembali dijadikan link untuk pratinjau */}
          {formData[name] ? (
            <a
              href={URL.createObjectURL(formData[name])}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline truncate"
              title={formData[name].name}
            >
              {formData[name].name}
            </a>
          ) : (
            <span className="text-sm text-gray-500">No file chosen</span>
          )}
        </div>

        {formData[name] && (
          <button
            type="button"
            onClick={() => handleRemoveFile(name)}
            className="text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full p-1 mr-2"
            title="Hapus file"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#002942] text-center">
        Unggah Berkas Magang
      </h2>

      {/* 👇 PERBAIKAN: Typo grid layout dari md-grid-cols-2 menjadi md:grid-cols-2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {renderFileInput(
          'Surat Rekomendasi Bakesbangpol Sidoarjo',
          'suratBakesbangSDA',
          '*) Wajib bagi semua peserta magang'
        )}
        {renderFileInput(
          'Surat Rekomendasi Bakesbangpol Provinsi',
          'suratBakesbangProv',
          '*) Wajib bagi calon peserta magang yang instansinya di luar Sidoarjo'
        )}
        {renderFileInput('Surat Pengantar Instansi', 'suratPengantar')}
        {renderFileInput('Proposal Magang', 'proposalMagang')}
        {renderFileInput('Curriculum Vitae (CV)', 'cvPeserta')}
        {renderFileInput('KTP / Kartu Pelajar / Kartu Mahasiswa', 'ktp')}
      </div>
    </div>
  );
}
