import { useEffect } from 'react';

/**
 * Contextual custom cursor (desktop pointer only).
 *
 * Composed of three fixed elements:
 *   - a small caramel dot that tracks the pointer tightly
 *   - a lagging ring that eases behind the dot
 *   - an optional contextual label ("DRAG", "VIEW"...) triggered via `data-cursor`
 *
 * Never renders on coarse pointers or when the user prefers reduced motion.
 * Uses event delegation so new interactive content is picked up automatically.
 */
export default function useCursorTrail() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);

    const label = document.createElement('span');
    label.className = 'cursor-label';
    const labelText = document.createElement('span');
    label.appendChild(labelText);
    document.body.appendChild(label);

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let animFrame;
    let curLabel = '';

    const setLabel = (title) => {
      if (title !== curLabel) {
        curLabel = title;
        labelText.textContent = title;
      }
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      dotX += (mouseX - dotX) * 0.4;
      dotY += (mouseY - dotY) * 0.4;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      label.style.transform = `translate3d(${ringX}px, ${ringY - 30}px, 0)`;

      animFrame = requestAnimationFrame(animate);
    };
    animate();

    const CLASSES = ['cursor-link', 'cursor-drag'];

    const applyMode = (mode) => {
      document.body.classList.remove(...CLASSES);
      if (mode) document.body.classList.add(mode);
      if (mode === 'cursor-drag') setLabel('DRAG');
      else if (mode === 'cursor-view') setLabel('VIEW');
      else if (mode === 'cursor-explore') setLabel('EXPLORE');
      else setLabel('');
    };

    const onOver = (e) => {
      const interactive = e.target.closest(
        'a, button, [tabindex], [data-cursor], .experience-card, .menu-item, .signature-item'
      );
      if (!interactive) {
        applyMode(null);
        return;
      }
      const custom = interactive.getAttribute('data-cursor');
      if (custom === 'drag') applyMode('cursor-drag');
      else if (custom === 'view') applyMode('cursor-view');
      else if (custom === 'explore') applyMode('cursor-explore');
      else applyMode('cursor-link');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) applyMode(null);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(animFrame);
      [dot, ring, label].forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, []);
}