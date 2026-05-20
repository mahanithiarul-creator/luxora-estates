import { useEffect, useRef, useState } from 'react';

type BrowserAudioContext = AudioContext | (typeof window extends { webkitAudioContext: infer T } ? T : AudioContext);

function createAmbientNodes(context: AudioContext) {
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const oscillator = context.createOscillator();

  oscillator.type = 'sine';
  oscillator.frequency.value = 110;
  gain.gain.value = 0.02;
  filter.type = 'lowpass';
  filter.frequency.value = 540;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  return { oscillator, gain, filter };
}

export default function AmbientAudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<{ context: AudioContext; nodes: ReturnType<typeof createAmbientNodes> } | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setSupported(false);
      return;
    }

    const AudioConstructor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AudioConstructor) {
      setSupported(false);
    }

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.nodes.oscillator.stop();
        } catch {
          // ignore if already stopped
        }
        audioRef.current.context.close().catch(() => {});
      }
    };
  }, []);

  const toggleAmbient = async () => {
    if (!supported) return;

    if (enabled) {
      if (audioRef.current) {
        try {
          audioRef.current.nodes.oscillator.stop();
        } catch {
          // ignore if already stopped
        }
        audioRef.current.context.close().catch(() => {});
        audioRef.current = null;
      }
      setEnabled(false);
      return;
    }

    try {
      const AudioConstructor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      if (!AudioConstructor) {
        throw new Error('AudioContext unsupported');
      }
      const context = new AudioConstructor();
      if (context.state === 'suspended') {
        await context.resume();
      }
      const nodes = createAmbientNodes(context);
      nodes.oscillator.start();
      audioRef.current = { context, nodes };
      setEnabled(true);
    } catch {
      setSupported(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleAmbient}
      className="fixed bottom-6 right-6 z-50 rounded-full border border-white/15 bg-slate-950/85 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl transition hover:scale-[1.02]"
    >
      {supported ? (enabled ? 'Ambient soundtrack on' : 'Ambient soundtrack off') : 'Audio unavailable'}
    </button>
  );
}
