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

export default function Home() {
  return (
    <>
      <Navbar />
      <section id="hero-carousel" className="pt-[100px]">
        <HeroCarousel />
      </section>
      <PromotionSection />
      <TahapanMagang />
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
      <Footer />
    </>
  );
}
