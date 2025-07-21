import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import Navbar from '../../../src/components/navigations/Navbar';

export default function Profile() {
  const [formData, setFormData] = useState({
    namaLengkap: 'Muhammad Faiq Al Abiyyi',
    nim: '21082010203',
    asalInstansi: 'Universitas Pembangunan Veteran Jawa Timur',
    jurusan: 'Sistem Informasi',
    tanggalLahir: '25 Januari 2003',
    nomorTelepon: '081259702550',
    email: '21082010203@student.upnjatim.ac.id',
    nomorIndukKependudukan: '3515101234567890',
    alamat: 'Desa Jimbaran Kulon RT04/RW01, Wonoayu, Kab. Sidoarjo, Jawa Timur',
  });

  const [profileImage, setProfileImage] = useState('/FOTO KTM.jpg');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#002942] to-[#006DA6] bg-clip-text text-transparent mb-8">
              Profil
            </h1>

            <div className="relative">
              <div className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition"
              >
                <Camera size={20} className="text-gray-600" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['namaLengkap', 'Nama Lengkap', 'text'],
                ['tanggalLahir', 'Tanggal Lahir', 'text', true],
                ['nim', 'NIM / NIS', 'text'],
                ['nomorTelepon', 'Nomor Telepon', 'tel'],
                ['asalInstansi', 'Asal Instansi', 'text'],
                ['email', 'Email', 'email', true],
                ['jurusan', 'Jurusan', 'text'],
                [
                  'nomorIndukKependudukan',
                  'Nomor Induk Kependudukan',
                  'text',
                  true,
                ],
              ].map(([id, label, type, readOnly]) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    readOnly={readOnly}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none ${
                      readOnly
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#006DA6] focus:border-transparent'
                    }`}
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label
                  htmlFor="alamat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alamat
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:ring-offset-2"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
