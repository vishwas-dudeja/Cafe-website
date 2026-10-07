import { useEffect, useState, useCallback } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
    return () => window.removeEventListener('scroll', handleNavScroll);
  }, [handleNavScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      );
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
    closeMobile();
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <a href="#" className="nav-logo" onClick={(e) => handleSmoothScroll(e, '#hero')}>
          EMBER &amp; OAK
          <span>Coffee Workshop</span>
        </a>

        <div className="nav-links" id="navLinks">
          <a href="#story" onClick={(e) => handleSmoothScroll(e, '#story')}>Our Story</a>
          <a href="#menu" onClick={(e) => handleSmoothScroll(e, '#menu')}>Menu</a>
          <a href="#experience" onClick={(e) => handleSmoothScroll(e, '#experience')}>Experience</a>
          <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')}>Reviews</a>
          <a href="#contact" className="nav-cta" onClick={(e) => handleSmoothScroll(e, '#contact')}>Visit Us</a>
        </div>

        <button
          className={`hamburger${mobileOpen ? ' active' : ''}`}
          id="hamburger"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' active' : ''}`} id="mobileMenu">
        <a href="#story" onClick={(e) => handleSmoothScroll(e, '#story')}>Our Story</a>
        <a href="#menu" onClick={(e) => handleSmoothScroll(e, '#menu')}>Menu</a>
        <a href="#experience" onClick={(e) => handleSmoothScroll(e, '#experience')}>Experience</a>
        <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')}>Reviews</a>
        <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>Visit Us</a>
      </div>
    </>
  );
}
