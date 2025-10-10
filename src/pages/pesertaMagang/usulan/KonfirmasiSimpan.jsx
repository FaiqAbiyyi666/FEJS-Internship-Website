import { useContext } from 'react';
import { FormDataContext } from './PengajuanMagangPage'; // Pastikan path import ini benar

// 1. Hapus props 'isAgreed' dan 'setIsAgreed'
export default function KonfirmasiSimpan() {
  // 2. Gunakan Context untuk mendapatkan state dan setter
  const { formData, setFormData } = useContext(FormDataContext);

  const handleAgreementChange = (e) => {
    // 3. Update properti 'isAgreed' di dalam state terpusat 'formData'
    setFormData((prevData) => ({
      ...prevData,
      isAgreed: e.target.checked,
    }));
  };

  return (
    <div className="space-y-6 text-[#002942]">
      {/* Pakta Integritas */}
      <div>
        <h2 className="text-lg font-bold text-center mb-4">Pakta Integritas</h2>
        <p className="font-semibold mt-2">
          Dalam rangka pelaksanaan magang di lingkungan Unit Pelaksanaan Daerah
          Kabupaten Sidoarjo, peserta magang diwajibkan:
        </p>
        <ol className="list-decimal list-inside text-gray-700 mt-2 space-y-1">
          <li>
            Menjaga kerahasiaan informasi maupun data yang diketahui dan/atau
            yang dimiliki berkaitan dengan Unit Pelaksana Daerah Kabupaten
            Sidoarjo dengan tidak memberikan dan/atau menyebarluaskan kepada
            pihak-pihak yang dapat memanfaatkannya untuk kepentingan
            pribadi/kelompok yang dapat berpotensi merugikan negara.
          </li>
          <li>
            Bersedia dikenakan sanksi sesuai peraturan perundang-undangan yang
            berlaku apabila lalai atau dengan sengaja berbuat sesuatu yang
            mengakibatkan tersebarnya data dan/atau informasi negara yang
            diketahui/dimiliki.
          </li>
        </ol>
      </div>

      {/* Tata Tertib */}
      <div>
        <h2 className="text-lg font-bold text-center">Tata Tertib</h2>
        <ol className="list-decimal list-inside text-gray-700 mt-2 space-y-1 font-semibold">
          <li>Mengikuti kegiatan magang hingga selesai</li>
          <li>Mematuhi seluruh ketentuan yang berlaku di unit magang</li>
          <li>Menjaga nama baik tempat dan unit magang</li>
        </ol>
      </div>

      {/* Persetujuan */}
      <div className="flex items-center space-x-3 bg-[#0093DD] text-white px-4 py-3 rounded-md">
        <input
          type="checkbox"
          id="setuju"
          // 4. Hubungkan checkbox ke state terpusat
          checked={formData.isAgreed}
          onChange={handleAgreementChange}
          className="form-checkbox w-5 h-5 bg-white border-white text-[#006DA6] focus:ring-offset-0 focus:ring-0"
        />
        <label htmlFor="setuju" className="text-sm font-semibold">
          Saya menyetujui terkait Pakta Integritas dan Tata Tertib di atas
        </label>
      </div>

      {/* Simpan Data */}
      <div>
        <h2 className="text-lg font-bold">Simpan Data</h2>
        <p className="text-gray-600 text-sm mt-1">
          Periksa kembali data dan berkas anda, pastikan semua data sudah benar,
          karena setelah mengirim data tidak bisa diubah!
        </p>
      </div>
    </div>
  );
}
