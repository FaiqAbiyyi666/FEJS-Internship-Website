import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../../../components/navigations/Navbar';
import { LaporanProvider } from './LaporanContext';

export default function DashboardLayout() {
  return (
    <>
      <Navbar />

      <div className="text-center pt-[130px] mb-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#002942] to-[#006DA6] bg-clip-text text-transparent inline-block">
          Dashboard
        </h1>
      </div>

      <div className="flex bg-[#F5F7FA] min-h-screen max-w-7xl mx-auto px-4">
        <Sidebar />
        <div className="flex-1 p-6">
          <main className="flex-1">
            <LaporanProvider>
              <Outlet />
            </LaporanProvider>
          </main>
        </div>
      </div>
    </>
  );
}
