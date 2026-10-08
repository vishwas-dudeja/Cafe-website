import { useState, useRef, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import useRipple from '../hooks/useRipple';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [btnText, setBtnText] = useState('Subscribe');
  const [btnStyle, setBtnStyle] = useState({});
  const contentRef = useScrollReveal('scroll-reveal');
  const resetTimerRef = useRef(null);
  const ripples = useRipple({ color: 'rgba(62, 17, 3, 0.3)' });

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnText('✓ Subscribed!');
    setBtnStyle({
      background: 'var(--brand-caramel, #944c08)',
      borderColor: 'var(--brand-caramel, #944c08)',
      color: '#fffaf4',
    });
    setEmail('');

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setBtnText('Subscribe');
      setBtnStyle({});
    }, 3000);
  };

  return (
    <section className="cta-section section-padding" id="contact">
      <div className="cta-content scroll-reveal" ref={contentRef}>
        <div className="section-tag">Stay Connected</div>
        <h2 className="cta-title">
          Join the Ember &amp; Oak <em>Family</em>
        </h2>
        <p className="cta-desc">
          Get exclusive offers, new blend announcements, and invitations to our cupping events —
          delivered straight to your inbox.
        </p>
        <form className="cta-form" id="ctaForm" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            required
            id="emailInput"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="has-ripple cta-submit"
            style={btnStyle}
            onClick={ripples.perform}
          >
            <span>{btnText}</span>
          </button>
        </form>
      </div>
    </section>
  );
}