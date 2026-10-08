import { useEffect, useState, useCallback, useRef } from 'react';
import MagneticLink from './MagneticLink';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const lastFocusRef = useRef(null);

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

  // Close on Escape; restore focus to the hamburger
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        if (lastFocusRef.current) {
          lastFocusRef.current.focus();
          lastFocusRef.current = null;
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const toggleMobile = () => {
    if (!mobileOpen && menuBtnRef.current) {
      lastFocusRef.current = menuBtnRef.current;
    }
    setMobileOpen((v) => !v);
  };

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

  const linkProps = (targetId) => ({
    href: targetId,
    onClick: (e) => handleSmoothScroll(e, targetId),
  });

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <a href="#" className="nav-logo" onClick={(e) => handleSmoothScroll(e, '#hero')}>
          EMBER &amp; OAK
          <span>Coffee Workshop</span>
        </a>

        <div className="nav-links" id="navLinks">
          <MagneticLink {...linkProps('#story')}>Our Story</MagneticLink>
          <MagneticLink {...linkProps('#menu')}>Menu</MagneticLink>
          <MagneticLink {...linkProps('#experience')}>Experience</MagneticLink>
          <MagneticLink {...linkProps('#testimonials')}>Reviews</MagneticLink>
          <MagneticLink className="nav-cta" ripple rippleColor="rgba(62, 17, 3, 0.3)" {...linkProps('#contact')}>Visit Us</MagneticLink>
        </div>

        <button
          className={`hamburger${mobileOpen ? ' active' : ''}`}
          id="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobileMenu"
          ref={menuBtnRef}
          onClick={toggleMobile}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu${mobileOpen ? ' active' : ''}`}
        id="mobileMenu"
        aria-hidden={!mobileOpen}
      >
        <a href="#story" onClick={(e) => handleSmoothScroll(e, '#story')}>Our Story</a>
        <a href="#menu" onClick={(e) => handleSmoothScroll(e, '#menu')}>Menu</a>
        <a href="#experience" onClick={(e) => handleSmoothScroll(e, '#experience')}>Experience</a>
        <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')}>Reviews</a>
        <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>Visit Us</a>
      </div>
    </>
  );
}
