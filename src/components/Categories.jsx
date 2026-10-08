import { useEffect, useRef } from 'react';
import latteArt from '../assets/images/latte-art.png';
import coldBrew from '../assets/images/cold-brew.png';
import pastries from '../assets/images/pastries.png';
import MagneticLink from './MagneticLink';

export default function Categories() {
  const sectionRef = useRef(null);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '80',
        10
      );
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('signatures-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="signatures-section" id="categories" ref={sectionRef}>
      <div className="signatures-container">
        {/* Editorial Section Header */}
        <header className="signatures-header">
          <div className="signatures-header-left">
            <span className="signatures-eyebrow">SIGNATURES / 01—03</span>
            <h2 className="signatures-title">
              <span className="editorial-lines">
                <span className="editorial-line">
                  <span>MADE TO BE</span>
                </span>
                <span className="editorial-line">
                  <span>REMEMBERED.</span>
                </span>
              </span>
            </h2>
          </div>
          <div className="signatures-header-right">
            <p className="signatures-intro">
              Three house favorites built around the same idea: better ingredients, careful
              technique, and nothing that doesn't belong.
            </p>
          </div>
        </header>

        {/* Asymmetrical Editorial Product Grid */}
        <div className="signatures-grid">
          {/* Featured Signature — Crafted Latte (Left, ~7 cols) */}
          <a
            href="#menu"
            className="signature-item signature-featured"
            onClick={(e) => handleSmoothScroll(e, '#menu')}
            aria-label="Crafted Latte — View Menu"
            data-cursor="view"
          >
            <div className="signature-media">
              <img
                src={latteArt}
                alt="Latte with hand-poured rosetta art"
                className="signature-image"
                loading="lazy"
              />
              <div className="signature-gradient-wash"></div>
            </div>

            <div className="signature-content">
              <div className="signature-badge-row">
                <span className="signature-index">01</span>
                <span className="signature-action-cue">
                  DISCOVER <span className="signature-arrow">→</span>
                </span>
              </div>
              <h3 className="signature-name">CRAFTED LATTE</h3>
              <p className="signature-desc">Espresso · steamed milk · hand-poured art</p>
              <div className="signature-notes">
                <span className="signature-notes-label">Notes</span>
                <span>Cocoa · Vanilla · Caramel</span>
              </div>
            </div>
          </a>

          {/* Secondary Signatures Stack (Right, ~5 cols) */}
          <div className="signatures-secondary-stack">
            {/* Signature 02 — Cold Brew */}
            <a
              href="#menu"
className="signature-item signature-secondary"
              onClick={(e) => handleSmoothScroll(e, '#menu')}
              aria-label="Cold Brew — View Menu"
              data-cursor="view"
            >
              <div className="signature-media">
                <img
                  src={coldBrew}
                  alt="Glass of Ember &amp; Oak cold brew"
                  className="signature-image"
                  loading="lazy"
                />
                <div className="signature-gradient-wash"></div>
              </div>

              <div className="signature-content">
                <div className="signature-badge-row">
                  <span className="signature-index">02</span>
                  <span className="signature-action-cue">
                    DISCOVER <span className="signature-arrow">→</span>
                  </span>
                </div>
                <h3 className="signature-name">COLD BREW</h3>
                <p className="signature-desc">Steeped slowly. Served clean.</p>
                <div className="signature-notes">
                  <span className="signature-notes-label">Notes</span>
                  <span>Chocolate · Molasses · Orange</span>
                </div>
              </div>
            </a>

            {/* Signature 03 — Morning Pastries */}
            <a
              href="#menu"
className="signature-item signature-secondary"
              onClick={(e) => handleSmoothScroll(e, '#menu')}
              aria-label="Morning Pastries — View Menu"
              data-cursor="view"
            >
              <div className="signature-media">
                <img
                  src={pastries}
                  alt="Fresh pastries displayed at Ember &amp; Oak"
                  className="signature-image"
                  loading="lazy"
                />
                <div className="signature-gradient-wash"></div>
              </div>

              <div className="signature-content">
                <div className="signature-badge-row">
                  <span className="signature-index">03</span>
                  <span className="signature-action-cue">
                    DISCOVER <span className="signature-arrow">→</span>
                  </span>
                </div>
                <h3 className="signature-name">MORNING PASTRIES</h3>
                <p className="signature-desc">Baked fresh for the first cup of the day.</p>
                <div className="signature-notes">
                  <span className="signature-notes-label">Notes</span>
                  <span>Butter · Almond · Seasonal fruit</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Section Footer / CTA */}
        <div className="signatures-footer">
          <MagneticLink
            href="#menu"
            className="signatures-cta btn-sweep"
            onClick={(e) => handleSmoothScroll(e, '#menu')}
          >
            <span>SEE THE FULL MENU</span>
            <span className="signatures-cta-arrow">→</span>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
