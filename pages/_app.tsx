import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import LoadingScreen from '../components/LoadingScreen';
import { AnimatePresence, motion } from 'framer-motion';
import useLenis from '../hooks/useLenis';
import useAudioVisual from '../hooks/useAudioVisual';
import Cursor from '../components/UX/Cursor';
import PageTransitionOverlay from '../components/PageTransitionOverlay';
import { AuthProvider } from '../components/Auth/AuthContext';
import { ExperienceProvider } from '../components/Experience/ExperienceContext';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps, router }: AppProps) {
  useLenis();
  useAudioVisual();

  return (
    <AuthProvider>
      <ExperienceProvider>
        <ErrorBoundary>
          <Layout>
            <Cursor />
            <LoadingScreen />
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => typeof window !== 'undefined' && window.scrollTo(0, 0)}>
              <motion.div
                key={router.route}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <PageTransitionOverlay />
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </Layout>
        </ErrorBoundary>
      </ExperienceProvider>
    </AuthProvider>
  );
}

export default MyApp;
