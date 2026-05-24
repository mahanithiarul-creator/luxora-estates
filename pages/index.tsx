import Hero from '../components/Hero';
import PropertiesSection from '../components/PropertiesSection';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';

export default function Home() {
  return (
    <>
      <Seo
        title="Cinematic Luxury Real Estate"
        description="Experience LUXORA ESTATES — a premium launch platform for visionary property portfolios and investor-grade real estate storytelling."
      />

      <main className="min-h-screen text-white">
        <Hero />
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#03050b,rgba(6,12,22,0.94)_48%,#03050b)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />
          <div className="container relative z-10 mx-auto px-6">
            <div className="mb-7 max-w-3xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">Search atelier</p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-none sm:text-5xl">Begin with a feeling, not a filter.</h2>
            </div>
            <SearchBar />
          </div>
        </section>
        <PropertiesSection />
        <Footer />
      </main>
    </>
  );
}
