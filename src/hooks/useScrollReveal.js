import { useEffect, useRef } from 'react';

/**
 * A hook that observes an element and adds 'revealed' class when it enters the viewport.
 * @param {string} baseClass - The base class to apply initially (e.g. 'scroll-reveal', 'stagger-children')
 */
export default function useScrollReveal(baseClass) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
