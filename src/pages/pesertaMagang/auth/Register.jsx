import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tglLahir: '',
    noTelepon: '',
    email: '',
    nik: '',
    nim: '',
    instansi: '',
    jurusan: '',
    alamat: '',
    password: '',
    confirmPassword: '',
    foto: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};

    // Validasi No Telepon
    if (!/^\d{10,13}$/.test(formData.noTelepon)) {
      newErrors.noTelepon = 'No Telepon harus terdiri dari 10-13 angka.';
    }

    // Validasi Tanggal Lahir
    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi.';
    }

    // Validasi NIK
    if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus terdiri dari 16 angka.';
    }

    // Validasi Email
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    // Validasi Konfirmasi Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak sesuai.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Form valid, lanjutkan submit.');
      // Lanjut submit ke server di sini
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

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
              value={formData.namaLengkap}
              onChange={handleChange}
            />

            <div>
              <label
                htmlFor="tanggalLahir"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                max={today} // ❗ Membatasi hanya hingga hari ini
                className={`mt-1 w-full px-4 py-2 border ${
                  errors.tanggalLahir ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#006DA6]`}
              />
              {errors.tanggalLahir && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tanggalLahir}
                </p>
              )}
            </div>

            <Input
              label="No Telepon"
              id="noTelepon"
              value={formData.noTelepon}
              onChange={handleChange}
              error={errors.noTelepon}
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="NIK"
              id="nik"
              value={formData.nik}
              onChange={handleChange}
              error={errors.nik}
            />
            <Input
              label="NIM / NIS"
              id="nim"
              value={formData.nim}
              onChange={handleChange}
            />
            <Input
              label="Asal Instansi"
              id="instansi"
              value={formData.instansi}
              onChange={handleChange}
            />
            <Input
              label="Jurusan"
              id="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
            />
            <Input
              label="Alamat / Domisili"
              id="alamat"
              value={formData.alamat}
              onChange={handleChange}
            />

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006DA6] focus:outline-none"
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
                htmlFor="foto"
                className="block text-sm font-medium text-gray-700"
              >
                Foto
              </label>
              <input
                type="file"
                id="foto"
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

function Input({ label, id, type = 'text', value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
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
