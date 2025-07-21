import { useState } from 'react';

export default function UnggahBerkas() {
  const [files, setFiles] = useState({
    suratPengantar: null,
    proposalMagang: null,
    cvPeserta: null,
    fotoPeserta: null,
  });

  const [errors, setErrors] = useState({});
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const allowedFileTypes = {
    suratPengantar: ['application/pdf'],
    proposalMagang: ['application/pdf'],
    cvPeserta: ['application/pdf'],
    fotoPeserta: ['image/jpeg', 'image/jpg', 'image/png'],
  };

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];

    if (file) {
      const isFileTypeAllowed = allowedFileTypes[name]?.includes(file.type);
      const isFileSizeAllowed = file.size <= MAX_SIZE;

      if (!isFileTypeAllowed) {
        setErrors((prev) => ({
          ...prev,
          [name]: `Format file tidak valid. ${
            name === 'fotoPeserta'
              ? 'Hanya JPG atau PNG yang diperbolehkan.'
              : 'Hanya PDF yang diperbolehkan.'
          }`,
        }));
        setFiles((prev) => ({
          ...prev,
          [name]: null,
        }));
        return;
      }

      if (!isFileSizeAllowed) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Ukuran file maksimal 5MB',
        }));
        setFiles((prev) => ({
          ...prev,
          [name]: null,
        }));
        return;
      }

      // File valid
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
      setFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const renderFileInput = (label, name, accept) => (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type="file"
        className="form-input"
        accept={accept}
        onChange={(e) => handleFileChange(e, name)}
      />
      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
      )}
      {files[name] && (
        <div className="text-sm mt-1 text-blue-600 underline">
          <a
            href={URL.createObjectURL(files[name])}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat file: {files[name].name}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#002942] text-center">
        Unggah Berkas Magang
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFileInput('Surat Pengantar', 'suratPengantar', '.pdf')}
        {renderFileInput('Proposal Magang', 'proposalMagang', '.pdf')}
        {renderFileInput('Curriculum Vitae (CV)', 'cvPeserta', '.pdf')}
        {renderFileInput('Pas Foto 3x4', 'fotoPeserta', '.jpg,.jpeg,.png')}
      </div>
    </div>
  );
}
