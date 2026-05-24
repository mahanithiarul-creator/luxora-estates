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
import Footer from '../../components/Footer';

const PropertyScene = dynamic(() => import('../../components/Property/PropertyScene'), {
  ssr: false,
  loading: () => <div className="h-full rounded-[2rem] bg-gradient-to-br from-white/10 via-white/[0.035] to-cyan-100/10" />,
});

const highlightFeatures = [
  { label: 'Arrival', value: 'Private porte cochere' },
  { label: 'Outlook', value: 'Panoramic horizon line' },
  { label: 'Service', value: 'White glove concierge' },
];

const roomScenarios = [
  {
    id: 'entrance',
    title: 'Grand entrance',
    description: 'A cinematic arrival lounge with warm stone, art lighting, and private access to every suite.',
  },
  {
    id: 'lounge',
    title: 'Luxury lounge',
    description: 'An immersive living space crafted for evening entertaining, soft reflections, and skyline drama.',
  },
  {
    id: 'terrace',
    title: 'Sky terrace',
    description: 'Private dining under atmospheric light with greenery, horizon views, and resort-grade quiet.',
  },
];

const customSuggestions = [
  'Show me skyline sunset views',
  'Recommend a stronger investor suite',
  'Prioritize terrace, spa, and privacy',
];

function formatNumber(value: number | undefined, fallback: number) {
  return typeof value === 'number' ? value : fallback;
}

function DetailSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="glass-luxury rounded-[1.4rem] p-5">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/12" />
          <div className="mt-5 h-9 w-20 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

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
  const [activeRoom, setActiveRoom] = useState<'entrance' | 'lounge' | 'terrace'>('entrance');
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [typing, setTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { speaker: 'assistant', message: 'Welcome to the private concierge. I can refine the residence story, schedule a viewing, or compare investment-fit alternatives.' },
  ]);

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
        setPropertyError('Showing curated fallback details while the live listing refreshes.');
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

  const displayRecommendations = liveRecommendations.length ? liveRecommendations : recommendations;
  const activeRecommendation = displayRecommendations[activeIndex] || displayRecommendations[0];
  const galleryImages = [property.image, ...displayRecommendations.map((item) => item.image)].filter(Boolean).slice(0, 3);
  const monthlyEstimation = useMemo(() => {
    const loan = property.price * 0.78;
    const monthlyRate = 0.035 / 12;
    const months = 30 * 12;
    return Math.round(loan * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months))));
  }, [property.price]);

  const handleSuggestion = async (queryText: string) => {
    setChatHistory((prev) => [...prev, { speaker: 'user', message: queryText }]);
    setTyping(true);

    try {
      const response = await fetch(`/api/ai/recommendations?propertyId=${encodeURIComponent(id || '')}&q=${encodeURIComponent(queryText)}`);
      const payload = await response.json();
      const nextMessage = payload?.recommendations?.length
        ? payload.recommendations.map((item: any) => `${item.title} - ${item.summary}`).join(' ')
        : 'I have refined the brief and prepared a tighter luxury shortlist for your next viewing sequence.';
      setChatHistory((prev) => [...prev, { speaker: 'assistant', message: nextMessage }]);
    } catch (error) {
      console.error('AI suggestion error', error);
      setChatHistory((prev) => [...prev, { speaker: 'assistant', message: 'I am refining the property narrative and will keep the experience stable while live recommendations refresh.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#02040a] text-white">
      <Seo
        title={`${property.title} - Luxury Property Detail`}
        description={`Explore ${property.title} in ${property.location}: a premium luxury residence with panoramic views, elite finishes, and an immersive 3D preview.`}
        image={property.image}
      />

      <section className="relative min-h-screen overflow-hidden pt-28">
        <Image src={property.image} alt={property.title} fill priority sizes="100vw" className="object-cover opacity-[0.54] saturate-90" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,10,0.94),rgba(2,4,10,0.55)_48%,rgba(2,4,10,0.78)),linear-gradient(180deg,rgba(2,4,10,0.12),#02040a_96%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(103,232,249,0.2),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(216,183,106,0.14),transparent_30%)]" />
        <div className="cinematic-grain absolute inset-0 opacity-[0.12]" />

        <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] items-end gap-10 px-6 pb-16 lg:grid-cols-[1fr_0.42fr]">
          <motion.div initial={{ opacity: 0, y: 26, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/72">Private residence dossier</p>
            <h1 className="mt-5 max-w-5xl text-[clamp(3.4rem,9vw,8.5rem)] font-black uppercase leading-[0.88]">{property.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-100/72 sm:text-lg">
              {property.location} - ${property.price.toLocaleString()} - {formatNumber(property.bedrooms, 5)} beds - {formatNumber(property.bathrooms, 6)} baths - {formatNumber(property.area, 900)} sqm
            </p>
            {propertyError && <p className="mt-4 text-sm text-amber-100/72">{propertyError}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setBookingModalOpen(true)} className="btn-luxury-primary rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.22em]">
                Book Private Viewing
              </button>
              <button type="button" onClick={() => setFocusInquiry(true)} className="btn-luxury-secondary rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.22em]">
                Contact Agent
              </button>
              <FavoriteButton propertyId={property.id} />
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="glass-luxury rounded-[1.75rem] p-5">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/62">Market signal</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <AnimatedNumber value={98} label="AI readiness" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <AnimatedNumber value={14} label="Day window" />
              </div>
            </div>
            <button type="button" onClick={() => setAssistantOpen((current) => !current)} className="btn-luxury-secondary mt-4 w-full rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.2em]">
              {assistantOpen ? 'Hide concierge' : 'Open concierge'}
            </button>
          </motion.aside>
        </div>
      </section>

      {assistantOpen && <ConciergePanel chatHistory={chatHistory} typing={typing} suggestions={customSuggestions} onSelectSuggestion={handleSuggestion} onClose={() => setAssistantOpen(false)} />}
      <BookingModal property={property} open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} onConfirmed={() => setBookingModalOpen(false)} />

      <section className="section-cinematic relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(103,232,249,0.1),transparent_28%),linear-gradient(180deg,#02040a,#060b13_48%,#02040a)]" />
        <div className="container relative z-10 mx-auto space-y-10 px-6">
          {propertyLoading ? (
            <DetailSkeleton />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-luxury rounded-[1.4rem] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/58">Bedrooms</p>
                <AnimatedNumber value={formatNumber(property.bedrooms, 5)} label="" />
              </div>
              <div className="glass-luxury rounded-[1.4rem] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/58">Bathrooms</p>
                <AnimatedNumber value={formatNumber(property.bathrooms, 6)} label="" />
              </div>
              <div className="glass-luxury rounded-[1.4rem] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/58">Living area</p>
                <span className="mt-3 block text-3xl font-semibold text-white">{formatNumber(property.area, 900)} sqm</span>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <RoomWalkthrough activeRoom={activeRoom} rooms={roomScenarios} setActiveRoom={setActiveRoom} />
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#02040a] shadow-cinematic">
                <div className="border-b border-white/10 px-6 py-5">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/58">Immersive 3D preview</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Cinematic room focus</h2>
                </div>
                <div className="h-[520px] sm:h-[620px]">
                  <PropertyScene model="/models/lantern.glb" room={activeRoom} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-luxury rounded-[1.75rem] p-6">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/58">Defining features</p>
                <div className="mt-5 grid gap-3">
                  {highlightFeatures.map((feature) => (
                    <div key={feature.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-300/56">{feature.label}</p>
                      <p className="mt-2 text-base font-semibold text-white">{feature.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <MortgageCalculator price={property.price} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <BookingForm propertyId={property.id} />
            <div id="inquiry-section">
              <InquiryForm propertyId={property.id} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass-luxury rounded-[1.75rem] p-5 lg:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/58">Gallery sequence</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-normal text-white">Image-led transitions</h3>
                </div>
                <span className="text-sm text-slate-200/54">Hover to reveal depth</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {galleryImages.map((src, index) => (
                  <motion.div key={`${src}-${index}`} whileHover={{ y: -8, scale: 1.02 }} className="relative h-56 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-cinematic">
                    <Image alt={`${property.title} gallery ${index + 1}`} src={src as string} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-[0.86] transition duration-700 hover:scale-105 hover:opacity-100" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,4,10,0.64))]" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-luxury rounded-[1.75rem] p-6">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/58">AI matches</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal text-white">Curated next move</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200/62">The concierge keeps recommendations focused on taste, privacy, and investment intent.</p>
              <div className="mt-5 space-y-3">
                {displayRecommendations.map((item, index) => (
                  <button
                    key={item.id ?? index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${activeIndex === index ? 'border-cyan-200/48 bg-cyan-100/10' : 'border-white/10 bg-white/[0.04] hover:border-cyan-100/30'}`}
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-200/58">{item.location ?? item.summary}</p>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/22 p-5">
                <p className="text-sm text-slate-200/58">Monthly estimate</p>
                <p className="mt-2 text-3xl font-semibold text-white">${monthlyEstimation.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-200/52">{activeRecommendation?.title || property.title} is ready for private preview.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
