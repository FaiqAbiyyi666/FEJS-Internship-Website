import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../../src/components/navigations/Navbar';

export default function DetailUsulanMagang() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data sesuai ID
  const detailData = {
    id: id,
    tanggal: '2025-07-01',
    tema: 'Penerapan Sistem Informasi Manajemen',
    periode: 'Agustus - November 2025',
    bidang: 'Pemrograman Web',
    status: 'Menunggu',
    namaLengkap: 'Faiq Abiyyi',
    nim: '123456789',
    jurusan: 'Sistem Informasi',
    universitas: 'UPN Veteran Jawa Timur',
    email: 'faiq@example.com',
    noHp: '081234567890',
    berkas: {
      suratPengantar: '/berkas/surat-pengantar.pdf',
      transkripNilai: '/berkas/transkrip.pdf',
      cv: '/berkas/cv.pdf',
    },
  };

  const renderField = (label, value) => (
    <div>
      <label className="block text-gray-600 text-sm mb-1">{label}</label>
      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800">
        {value}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="pt-[120px] min-h-screen bg-[#F5F7FA] px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-[#006DA6] hover:underline bg-white border-2 border-[#006DA6] px-4 py-2 rounded-lg font-semibold hover:bg-[#f0f9ff] transition-all"
            >
              ← Kembali
            </button>
            <h1 className="text-xl font-bold text-[#006DA6] text-center flex-1">
              Detail Usulan Magang
            </h1>
            <div className="w-[60px]">{/* Spacer to balance flex */}</div>
          </div>

          <div className="space-y-4 text-sm">
            {renderField('ID Magang', detailData.id)}
            {renderField('Tanggal Pengajuan', detailData.tanggal)}
            {renderField('Tema Magang', detailData.tema)}
            {renderField('Periode Magang', detailData.periode)}
            {renderField('Bidang', detailData.bidang)}
            {renderField('Status', detailData.status)}

            <hr className="my-6" />

            {renderField('Nama Lengkap', detailData.namaLengkap)}
            {renderField('NIM', detailData.nim)}
            {renderField('Jurusan', detailData.jurusan)}
            {renderField('Universitas', detailData.universitas)}
            {renderField('Email', detailData.email)}
            {renderField('No. HP', detailData.noHp)}

            <hr className="my-6" />

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Berkas Pendukung:
              </label>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  <a
                    href={detailData.berkas.suratPengantar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Surat Pengantar
                  </a>
                </li>
                <li>
                  <a
                    href={detailData.berkas.transkripNilai}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Transkrip Nilai
                  </a>
                </li>
                <li>
                  <a
                    href={detailData.berkas.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Curriculum Vitae (CV)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
