import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera } from 'lucide-react';
import Navbar from '../../../src/components/navigations/Navbar';
import { useLoading } from '../../../src/contexts/LoadingContext';

export default function Profile() {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nimNis: '',
    instansi: '',
    jurusan: '',
    tglLahir: '',
    noTelepon: '',
    email: '',
    nik: '',
    alamat: '',
    instagram: '',
  });

  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^0[8]\d{8,11}$/;

    if (!formData.namaLengkap)
      newErrors.namaLengkap = 'Nama lengkap tidak boleh kosong.';
    if (!formData.noTelepon)
      newErrors.noTelepon = 'Nomor telepon tidak boleh kosong.';
    else if (!phoneRegex.test(formData.noTelepon))
      newErrors.noTelepon =
        'Format nomor telepon tidak valid (contoh: 081234567890).';
    if (!formData.nimNis) newErrors.nimNis = 'NIM/NIS tidak boleh kosong.';
    else if (formData.nimNis.length < 10 || formData.nimNis.length > 12)
      newErrors.nimNis = 'NIM/NIS harus 10-12 karakter.';
    if (!formData.instansi)
      newErrors.instansi = 'Asal instansi tidak boleh kosong.';
    if (!formData.jurusan) newErrors.jurusan = 'Jurusan tidak boleh kosong.';
    if (!formData.alamat) newErrors.alamat = 'Alamat tidak boleh kosong.';
    if (!formData.instagram)
      newErrors.instagram = 'Instagram tidak boleh kosong.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProfile = useCallback(async () => {
    showLoading();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan, mohon login ulang.');
        setNotification({
          message: 'Sesi Anda berakhir. Mohon login ulang.',
          type: 'error',
        });
        return;
      }

      const res = await fetch('http://localhost:3000/api/peserta/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal mengambil data profil.');
      }

      if (result.status) {
        const profileData = result.data;
        setFormData({
          namaLengkap: profileData.namaLengkap || '',
          nimNis: profileData.nimNis || '',
          instansi: profileData.instansi || '',
          jurusan: profileData.jurusan || '',
          tglLahir: profileData.tglLahir
            ? new Date(profileData.tglLahir).toISOString().split('T')[0]
            : '',
          noTelepon: profileData.noTelepon || '',
          email: profileData.email || '',
          nik: profileData.nik || '',
          alamat: profileData.alamat || '',
          instagram: profileData.instagram || '',
          pasFoto: profileData.pas_foto || '',
        });
        const imageUrl = profileData.pasFoto;

        if (
          imageUrl &&
          (imageUrl.startsWith('https://') || imageUrl.startsWith('http://'))
        ) {
          setProfileImage(imageUrl);
        } else {
          setProfileImage('/default-profile.png');
        }
      } else {
        console.error('Gagal ambil data profil:', result.message);
        setNotification({ message: result.message, type: 'error' });
      }
    } catch (err) {
      console.error('Gagal fetch profile:', err);
      setNotification({ message: err.message, type: 'error' });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });

    if (!validateForm()) {
      setNotification({
        message:
          'Harap periksa kembali isian Anda, terdapat beberapa kesalahan.',
        type: 'error',
      });
      return;
    }

    const token = localStorage.getItem('token');
    let requestBody;
    const requestHeaders = {
      Authorization: `Bearer ${token}`,
    };

    showLoading();

    try {
      if (imageFile) {
        const dataToSend = new FormData();
        dataToSend.append('namaLengkap', formData.namaLengkap);
        dataToSend.append('noTelepon', formData.noTelepon);
        dataToSend.append('nimNis', formData.nimNis);
        dataToSend.append('instansi', formData.instansi);
        dataToSend.append('jurusan', formData.jurusan);
        dataToSend.append('instagram', formData.instagram);
        dataToSend.append('alamat', formData.alamat);
        dataToSend.append('pasFoto', imageFile);
        requestBody = dataToSend;
      } else {
        const dataToSend = {
          namaLengkap: formData.namaLengkap,
          noTelepon: formData.noTelepon,
          nimNis: formData.nimNis,
          instansi: formData.instansi,
          jurusan: formData.jurusan,
          instagram: formData.instagram,
          alamat: formData.alamat,
        };
        requestBody = JSON.stringify(dataToSend);
        requestHeaders['Content-Type'] = 'application/json';
      }

      const res = await fetch('http://localhost:3000/api/peserta/profile', {
        method: 'PUT',
        headers: requestHeaders,
        body: requestBody,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Gagal memperbarui profil.');
      }

      setNotification({ message: result.message, type: 'success' });
      setImageFile(null);

      await fetchProfile();
    } catch (err) {
      console.error('Error submitting form:', err);
      setNotification({ message: err.message, type: 'error' });
    } finally {
      hideLoading();
    }
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
            {notification.message && (
              <div
                className={`p-4 mb-6 rounded-lg text-sm ${
                  notification.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {notification.message}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'namaLengkap', label: 'Nama Lengkap', type: 'text' },
                {
                  id: 'tglLahir',
                  label: 'Tanggal Lahir',
                  type: 'date',
                  readOnly: true,
                },
                { id: 'nimNis', label: 'NIM / NIS', type: 'text' },
                { id: 'noTelepon', label: 'Nomor Telepon', type: 'tel' },
                { id: 'instansi', label: 'Asal Instansi', type: 'text' },
                { id: 'email', label: 'Email', type: 'email', readOnly: true },
                { id: 'jurusan', label: 'Jurusan', type: 'text' },
                { id: 'instagram', label: 'Instagram', type: 'text' },
                {
                  id: 'nik',
                  label: 'Nomor Induk Kependudukan',
                  type: 'text',
                  readOnly: true,
                },
              ].map(({ id, label, type, readOnly }) => (
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
                    value={formData[id] || ''}
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
                  value={formData.alamat || ''}
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
