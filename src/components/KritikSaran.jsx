import React, { useState } from 'react';

export default function KritikSaran() {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    pesan: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.pesan) {
      setMessage({
        type: 'error',
        text: 'Nama, email, dan pesan wajib diisi.',
      });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(
        'http://localhost:3000/api/peserta/kritik-saran',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim pesan.');
      }

      if (result.status) {
        setMessage({
          type: 'success',
          text: 'Kritik dan saran berhasil dikirim. Terima kasih!',
        });
        setForm({ nama: '', email: '', pesan: '' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Gagal terhubung ke server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Formulir */}
        <div className="w-full md:w-1/2 text-[#002942]">
          <h2 className="text-3xl font-bold text-center md:text-left mb-6 text-[#006DA6]">
            Kritik dan Saran
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nama" className="block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                value={form.nama}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>
            <div>
              <label htmlFor="pesan" className="block text-sm font-medium">
                Pesan
              </label>
              <textarea
                id="pesan"
                rows="4"
                value={form.pesan}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              ></textarea>
            </div>

            {/* Tampilkan pesan feedback/error */}
            {message.text && (
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#002942] to-[#006DA6] hover:bg-[#006DA6] hover:from-[#006DA6] hover:to-[#006DA6] text-white px-4 py-2 rounded-md text-sm transition disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>

        {/* Ilustrasi */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src="/ilustrasi-kritik-saran.png"
            alt="Ilustrasi Kritik dan Saran"
            className="max-w-xs w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
