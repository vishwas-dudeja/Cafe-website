import { useState, useRef } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [btnText, setBtnText] = useState('Subscribe');
  const [btnStyle, setBtnStyle] = useState({});
  const contentRef = useScrollReveal('scroll-reveal');

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnText('✓ Subscribed!');
    setBtnStyle({ background: '#4a9865', borderColor: '#4a9865' });
    setEmail('');

    setTimeout(() => {
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
          <button type="submit" style={btnStyle}>
            {btnText}
          </button>
        </form>
      </div>
    </section>
  );
}
