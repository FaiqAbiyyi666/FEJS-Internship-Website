// src/App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/pesertaMagang/auth/Login';
import LoginMitra from './pages/mitra/LoginMitra';
import Register from './pages/pesertaMagang/auth/Register';
import LupaPasswordPage from './pages/pesertaMagang/auth/LupaPassword';
import ResetPasswordPage from './pages/pesertaMagang/auth/ResetPassword';

import Lowongan from './components/KuotaMagang';
import Profile from './pages/pesertaMagang/Profile';

import DashboardHome from './pages/pesertaMagang/dashboard/DashboradHome';
import DashboardLayout from './pages/pesertaMagang/dashboard/DashboardLayout';
import LaporanPage from './pages/pesertaMagang/dashboard/LaporanPage';
import LaporanAkhir from './pages/pesertaMagang/dashboard/UnggahLaporan';
import LaporanHarian from './pages/pesertaMagang/dashboard/LaporanHarianForm';
import SertifikatPage from './pages/pesertaMagang/dashboard/SertifikatPage';
import UlasanMagangPage from './pages/pesertaMagang/dashboard/UlasanMagangPage';

import UsulanMagang from './pages/pesertaMagang/usulan/UsulanMagangPage';
import DetailUsulanMagang from './pages/pesertaMagang/usulan/DetailUsulanMagang';
import PengajuanMagang from './pages/pesertaMagang/usulan/PengajuanMagangPage';
import FormulirPendaftaran from './pages/pesertaMagang/usulan/FormulirPendaftaran';
import UnggahBerkas from './pages/pesertaMagang/usulan/UnggahBerkas';
import PilihBidang from './pages/pesertaMagang/usulan/PilihBidang';
import KonfirmasiSimpan from './pages/pesertaMagang/usulan/KonfirmasiSimpan';

import AllTestimoniPage from './components/AllTestimoniPage';
import AdminDashboard from './pages/mitra/admin/AdminDashboard';
import VerifikasiAkun from './pages/mitra/admin/ManageVerifAkun';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-peserta" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-admin" element={<LoginMitra />} />
        <Route path="/forgot-password" element={<LupaPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/informasi-lowongan" element={<Lowongan />} />
        <Route path="/profile" element={<Profile />} />

        {/* Dashboard Peserta Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route
            path="laporan-harian-form/:minggu/:hari"
            element={<LaporanHarian />}
          />
          <Route path="unggah-laporan-akhir" element={<LaporanAkhir />} />
          <Route path="sertifikat" element={<SertifikatPage />} />
          <Route path="ulasan-magang" element={<UlasanMagangPage />} />
        </Route>

        {/* Pengajuan Magang Route */}
        <Route path="/usulan" element={<UsulanMagang />} />
        <Route path="/pengajuan-magang" element={<PengajuanMagang />}>
          <Route index element={<Navigate to="formulir" replace />} />

          <Route path="formulir" element={<FormulirPendaftaran />} />
          <Route path="berkas" element={<UnggahBerkas />} />
          <Route path="bidang" element={<PilihBidang />} />
          <Route path="konfirmasi" element={<KonfirmasiSimpan />} />
        </Route>
        <Route path="/usulan/detail/:id" element={<DetailUsulanMagang />} />

        <Route path="/testimoni" element={<AllTestimoniPage />} />

        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route
          path="/dashboard-admin/verifikasi-akun"
          element={<VerifikasiAkun />}
        />
      </Routes>
    </Router>
  );
}
