import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import sample from '../../lib/sample-data';
import type { Property } from '../../types';
import AnimatedNumber from '../../components/AnimatedNumber';
import MortgageCalculator from '../../components/Property/MortgageCalculator';
import BookingForm from '../../components/Property/BookingForm';
import BookingModal from '../../components/Property/BookingModal';
import FavoriteButton from '../../components/Property/FavoriteButton';
import InquiryForm from '../../components/Property/InquiryForm';
import Seo from '../../components/Seo';
import ConciergePanel from '../../components/AI/ConciergePanel';
import RoomWalkthrough from '../../components/Property/RoomWalkthrough';

const PropertyScene = dynamic(() => import('../../components/Property/PropertyScene'), {
  ssr: false,
  loading: () => <div className="h-full rounded-[32px] bg-slate-900/80" />,
});

const highlightFeatures = [
  { label: 'Private entrance', value: 'Exclusive access' },
  { label: 'Skyline view', value: 'Panoramic cityscapes' },
  { label: 'Concierge', value: 'White glove service' },
];

export default function PropertyDetails() {
  const { query } = useRouter();
  const id = Array.isArray(query.id) ? query.id[0] : query.id;
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const property = propertyData || sample.properties.find((p) => p.id === id) || sample.properties[0];
  const recommendations = sample.properties.filter((p) => p.id !== property.id).slice(0, 2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveRecommendations, setLiveRecommendations] = useState<any[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [focusInquiry, setFocusInquiry] = useState(false);

  const activeRecommendation = recommendations[activeIndex] || recommendations[0];
  const [activeRoom, setActiveRoom] = useState<'entrance' | 'lounge' | 'terrace'>('entrance');
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [typing, setTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { speaker: 'assistant', message: 'Welcome to the private concierge. I can curate your next luxury residence, cinematic walk-through, or investor-ready portfolio.' },
  ]);

  const roomScenarios = [
    {
      id: 'entrance',
      title: 'Grand entrance',
      description: 'Step into a vaulted arrival lounge with curated art, warm light, and concierge access to every suite.',
    },
    {
      id: 'lounge',
      title: 'Luxury lounge',
      description: 'Relax in an immersive living space crafted for evening entertaining and immersive city panoramas.',
    },
    {
      id: 'terrace',
      title: 'Sky terrace',
      description: 'Enjoy private dining under the stars with atmospheric lighting, greenery, and panoramic views.',
    },
  ];

  const customSuggestions = [
    'Show me a property with skyline sunset views',
    'Recommend a high-end suite for investors',
    'Filter properties with private terrace and wellness spa',
  ];

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      setPropertyLoading(true);
      setPropertyError(null);

      try {
        const response = await fetch(`/api/properties/${encodeURIComponent(id)}`);
        const payload = await response.json();
        if (response.ok && payload.data) {
          setPropertyData(payload.data);
        }
      } catch (error) {
        console.error('Property fetch failed', error);
        setPropertyError('Unable to load property details.');
      } finally {
        setPropertyLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/ai/recommendations?propertyId=${encodeURIComponent(id)}`);
        const payload = await response.json();
        if (response.ok && Array.isArray(payload.recommendations)) {
          setLiveRecommendations(payload.recommendations);
        }
      } catch (error) {
        console.error('Recommendation fetch failed', error);
      }
    };

    fetchProperty();
    fetchRecommendations();
  }, [id]);

  useEffect(() => {
    if (!property?.id || typeof window === 'undefined') return;
    try {
      const saved = JSON.parse(window.localStorage.getItem('luxora_recently_viewed') || '[]');
      const updated = [{ id: property.id, title: property.title, location: property.location, image: property.image }, ...saved.filter((item: any) => item.id !== property.id)].slice(0, 6);
      window.localStorage.setItem('luxora_recently_viewed', JSON.stringify(updated));
    } catch {
      // ignore local storage errors
    }
  }, [property]);

  useEffect(() => {
    if (!focusInquiry || typeof document === 'undefined') return;
    const inquirySection = document.getElementById('inquiry-section');
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFocusInquiry(false);
    }
  }, [focusInquiry]);

  const monthlyEstimation = useMemo(() => {
    const loan = property.price * 0.78;
    const monthlyRate = 0.035 / 12;
    const months = 30 * 12;
    return Math.round(loan * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months))));
  }, [property.price]);

  const displayRecommendations = liveRecommendations.length ? liveRecommendations : recommendations;

  const handleSuggestion = async (query: string) => {
    setChatHistory((prev) => [...prev, { speaker: 'user', message: query }]);
    setTyping(true);

    try {
      const response = await fetch(`/api/ai/recommendations?propertyId=${encodeURIComponent(id || '')}&q=${encodeURIComponent(query)}`);
      const payload = await response.json();
      const nextMessage = payload?.recommendations?.length
        ? payload.recommendations.map((item: any) => `${item.title} — ${item.summary}`).join(' ')
        : 'I have curated an elite sequence of properties for your taste and will continue refining for the perfect investor presentation.';
      setChatHistory((prev) => [...prev, { speaker: 'assistant', message: nextMessage }]);
    } catch (error) {
      console.error('AI suggestion error', error);
      setChatHistory((prev) => [
        ...prev,
        {
          speaker: 'assistant',
          message: 'I’m refining your property narrative and will deliver premium recommendations shortly.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#02060e] text-white overflow-x-hidden">
      <div className="relative overflow-hidden pb-20">
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(40,212,255,0.18),_transparent_22%)] pointer-events-none" />
        <div className="container mx-auto px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.65fr] items-start">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: 'easeOut' }} className="space-y-6">
              <p className="text-sm uppercase tracking-[0.34em] text-cyan-300/75">Property details</p>
              <h1 className="text-5xl font-extrabold leading-tight neon">{property.title}</h1>
              <p className="max-w-2xl text-lg opacity-75">{property.location} · ${property.price.toLocaleString()} · {property.bedrooms} beds · {property.bathrooms} baths · {property.area} m²</p>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="glass rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">Concierge actions</p>
                  <h2 className="mt-3 text-3xl font-semibold neon">Instant property services</h2>
                  <p className="mt-3 text-sm opacity-70">Book a private tour, contact the luxury agent, or save this listing to your exclusive portfolio with a single seamless flow.</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setBookingModalOpen(true)}
                      className="rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5"
                    >
                      Book viewing
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocusInquiry(true)}
                      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
                    >
                      Contact agent
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 items-center">
                    <FavoriteButton propertyId={property.id} />
                    <span className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.26em] text-cyan-200/80 shadow-sm">Live luxury flow</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-xl">
                  <p className="text-sm opacity-70">Bedrooms</p>
                  <AnimatedNumber value={property.bedrooms} label="" />
                </div>
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-xl">
                  <p className="text-sm opacity-70">Bathrooms</p>
                  <AnimatedNumber value={property.bathrooms} label="" />
                </div>
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl backdrop-blur-xl">
                  <p className="text-sm opacity-70">Living area</p>
                  <span className="text-3xl font-semibold neon">{property.area} m²</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {highlightFeatures.map((feature) => (
                  <div key={feature.label} className="glass rounded-3xl border border-white/10 p-5 shadow-lg backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">{feature.label}</p>
                    <p className="mt-3 font-semibold">{feature.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }} className="glass rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Concierge booking</p>
                  <h2 className="mt-4 text-2xl font-semibold neon">Private tour planning</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAssistantOpen((current) => !current)}
                  className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100/85 transition hover:bg-slate-900"
                >
                  {assistantOpen ? 'Hide concierge' : 'Show concierge'}
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 opacity-75">Reserve an executive walkthrough with premium scheduling and a high-touch discovery experience.</p>

              <div className="mt-6 space-y-4 rounded-3xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center justify-between text-sm opacity-80">
                  <span>AI readiness</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="flex items-center justify-between text-sm opacity-80">
                  <span>Closing window</span>
                  <span className="font-semibold">14 days</span>
                </div>
                <div className="flex items-center justify-between text-sm opacity-80">
                  <span>Virtual preview</span>
                  <span className="font-semibold">Instant access</span>
                </div>
              </div>

              <button className="mt-6 w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5">
                Reserve your private tour
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      {assistantOpen && <ConciergePanel chatHistory={chatHistory} typing={typing} suggestions={customSuggestions} onSelectSuggestion={handleSuggestion} onClose={() => setAssistantOpen(false)} />}
      <BookingModal property={property} open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} onConfirmed={() => setBookingModalOpen(false)} />

      <Seo
        title={`${property.title} — Luxury Property Detail`}
        description={`Explore ${property.title} in ${property.location}: a premium luxury residence with panoramic views, elite finishes, and an immersive 3D preview.`}
        image={property.image}
      />

      <section className="container mx-auto px-6 space-y-10 pb-20">
        <RoomWalkthrough activeRoom={activeRoom} rooms={roomScenarios} setActiveRoom={setActiveRoom} />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
            <div className="glass rounded-[32px] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-2xl font-semibold neon">Immersive 3D preview</h2>
                <p className="mt-2 text-sm opacity-70">Navigate the property with cinematic depth, ambient lighting, and floating informational detail.</p>
              </div>
              <div className="h-[520px]"><PropertyScene model="/models/lantern.glb" room={activeRoom} /></div>
            </div>

            <MortgageCalculator price={property.price} />
          </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <BookingForm propertyId={property.id} />
          <div id="inquiry-section">
            <InquiryForm propertyId={property.id} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-3xl border border-white/10 p-6 lg:col-span-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">Gallery</p>
                <h3 className="mt-2 text-2xl font-semibold neon">Room-to-room transitions</h3>
              </div>
              <span className="text-sm opacity-70">Swipe for detail</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[property.image, displayRecommendations[0]?.image, displayRecommendations[1]?.image]
                .filter(Boolean)
                .map((src, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -6 }}
                    className="relative overflow-hidden rounded-3xl bg-slate-950/80 h-44 shadow-xl border border-white/10"
                  >
                    <Image
                      alt="Gallery preview"
                      src={src as string}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 ease-out"
                    />
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 p-6 shadow-xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">AI recommendations</p>
            <h3 className="mt-3 text-2xl font-semibold neon">Curated luxury matches</h3>
            <p className="mt-3 text-sm opacity-75">Our AI concierge surfaces elite residences that complement your portfolio and design sensibilities.</p>

            <div className="mt-6 space-y-4">
                {displayRecommendations.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    onClick={() => setActiveIndex(index)}
                    className={`cursor-pointer w-full rounded-3xl border px-4 py-4 text-left transition ${
                      activeIndex === index
                        ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_24px_40px_rgba(56,189,248,0.12)]'
                        : 'border-white/10 bg-white/5 hover:border-cyan-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-1 text-sm opacity-70">{item.location ?? item.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setBookingModalOpen(true);
                          setActiveIndex(index);
                        }}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100 transition hover:border-cyan-400/40"
                      >
                        Book preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950/80 to-slate-900/80 p-5 border border-white/10 shadow-lg">
              <p className="text-sm opacity-70">Instant monthly estimate</p>
              <p className="mt-2 text-3xl font-semibold neon">${monthlyEstimation.toLocaleString()}</p>
              <p className="mt-2 text-sm opacity-60">Premium financing shown for qualified luxury clients.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
