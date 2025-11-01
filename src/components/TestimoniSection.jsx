import React, { useState, useEffect } from 'react';
import { Star } from 'react-feather';

function TestimoniCard({ data }) {
  return (
    <div className="bg-white rounded-xl border text-[#1F2937] p-4 w-[300px] h-[200px] flex-shrink-0 flex flex-col justify-between">
      <div className="flex items-start gap-3">
        <img
          src={data.foto}
          alt="Foto peserta"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold">{data.name}</h3>
          <p className="text-xs text-gray-700">{data.bidang}</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.tanggal}</p>
        </div>
      </div>
      <p className="text-xs mt-2 line-clamp-3">{data.ulasan}</p>
      <div className="flex mt-2 gap-1 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < data.rating ? '#FACC15' : 'none'}
            stroke="#FACC15"
          />
        ))}
      </div>
    </div>
  );
}

export default function TestimoniSection() {
  const [testimonies, setTestimonies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimoni = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'http://localhost:3000/api/peserta/ulasan-magang'
        );

        if (!response.ok) {
          throw new Error('Gagal mengambil data testimoni');
        }

        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
          setTestimonies(result.data);
        } else {
          console.error('Format data tidak terduga:', result);
          setTestimonies([]);
        }
      } catch (error) {
        console.error(error);
        setTestimonies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimoni();
  }, []);

  if (isLoading || testimonies.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-[#F9FBFD] text-[#006DA6] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Apa Kata Mereka?</h2>
          <a
            href="/testimoni"
            className="text-base text-[#006DA6] hover:underline"
          >
            Lihat Selengkapnya
          </a>
        </div>

        {/* Scrollable horizontal area */}
        <div className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth pb-6">
          {testimonies.map((item, index) => (
            <TestimoniCard key={index} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
