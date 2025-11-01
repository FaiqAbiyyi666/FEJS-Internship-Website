import { FaBook, FaHome } from 'react-icons/fa';
import { TbCertificate } from 'react-icons/tb';
import { BiLike } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <FaHome />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      key: 'laporan',
      icon: <FaBook />,
      label: 'Laporan',
      path: '/dashboard/laporan',
    },
    {
      key: 'sertifikat',
      icon: <TbCertificate />,
      label: 'Sertifikat',
      path: '/dashboard/sertifikat',
    },
    {
      key: 'ulasan',
      icon: <BiLike />,
      label: 'Ulasan Magang',
      path: '/dashboard/ulasan-magang',
    },
  ];

  const activeClassName = 'bg-[#e5f4ff] text-[#006DA6] font-bold';
  const inactiveClassName = 'text-gray-700 hover:bg-gray-100';

  return (
    <div className="w-48 bg-white shadow-md mt-6 p-4 rounded-lg self-start">
      <ul className="space-y-4">
        {menuItems.map(({ key, icon, label, path }) => (
          <li key={key}>
            <NavLink
              to={path}
              end={path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 ${
                  isActive ? activeClassName : inactiveClassName
                }`
              }
            >
              {icon} {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
