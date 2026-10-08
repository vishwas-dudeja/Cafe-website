import { useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Restrained click ripple for primary CTAs (MelonUI ripple-button inspired,
 * stripped of the hover fill). Call `perform(e)` inside your own click handler.
 *
 * Requires the host element to have `position: relative; overflow: hidden`
 * (class `.has-ripple`) so the ripple stays clipped to the button.
 */
export default function useRipple({ color = 'rgba(148, 76, 8, 0.28)' } = {}) {
  const colorRef = useRef(color);

  const perform = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const btn = e.currentTarget;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.15;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.background = colorRef.current;
    btn.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 0.65 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        },
      }
    );
  };

  return { perform };
}