import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question:
      'Apakah saya bisa langsung mengajukan magang setelah mendaftarkan akun?',
    answer:
      'Setelah mendaftarkan akun, kamu harus menunggu persetujuan Akun dari pihak Diskominfo Sidoarjo dalam 1-3 hari kerja, Setelah itu kamu bisa mengajukan magang.',
  },
  {
    question: 'Bagaimana cara mengajukan magang?',
    answer:
      '1. Buat akun terlebih dahulu, untuk melanjutkan pendaftaran pastikan Akun kamu sudah disetujui oleh pihak Diskominfo Sidoarjo terlebih dahulu.\n ' +
      '2. Setelah sudah buat akun, dan sudah disetujui, lihat kuota pada bidang yang kamu inginkan.\n' +
      '3. Setelah sudah melihat kuota bidang, selanjutnya menuju halaman "Usulan Magang" dan Klik "Daftar Magang"\n' +
      '4. Lengkapi "Formulir Pendaftaran Magang" dan "Unggah Berkas" yang diperlukan.\n' +
      '5. Setelah itu, Pilih Bidang yang kamu inginkan dan pastikan juga kuota pada bidang tersebut masih ada.\n' +
      '6. Selanjutnya kamu harus menyetujui "Pakta Integritas" dan "Tata Tertib" yang ada' +
      '7. Terakhir, Pastikan semua data yang sudah kamu unggah itu sudah benar, lalu Klik "Submit"',
  },
  {
    question: 'Apa saja syarat untuk mengajukan magang?',
    answer:
      'Syarat untuk mengajukan magang di Diskominfo Sidoarjo adalah:\n' +
      '1. Surat Rekomendasi Magang Bakesbangpol Provinsi (Untuk Instansi di luar Sidoarjo) \n' +
      '2. Surat Rekomendasi Magang Bakesbangpol Sidoarjo \n' +
      '3. Surat Pengantar Instansi \n' +
      '4. Proposal Magang \n' +
      '5. KTP \n' +
      '6. Curiculum Vitae \n' +
      'Pastikan semua berkas telah lengkap dan dalam format PDF.',
  },
  {
    question: 'Kapan hasil pengajuan magang diumumkan?',
    answer:
      'Hasil pengajuan biasanya diumumkan dalam 3-7 hari kerja setelah pengajuan dilakukan. Kamu akan menerima notifikasi melalui akun Kamu atau melalui email kamu.',
  },
  {
    question: 'Apakah saya bisa memilih posisi magang?',
    answer:
      'Ya, Kamu dapat memilih posisi magang sesuai minat dan bidang studi, serta jika kuota pada bidang tersebut masih ada.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#F7FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-normal text-[#002942]">
            <span className="text-[#006DA6] font-bold">
              Pertanyaan yang Sering
            </span>{' '}
            <span className="text-[#002942]">Diajukan</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow p-5 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-[#002942] font-medium">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FaChevronUp className="text-[#006DA6]" />
                ) : (
                  <FaChevronDown className="text-[#006DA6]" />
                )}
              </button>
              {openIndex === index && (
                <div className="mt-3 text-gray-600 space-y-1">
                  {faq.answer.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
