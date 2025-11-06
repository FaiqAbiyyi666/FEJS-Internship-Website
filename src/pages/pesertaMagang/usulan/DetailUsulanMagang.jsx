import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../../src/components/navigations/Navbar';
import { useEffect, useState } from 'react';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatPeriode = (tglMulai, tglSelesai) => {
  if (!tglMulai || !tglSelesai) return '-';

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const mulai = new Date(tglMulai)
    .toLocaleDateString('id-ID', options)
    .replace(/\//g, '-');
  const selesai = new Date(tglSelesai)
    .toLocaleDateString('id-ID', options)
    .replace(/\//g, '-');

  if (mulai === selesai) return mulai;
  return `${mulai} sampai ${selesai}`;
};

export default function DetailUsulanMagang() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      console.log('ID inside useEffect:', id);
      if (!id) {
        console.error('Fetch aborted: ID is undefined!');
        setError('Tidak dapat memuat detail: ID ajuan tidak ditemukan di URL.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Autentikasi diperlukan. Silakan login kembali.');
        }

        const response = await fetch(
          `http://localhost:3000/api/peserta/ajuan-magang/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Gagal mengambil detail data.');
        }

        if (result.status && result.data) {
          setDetail(result.data);
        } else {
          throw new Error('Format data dari server tidak valid.');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const renderField = (label, value) => (
    <div>
      <label className="block text-gray-600 text-sm mb-1">{label}</label>
      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800">
        {value || '-'}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-[120px] min-h-screen bg-[#F5F7FA] px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow px-8 py-10 text-center">
            Memuat detail usulan...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pt-[120px] min-h-screen bg-[#F5F7FA] px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow px-8 py-10 text-center text-red-600">
            <h2 className="font-bold mb-2">Terjadi Kesalahan</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-sm text-[#006DA6] hover:underline bg-white border-2 border-[#006DA6] px-4 py-2 rounded-lg font-semibold hover:bg-[#f0f9ff] transition-all"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </>
    );
  }

  const berkas = detail.berkas || {};
  const detailData = {
    tanggal: formatDate(detail.createdAt),
    namaLengkap: detail.peserta.namaLengkap,
    nim: detail.peserta.nimNis || '-',
    universitas: detail.instansi || '-',
    jurusan: detail.jurusan || '-',
    kategori: detail.kategoriMagang,
    statusPendidikan: detail.statusPendidikan,
    jenjangPendidikan: detail.jenjangPendidikan,
    tema: detail.temaMagang,
    periode: formatPeriode(detail.tglMulai, detail.tglSelesai),
    bidang: detail.bidang?.nama || 'N/A',
    status: detail.statusUsulan,
    berkas: {
      suratBakesbangProv: berkas.suratBakesbangpolProv,
      suratBakesbangSDA: berkas.suratBakesbangpolSda,
      suratPengantar: berkas.suratPengantar,
      proposalMagang: berkas.proposalMagang,
      cv: berkas.cv,
      ktp: berkas.ktp,
    },
  };

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
            <div className="w-[80px]"></div>
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
                  {detailData.berkas.suratBakesbangProv ? (
                    <a
                      href={detailData.berkas.suratBakesbangProv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Surat Bakesbangpol Provinsi
                    </a>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed">
                      Surat Bakesbangpol Provinsi (Opsional, tidak diunggah)
                    </span>
                  )}
                </li>
                <li>
                  {detailData.berkas.suratBakesbangSDA ? (
                    <a
                      href={detailData.berkas.suratBakesbangSDA}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Surat Bakesbangpol Sidoarjo
                    </a>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed">
                      Surat Bakesbangpol Sidoarjo (Berkas tidak ditemukan)
                    </span>
                  )}
                </li>

                {/* --- Surat Pengantar (Wajib) --- */}
                <li>
                  {detailData.berkas.suratPengantar ? (
                    <a
                      href={detailData.berkas.suratPengantar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Surat Pengantar
                    </a>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed">
                      Surat Pengantar (Berkas tidak ditemukan)
                    </span>
                  )}
                </li>

                {/* --- Proposal Magang (Wajib) --- */}
                <li>
                  {detailData.berkas.proposalMagang ? (
                    <a
                      href={detailData.berkas.proposalMagang}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Proposal Magang
                    </a>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed">
                      Proposal Magang (Berkas tidak ditemukan)
                    </span>
                  )}
                </li>

                {/* --- CV (Wajib) --- */}
                <li>
                  {detailData.berkas.cv ? (
                    <a
                      href={detailData.berkas.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Curriculum Vitae (CV)
                    </a>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed">
                      Curriculum Vitae (CV) (Berkas tidak ditemukan)
                    </span>
                  )}
                </li>

                {/* --- KTP / Kartu (Wajib) --- */}
                <li>
                  {detailData.berkas.ktp ? (
                    <a
                      href={detailData.berkas.ktp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      KTP / Kartu Pelajar / Kartu Mahasiswa
                    </a>
                  ) : (
                    <span className="text-gray-400 cursor-not-allowed">
                      KTP / Kartu Pelajar / Kartu Mahasiswa (Berkas tidak
                      ditemukan)
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
