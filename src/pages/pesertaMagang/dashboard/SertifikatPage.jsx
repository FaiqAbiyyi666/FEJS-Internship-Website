import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const sertifikatData = [
  {
    id: 1,
    posisi: 'Frontend Developer',
    periode: '01 Februari 2024 - 30 April 2024',
    file: '/files/Muhammad Faiq Al Abiyyi_Bimtek AI_2024.pdf',
  },
  {
    id: 2,
    posisi: 'Backend Engineer',
    periode: '01 Maret 2024 - 31 Mei 2024',
    file: '/files/SERTIFIKAT MAGANG DISKOMINFO SDA.pdf',
  },
];

export default function SertifikatPage() {
  const [numPagesMap, setNumPagesMap] = useState({});

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

      {sertifikatData.length === 0 ? (
        <p className="text-center text-gray-600">
          Ups! Belum ada sertifikat magang yang tersedia.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sertifikatData.map((sertifikat) => (
            <div
              key={sertifikat.id}
              className="border rounded-lg shadow-lg p-4 bg-gray-50 flex flex-col"
            >
              <h3 className="text-lg font-bold text-[#002942] mb-1">
                {sertifikat.posisi}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold">Periode:</span>{' '}
                {sertifikat.periode}
              </p>

              {/* PDF Preview */}
              <div className="border rounded overflow-hidden mb-4">
                <Document
                  file={sertifikat.file}
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
                href={sertifikat.file}
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
