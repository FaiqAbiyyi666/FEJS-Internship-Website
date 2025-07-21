export default function KuotaMagang() {
  const data = [
    { bidang: 'Sekretariat', kuota: 5, tersedia: 3 },
    {
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      kuota: 6,
      tersedia: 2,
    },
    { bidang: 'Tata Kelola Informatika', kuota: 4, tersedia: 0 },
    { bidang: 'Infrastruktur & Keamanan TIK', kuota: 5, tersedia: 3 },
    { bidang: 'Statistik', kuota: 3, tersedia: 0 },
  ];

  return (
    <section className="bg-[#F7FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Judul dengan garis biru di atas */}
        <div className="text-center mb-12">
          <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-normal text-[#002942]">
            <span className="font-bold text-[#006DA6]">Kuota Magang</span>{' '}
            <span className="text-[#002942]">Yang Tersedia Saat Ini</span>
          </h2>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">NAMA BIDANG</th>
                <th className="py-3 px-4 font-semibold text-center">KUOTA</th>
                <th className="py-3 px-4 font-semibold text-center">
                  KUOTA TERSEDIA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4">{row.bidang}</td>
                  <td className="py-3 px-4 text-center">{row.kuota}</td>
                  <td className="py-3 px-4 text-center">
                    {row.tersedia > 0 ? (
                      row.tersedia
                    ) : (
                      <span className="text-gray-600 italic">
                        Tidak Tersedia
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
