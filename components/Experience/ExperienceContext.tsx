import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import GlobalBookingModal from './GlobalBookingModal';
import GlobalConciergeModal from './GlobalConciergeModal';
import DemoOverlay from './DemoOverlay';
import Toaster from './Toaster';

type ToastType = 'success' | 'error' | 'info';

type ToastPayload = {
  id: number;
  type: ToastType;
  title: string;
  message: string;
};

type ExperienceContextType = {
  openBookingModal: () => void;
  openConciergeModal: () => void;
  openDemoOverlay: () => void;
  closeModals: () => void;
  showToast: (toast: Omit<ToastPayload, 'id'>) => void;
};

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<'booking' | 'concierge' | null>(null);
  const [toasts, setToasts] = useState<ToastPayload[]>([]);
  const [isDemoOverlayOpen, setIsDemoOverlayOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seenDemo = window.localStorage.getItem('luxora_demo_seen');
    if (!seenDemo) {
      setIsDemoOverlayOpen(true);
      window.localStorage.setItem('luxora_demo_seen', 'true');
    }
  }, []);

  const openBookingModal = () => setActiveModal('booking');
  const openConciergeModal = () => setActiveModal('concierge');
  const openDemoOverlay = () => setIsDemoOverlayOpen(true);
  const closeModals = () => setActiveModal(null);
  const closeDemoOverlay = () => setIsDemoOverlayOpen(false);

  const showToast = (toast: Omit<ToastPayload, 'id'>) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...toast, id }]);

    if (typeof window === 'undefined') return;

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  };

  const value = useMemo(
    () => ({ openBookingModal, openConciergeModal, openDemoOverlay, closeModals, showToast }),
    []
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      <Toaster items={toasts} />
      <GlobalBookingModal open={activeModal === 'booking'} onClose={closeModals} />
      <GlobalConciergeModal open={activeModal === 'concierge'} onClose={closeModals} />
      <DemoOverlay open={isDemoOverlayOpen} onClose={closeDemoOverlay} />
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider');
  }
  return context;
}
