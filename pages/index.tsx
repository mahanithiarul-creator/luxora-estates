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
        <section className="py-24">
          <div className="container mx-auto px-6">
            <SearchBar />
          </div>
        </section>
        <PropertiesSection />
        <Footer />
      </main>
    </>
  );
}
