import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function revealFromBottom(el: Element | string, delay = 0) {
  gsap.fromTo(
    el,
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.02, ease: 'power3.out', delay }
  );
}

export function staggerFade(selector: string, options: { stagger?: number } = {}) {
  gsap.fromTo(
    selector,
    { y: 22, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, stagger: options.stagger ?? 0.08, ease: 'power3.out' }
  );
}

export function revealOnScroll(selector: string, cfg: any = {}) {
  gsap.fromTo(
    selector,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: cfg.duration || 1,
      ease: cfg.ease || 'power3.out',
      scrollTrigger: {
        trigger: selector,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...cfg.scrollTrigger
      }
    }
  );
}

export function sectionTransitionTimeline(container: string) {
  const tl = gsap.timeline({ paused: true });
  tl.to(container, { yPercent: -100, duration: 0.9, ease: 'power2.inOut' });
  return tl;
}

