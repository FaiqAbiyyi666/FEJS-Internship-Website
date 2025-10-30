import { useState, useEffect } from 'react';
import { FiDownload, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const formatPeriode = (tglMulai, tglSelesai) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const mulai = new Date(tglMulai).toLocaleDateString('id-ID', options);
  const selesai = new Date(tglSelesai).toLocaleDateString('id-ID', options);
  return `${mulai} - ${selesai}`;
};

export default function SertifikatPage() {
  const [numPagesMap, setNumPagesMap] = useState({});

  const [mySertifikat, setMySertifikat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSertifikat = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Ambil token dari localStorage
        //    (Ganti 'token' jika Anda menyimpannya dengan nama key yang berbeda)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error(
            'Autentikasi tidak ditemukan. Silakan login kembali.'
          );
        }

        // 2. Panggil endpoint API dengan menyertakan header Authorization
        const res = await fetch(
          'http://localhost:3000/api/peserta/sertifikat',
          {
            headers: {
              Authorization: `Bearer ${token}`, // <-- Ini perbaikannya
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          // Tangani jika token kadaluwarsa atau tidak valid
          if (res.status === 401) {
            throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
          }
          throw new Error(data.message || 'Gagal mengambil data');
        }

        setMySertifikat(data.data); // Data ada di dalam properti 'data'
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSertifikat();
  }, []);

  const onDocumentLoadSuccess = (id, { numPages }) => {
    setNumPagesMap((prev) => ({ ...prev, [id]: numPages }));
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-10">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
        Sertifikat Magang
      </h2>
      <p className="text-center text-sm text-gray-600 mb-6">
        Lihat dan unduh sertifikat dari kegiatan magang kamu.
      </p>

      {isLoading ? (
        <p className="text-center text-gray-600 flex items-center justify-center gap-2">
          <FiLoader className="animate-spin" />
          Memuat sertifikat...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 flex items-center justify-center gap-2">
          <FiAlertTriangle />
          Error: {error}
        </p>
      ) : mySertifikat.length === 0 ? (
        <p className="text-center text-gray-600">
          Ups! Belum ada sertifikat magang yang tersedia.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mySertifikat.map((sertifikat) => (
            <div
              key={sertifikat.id}
              className="border rounded-lg shadow-lg p-4 bg-gray-50 flex flex-col"
            >
              <h3 className="text-lg font-bold text-[#002942] mb-1">
                {sertifikat.bidang}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold">Periode:</span>{' '}
                {formatPeriode(sertifikat.tglMulai, sertifikat.tglSelesai)}
              </p>

              {/* PDF Preview */}
              <div className="border rounded overflow-hidden mb-4">
                <Document
                  file={sertifikat.fileUrl}
                  onLoadSuccess={(info) =>
                    onDocumentLoadSuccess(sertifikat.id, info)
                  }
                  loading={
                    <p className="text-center text-gray-500 py-4">
                      Memuat pratinjau...
                    </p>
                  }
                  error={
                    <p className="text-center text-red-500 py-4">
                      Gagal memuat PDF
                    </p>
                  }
                >
                  <Page pageNumber={1} width={400} />
                </Document>
              </div>

              {/* Tombol Download */}
              <a
                href={sertifikat.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#002942] to-[#006DA6] text-white px-4 py-2 text-sm rounded-lg shadow hover:opacity-90 transition"
              >
                <FiDownload className="w-4 h-4" />
                Unduh Sertifikat
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
