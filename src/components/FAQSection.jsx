import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question: 'Bagaimana cara mengajukan magang?',
    answer:
      'Anda dapat mengajukan magang melalui fitur Pengajuan Magang pada website dengan mengisi formulir yang tersedia dan mengunggah dokumen yang dibutuhkan.',
  },
  {
    question: 'Apa saja syarat untuk mengajukan magang?',
    answer:
      'Syarat utama meliputi surat pengantar dari kampus, KRS, dan CV. Pastikan semua berkas telah lengkap dan dalam format PDF.',
  },
  {
    question: 'Kapan hasil pengajuan magang diumumkan?',
    answer:
      'Hasil pengajuan biasanya diumumkan dalam 7-14 hari kerja setelah pengajuan dilakukan. Anda akan menerima notifikasi melalui akun Anda.',
  },
  {
    question: 'Apakah saya bisa memilih posisi magang?',
    answer:
      'Ya, Anda dapat memilih posisi magang sesuai minat dan bidang studi. Namun, penempatan akhir ditentukan oleh instansi.',
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
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
