import { useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Subtle magnetic pull for interactive elements (MelonUI magnetic-nav inspired).
 *
 * Returns a single ref you attach to the element. On pointer move the element
 * eases toward the cursor (capped strength), and springs gently back on leave.
 * Degrades to a no-op under reduced motion or on coarse pointers.
 *
 * @param {number} strength - 0..1 pull factor. Keep low (0.12-0.2) for a premium feel.
 * @param {number} radius   - Distance (px) around the element center where pull engages.
 */
export default function useMagnetic(strength = 0.16, radius = 140) {
  const ref = useRef(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const onChange = (e) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (reducedMotion.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        return;
      }
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    [strength, radius]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion.current) {
      gsap.set(el, { x: 0, y: 0 });
      return;
    }
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}