export default function TataCaraMagang() {
  const steps = [
    {
      title: 'Melihat Kuota Magang',
      desc: 'Registrasi akun dan login untuk menambah data usulan magang',
    },
    {
      title: 'Registrasi dan Login',
      desc: 'Registrasi akun dan login untuk menambah data usulan magang',
    },
    {
      title: 'Lengkapi Data',
      desc: 'Isi dan lengkapi data Profil Diri dan Periode Magang',
    },
    {
      title: 'Unggah Berkas Persyaratan Magang',
      desc: 'Unggah berkas seperti Surat Pengantar, Proposal, CV, dan Pas Foto',
    },
    {
      title: 'Tambah Usulan Tempat Magang',
      desc: 'Tambahkan usulan unit tempat magang, seperti memilih UPD dan bidang tujuan',
    },
    {
      title: 'Kirim Data',
      desc: 'Pastikan data terisi dengan baik lalu kirimkan usulan magang',
    },
  ];

  return (
    <section className="py-16 bg-[#F7FAFC]">
      <div className="text-center mb-12">
        <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
        <h2 className="text-2xl md:text-3xl font-normal text-[#002942]">
          Tahapan{' '}
          <span className="text-[#006DA6] font-bold">Pendaftaran Magang</span>
        </h2>
        <p className="text-sm md:text-base mt-2 text-gray-600">
          Berikut adalah tahapan-tahapan pendaftaran magang di Dinas Komunikasi
          dan Informatika Kabupaten Sidoarjo.
        </p>
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Ilustrasi Gambar */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/public\ilustrasi-tahapan-magang.png"
            alt="Ilustrasi Tahapan Magang"
            className="w-96"
          />
        </div>

        {/* Langkah-Langkah */}
        <div className="w-full md:w-1/2 space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-[#006DA6] text-white rounded-full font-bold">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-[#002942]">{step.title}</p>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
