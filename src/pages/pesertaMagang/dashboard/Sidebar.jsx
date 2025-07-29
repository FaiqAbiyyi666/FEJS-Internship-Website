import { FaBook, FaHome } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { BiLike } from 'react-icons/bi'; // icon untuk ulasan magang

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { key: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
    { key: 'laporan', icon: <FaBook />, label: 'Laporan' },
    { key: 'sertifikat', icon: <TbCertificate />, label: 'Sertifikat' },
    { key: 'ulasan-magang', icon: <BiLike />, label: 'Ulasan Magang' }, // ✅ menu baru
  ];

  return (
    <div className="w-48 bg-white shadow-md mt-6 p-4 rounded-lg self-start">
      <ul className="space-y-4">
        {menuItems.map(({ key, icon, label }) => (
          <li
            key={key}
            onClick={() => setActiveMenu(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 ${
              activeMenu === key
                ? 'bg-[#e5f4ff] text-[#006DA6] font-bold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {icon} {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
