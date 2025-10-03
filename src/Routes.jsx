// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LupaPassword from './pages/pesertaMagang/auth/LupaPassword';
import Login from './pages/pesertaMagang/auth/Login';
import LoginMitra from './pages/mitra/LoginMitra';
import Register from './pages/pesertaMagang/auth/Register';
import Lowongan from './components/KuotaMagang';
import Profile from './pages/pesertaMagang/Profile';
import Dashboard from './pages/pesertaMagang/dashboard/DashboardLayout';
import Laporan from './pages/pesertaMagang/dashboard/LaporanPage';
import UsulanMagang from './pages/pesertaMagang/usulan/UsulanMagangPage';
import PengajuanMagang from './pages/pesertaMagang/usulan/PengajuanMagangPage';
import DetailUsulanMagang from './pages/pesertaMagang/usulan/DetailUsulanMagang';
import AllTestimoniPage from './components/AllTestimoniPage';
import AdminDashboard from './pages/mitra/admin/AdminDashboard';
import VerifikasiAkun from './pages/mitra/admin/ManageVerifAkun';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-peserta" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-admin" element={<LoginMitra />} />
        <Route path="/informasi-lowongan" element={<Lowongan />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/usulan" element={<UsulanMagang />} />
        <Route path="/pengajuan-magang" element={<PengajuanMagang />} />
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
