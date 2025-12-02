import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '../../../contexts/LoadingContext';

export default function Register() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tglLahir: '',
    noTelepon: '',
    email: '',
    nik: '',
    nimNis: '',
    instansi: '',
    jurusan: '',
    alamat: '',
    password: '',
    instagram: '',
    confirmPassword: '',
    pasFoto: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showLoading, hideLoading, isLoading } = useLoading();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'noTelepon') {
      const numericValue = value.replace(/\D/g, '');

      setFormData({
        ...formData,
        [name]: numericValue,
      });
      return;
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^08[1-9][0-9]{7,10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;

    // Validasi No Telepon
    if (!formData.noTelepon) {
      newErrors.noTelepon = 'Nomor telepon wajib diisi.';
    } else if (!phoneRegex.test(formData.noTelepon)) {
      newErrors.noTelepon =
        'Nomor tidak valid. Harus diawali "08" dan berisi 10-13 angka.';
    }

    // Validasi Tanggal Lahir
    if (!formData.tglLahir) {
      newErrors.tglLahir = 'Tanggal lahir wajib diisi.';
    }

    // Validasi NIK
    if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus terdiri dari 16 angka.';
    }

    // Validasi Email
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    // Validasi Password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka/simbol.';
    }

    // Validasi Konfirmasi Password (tetap sama)
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak sesuai.';
    }

    if (!formData.tglLahir) {
      newErrors.tglLahir = 'Tanggal lahir wajib diisi.';
    } else {
      const selectedDate = new Date(formData.tglLahir);
      const today = new Date();
      // Hitung umur secara presisi
      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();

      // Koreksi jika belum ulang tahun di tahun ini
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < selectedDate.getDate())
      ) {
        age--;
      }

      if (age < 15) {
        newErrors.tglLahir = 'Minimal usia pendaftar adalah 15 tahun.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      showLoading();
      const dataToSend = new FormData();

      for (const key in formData) {
        if (key !== 'confirmPassword' && key !== 'pasFoto') {
          dataToSend.append(key, formData[key]);
        }
      }

      if (formData.pasFoto) {
        dataToSend.append('pasFoto', formData.pasFoto);
      }

      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          body: dataToSend,
        });

        const result = await res.json();
        if (res.ok) {
          alert('Registrasi berhasil! ' + result.message);
        } else {
          alert('Registrasi Gagal: ' + result.message);
        }
      } catch (error) {
        console.error('Error saat submit:', error);
        alert('Terjadi kesalahan koneksi ke server.');
      } finally {
        hideLoading();
      }
    }
  };

  // 1. Ambil tanggal hari ini
  const todayDate = new Date();

  // 2. Kurangi tahunnya sebanyak 15
  const minAgeDate = new Date(
    todayDate.getFullYear() - 15,
    todayDate.getMonth(),
    todayDate.getDate()
  );

  // 3. Format ke string YYYY-MM-DD agar bisa dibaca input date
  const maxDateAllowed = minAgeDate.toISOString().split('T')[0];

  return (
    <div className="flex min-h-screen font-sans">
      {/* Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/">
            <img
              src="/LogoSimagang.svg"
              alt="Logo SIMAGANG"
              className="h-12 mb-6"
            />
          </Link>

          <h2 className="text-2xl font-bold text-[#002942] mb-2">
            Masuk ke Akun Kamu
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            <span className="font-bold text-[#006DA6]">Daftar sekarang</span>{' '}
            dan dapatkan akses penuh untuk mengatur proses magang Anda!
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Nama Lengkap (Sesuai KTP)"
              id="namaLengkap"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
            />

            <div>
              <label
                htmlFor="tglLahir"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="tglLahir"
                name="tglLahir"
                value={formData.tglLahir}
                onChange={handleChange}
                max={maxDateAllowed} // ❗ Membatasi hanya hingga hari ini
                className={`mt-1 w-full px-4 py-2 border ${
                  errors.tglLahir ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#006DA6]`}
              />
              {errors.tglLahir && (
                <p className="text-sm text-red-500 mt-1">{errors.tglLahir}</p>
              )}
            </div>

            <Input
              label="No Telepon"
              id="noTelepon"
              name="noTelepon"
              value={formData.noTelepon}
              onChange={handleChange}
              error={errors.noTelepon}
            />
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="NIK"
              id="nik"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              error={errors.nik}
            />
            <Input
              label="NIM / NIS"
              id="nimNis"
              name="nimNis"
              value={formData.nimNis}
              onChange={handleChange}
            />
            <Input
              label="Asal Instansi"
              id="instansi"
              name="instansi"
              value={formData.instansi}
              onChange={handleChange}
            />
            <Input
              label="Jurusan"
              id="jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
            />
            <Input
              label="Alamat / Domisili"
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
            />
            <Input
              label="Instagram"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password{' '}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  (Min. 8 kar, A-Z, a-z, & 0-9)
                </span>
              </label>
              {/* <span className="text-xs text-gray-500 mb-1 block">
                (Min. 8 karakter, kombinasi huruf besar, kecil, & angka/simbol)
              </span> */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[#006DA6] focus:outline-none"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-2 border ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[#006DA6] focus:outline-none`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  👁
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Foto */}
            <div>
              <label
                htmlFor="pasFoto"
                className="block text-sm font-medium text-gray-700"
              >
                Foto{' '}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  (Maks 5MB)
                </span>
              </label>
              <input
                type="file"
                id="pasFoto"
                name="pasFoto"
                accept=".jpg,.jpeg,.png"
                onChange={handleChange}
                className="mt-1 block w-full text-sm border border-gray-300 rounded-md px-4 py-2 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ekstensi file yang dapat diupload adalah{' '}
                <strong>.jpg / .jpeg / .png</strong>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#006DA6] text-white py-2 rounded-md hover:bg-[#005b8c] transition"
            >
              Daftar
            </button>
          </form>

          <p className="mt-4 text-sm text-left">
            Sudah punya akun?{' '}
            <a
              href="/login-peserta"
              className="text-[#006DA6] font-bold hover:underline"
            >
              Masuk
            </a>
          </p>
        </div>
      </div>

      {/* Kanan: Background */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative items-center justify-center"
        style={{ backgroundImage: `url('/bg-login.png')` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
          <img
            src="/logo-kominfo.svg"
            alt="Logo Kominfo"
            className="h-10 mb-2 mx-auto"
          />
          <p className="text-white font-medium text-sm leading-tight">
            Dinas Komunikasi dan Informatika <br /> Kabupaten Sidoarjo
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg px-6 text-center font-light">
          Tingkatkan Pengalaman Magang Bersama Diskominfo Sidoarjo
        </div>
      </div>
    </div>
  );
}

function Input({ label, id, name, type = 'text', value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name} // TERIMA DAN GUNAKAN PROP 'name' DI SINI
        value={value}
        onChange={onChange}
        placeholder={`Masukkan ${label.toLowerCase()}`}
        className={`mt-1 w-full px-4 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#006DA6]`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
