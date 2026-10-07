import { useEffect, useRef } from 'react';
import heroCoffee from '../assets/images/hero-coffee.png';

export default function Hero() {
  const heroBgRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroScrollIndicatorRef = useRef(null);

  // Magnetic hover effect for buttons
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;

      // Hero background parallax
      if (heroBgRef.current && scrollY < window.innerHeight) {
        heroBgRef.current.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
      }

      // Hero title opacity on scroll
      if (heroTitleRef.current) {
        const opacity = Math.max(0, 1 - scrollY / 600);
        heroTitleRef.current.style.opacity = opacity;
        heroTitleRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }

      // Hero content fade
      if (heroContentRef.current) {
        const heroHeight = window.innerHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        heroContentRef.current.style.opacity = 1 - progress;
        heroContentRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }

      // Scroll indicator fade
      if (heroScrollIndicatorRef.current) {
        const heroHeight = window.innerHeight;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        heroScrollIndicatorRef.current.style.opacity = 1 - progress * 2;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      );
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img
          ref={heroBgRef}
          src={heroCoffee}
          alt="Artisan coffee flat lay with latte art and fresh pastries"
        />
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content" ref={heroContentRef}>
        <div className="hero-badge">Est. 2018 · Artisan Roasters</div>
        <h1 className="hero-title" ref={heroTitleRef}>
          Where Every Cup <br />Tells a <em>Story</em>
        </h1>
        <p className="hero-subtitle">
          Hand-roasted beans, crafted drinks, and a space designed for connection.{' '}
          Welcome to your new favorite coffeehouse.
        </p>
        <div className="hero-actions">
          <a
            href="#menu"
            className="btn-primary"
            onClick={(e) => handleSmoothScroll(e, '#menu')}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Explore Our Menu →
          </a>
          <a
            href="#story"
            className="btn-secondary"
            onClick={(e) => handleSmoothScroll(e, '#story')}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Our Story
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator" ref={heroScrollIndicatorRef}>
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
