import { useEffect } from 'react';

/**
 * Creates a custom cursor dot that follows the mouse with a lag effect (desktop only).
 * Also scales up on hoverable elements — replicates the original script.js cursor logic.
 */
export default function useCursorTrail() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-dot');
    document.body.appendChild(cursorTrail);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let animFrame;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorTrail.style.left = `${cursorX - 4}px`;
      cursorTrail.style.top = `${cursorY - 4}px`;
      animFrame = requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('mousemove', onMouseMove);

    // Scale on hoverable elements
    const hoverables = document.querySelectorAll(
      'a, button, .category-card, .menu-card, .experience-card'
    );
    const onEnter = () => {
      cursorTrail.style.transform = 'scale(3)';
      cursorTrail.style.opacity = '0.5';
    };
    const onLeave = () => {
      cursorTrail.style.transform = 'scale(1)';
      cursorTrail.style.opacity = '1';
    };
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrame);
      if (cursorTrail.parentNode) cursorTrail.parentNode.removeChild(cursorTrail);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);
}
