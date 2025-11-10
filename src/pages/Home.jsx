import Navbar from '../components/navigations/Navbar';
import Footer from '../components/navigations/Footer';
import HeroCarousel from '../components/HeroCarousel';
import TahapanMagang from '../components/TahapanMagang';
import KuotaMagang from '../components/KuotaMagang';
import KritikSaran from '../components/KritikSaran';
import TestimoniSection from '../components/TestimoniSection';
import PromotionSection from '../components/PromotionSection';
import ListUsulanMagang from '../components/ListUsulanMagang';
import VideoTataCaraMagang from '../components/VideoTataCaraMagang';
import FAQSection from '../components/FAQSection';
import StatistikMagang from '../components/StatistikMagang';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* 2. (Opsional tapi disarankan) Bungkus konten utama dengan <main> 
             dan tambahkan 'flex-grow' */}
      <main className="flex-grow">
        <section id="hero-carousel" className="pt-[100px]">
          <HeroCarousel />
        </section>
        <PromotionSection />
        <TahapanMagang />
        <StatistikMagang />
        <section id="kuota-magang" className="scroll-mt-[120px]">
          <KuotaMagang />
        </section>
        <ListUsulanMagang />
        <section id="tata-cara" className="scroll-mt-[120px]">
          <VideoTataCaraMagang />
        </section>
        <FAQSection />
        <KritikSaran />
        <TestimoniSection />
      </main>

      {/* 3. Footer akan otomatis terdorong ke bawah */}
      <Footer />
    </div>
  );
}
