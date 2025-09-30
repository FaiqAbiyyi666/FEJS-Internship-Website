import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../../src/components/navigations/Navbar';

export default function DetailUsulanMagang() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data sesuai ID
  const detailData = {
    id: id,
    tanggal: '2025-07-01',
    namaLengkap: 'Faiq Abiyyi',
    nim: '123456789',
    universitas: 'UPN Veteran Jawa Timur',
    jurusan: 'Sistem Informasi',
    kategori: 'Reguler',
    statusPendidikan: 'Kuliah',
    jenjangPendidikan: 'S1',
    tema: 'Penerapan Sistem Informasi Manajemen',
    periode: '12 Agustus - 12 November 2025',
    bidang: 'Infrastruktur & Keamanan TIK',
    status: 'Menunggu',
    berkas: {
      suratBakesbangProv: '/files/bakesbangprov-1.pdf',
      suratBakesbangSDA: '/files/bakesbangsda-1.pdf',
      suratPengantar: '/berkas/surat-pengantar.pdf',
      proposalMagang: '/files/proposal-1.pdf',
      cv: '/files/cv-1.pdf',
      ktp: '/files/ktpdummy-1.pdf',
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
            {renderField('Tanggal Pengajuan', detailData.tanggal)}
            {renderField('Nama Lengkap', detailData.namaLengkap)}
            {renderField('NIM', detailData.nim)}
            {renderField('Universitas', detailData.universitas)}
            {renderField('Jurusan', detailData.jurusan)}

            <hr className="my-6" />

            {renderField('Kategori Magang', detailData.kategori)}
            {renderField('Periode Magang', detailData.periode)}
            {renderField('Status Pendidikan', detailData.statusPendidikan)}
            {renderField('Jenjang Pendidikan', detailData.jenjangPendidikan)}
            {renderField('Tema Magang', detailData.tema)}
            {renderField('Bidang', detailData.bidang)}
            {renderField('Status', detailData.status)}

            <hr className="my-6" />

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Berkas Pendukung:
              </label>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  <a
                    href={detailData.berkas.suratBakesbangProv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Surat Bakesbangpol Provinsi
                  </a>
                </li>
                <li>
                  <a
                    href={detailData.berkas.suratBakesbangSDA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Surat Bakesbangpol Sidoarjo
                  </a>
                </li>
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
                    href={detailData.berkas.proposalMagang}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Proposal Magang
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
                <li>
                  <a
                    href={detailData.berkas.ktp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    KTP / Kartu Pelajar / Kartu Mahasiswa
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
