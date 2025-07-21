import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFax,
  FaEnvelope,
  FaClipboardCheck,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      className="text-white relative"
      style={{
        backgroundImage: "url('/bg-footer.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% auto',
        backgroundPosition: 'top center',
        minHeight: '500px',
      }}
    >
      {/* Konten utama footer */}
      <div className="relative z-10 px-4 pt-32 pb-10 md:pt-52 md:pb-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          {/* Logo dan hak cipta */}
          <div className="flex flex-col items-start justify-between">
            <img
              src="/logo-simagang-putih.svg"
              alt="Logo SIMAGANG"
              className="w-56 h-auto mb-4"
            />
            <p className="text-sm text-gray-300">
              © 2024 teamDISKOMINFO. All rights reserved
            </p>
          </div>

          {/* Informasi kontak */}
          <div className="text-sm text-gray-300 space-y-2 max-w-md">
            <h4 className="text-white font-semibold text-base mb-2">
              Dinas Komunikasi dan Informatika Kab. Sidoarjo
            </h4>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1" color="#006DA6" />
              <p>
                Dinas Komunikasi dan Informatika Kabupaten Sidoarjo
                <br />
                Jl. Diponegoro No. 139 Sidoarjo
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt color="#006DA6" />
              <p>031 - 8071604</p>
            </div>
            <div className="flex items-center gap-2">
              <FaFax color="#006DA6" />
              <p>031 - 8073915</p>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope color="#006DA6" />
              <p>diskominfo@sidoarjokab.go.id</p>
            </div>
            <div className="flex items-center gap-2">
              <FaClipboardCheck color="#006DA6" />
              <p>Survey Kepuasan diskominfo</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
