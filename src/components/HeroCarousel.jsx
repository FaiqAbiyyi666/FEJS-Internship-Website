import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
  {
    src: '/hero_carousel/hero-1.svg',
    alt: 'Hero 1',
    link: '#',
  },
  {
    src: '/hero_carousel/hero-2.svg',
    alt: 'Hero 2',
    link: '#',
  },
  {
    src: '/hero_carousel/hero-3.svg',
    alt: 'Hero 3',
    link: '#',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative mx-auto my-6 w-[1100px] h-[400px] rounded-xl border-4 border-[#006DA6] overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <a href={img.link}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-20" /> */}
          </a>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white text-[#006DA6] p-2 rounded-full shadow hover:bg-[#006DA6] hover:text-white transition"
        aria-label="Previous Slide"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white text-[#006DA6] p-2 rounded-full shadow hover:bg-[#006DA6] hover:text-white transition"
        aria-label="Next Slide"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
