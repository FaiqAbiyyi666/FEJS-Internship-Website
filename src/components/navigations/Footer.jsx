import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFax,
  FaEnvelope,
  FaClipboardCheck,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
  FaGlobe,
} from 'react-icons/fa';

export default function Footer() {
  // --- Data & URL
  const gmapsUrl = 'http://googleusercontent.com/maps/google.com/1';
  const surveyUrl = 'https://ikm.sidoarjokab.go.id/opd/107';
  const websiteUrl = 'https://diskominfo.sidoarjokab.go.id/index-1.php';

  // Media Sosial
  const instagramUrl =
    'https://www.instagram.com/diskominfosidoarjo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
  const facebookUrl = 'https://www.facebook.com/share/1BM2vqFeJp/';
  const twitterUrl = 'https://x.com/KominfoSidoarjo?s=20';
  const tiktokUrl =
    'https://www.tiktok.com/@diskominfosidoarjo?_r=1&_t=ZS-91GhMbXd03M';

  // --- Warna Desain ---
  const darkestBlue = '#002136';
  const midBlue = '#004A7B';
  const brighterBlue = '#006DA6';
  const accentColor = '#FFFFFF';

  return (
    <footer
      className="text-white"
      style={{
        background: `radial-gradient(at bottom right, ${brighterBlue} 0%, ${midBlue} 40%, ${darkestBlue} 80%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <img
              src="/logo-simagang-putih.svg"
              alt="Logo SIMAGANG"
              className="w-56 h-auto mb-6"
            />
            {/* Ikon Media Sosial */}
            <div className="flex space-x-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
              >
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Tautan Terkait */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-6">Tautan Terkait</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <FaGlobe size={14} className="opacity-70" />
                  Website Resmi Diskominfo
                </a>
              </li>
              <li>
                <a
                  href={surveyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <FaClipboardCheck size={14} className="opacity-70" />
                  Survey Kepuasan
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Navigasi Halaman */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg mb-6">Navigasi Halaman</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#kuota-magang"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Kuota Magang
                </a>
              </li>
              <li>
                <a
                  href="#tata-cara"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Tata Cara Pendaftaran
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Ada Pertanyaan? (Kontak) */}
          <div className="space-y-5">
            <h4 className="font-semibold text-lg mb-6">Ada Pertanyaan?</h4>
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <FaMapMarkerAlt
                className="mt-1 flex-shrink-0"
                style={{ color: accentColor }}
              />
              <span className="text-gray-300 group-hover:text-white transition-colors text-sm leading-relaxed">
                Jl. Diponegoro No. 139 Sidoarjo
              </span>
            </a>
            <div className="flex items-center gap-3">
              <FaPhoneAlt style={{ color: accentColor }} />
              <span className="text-gray-300 text-sm">031 - 8071604</span>
            </div>
            <div className="flex items-center gap-3">
              <FaFax style={{ color: accentColor }} />
              <span className="text-gray-300 text-sm">031 - 8073915</span>
            </div>
            <a
              href="mailto:diskominfo@sidoarjokab.go.id"
              className="flex items-center gap-3 group"
            >
              <FaEnvelope style={{ color: accentColor }} />
              <span className="text-gray-300 group-hover:text-white transition-colors text-sm break-all">
                diskominfo@sidoarjokab.go.id
              </span>
            </a>
          </div>
        </div>

        {/* --- Garis Pemisah dan Hak Cipta --- */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <p className="text-center text-sm text-gray-300">
            © 2025 teamDISKOMINFO. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
