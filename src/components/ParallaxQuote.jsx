import { useEffect, useRef } from 'react';
import coffeeBeans from '../assets/images/coffee-beans.png';
import useScrollReveal from '../hooks/useScrollReveal';

export default function ParallaxQuote() {
  const parallaxImgRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useScrollReveal('scroll-reveal');

  useEffect(() => {
    function handleParallax() {
      if (!sectionRef.current || !parallaxImgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (scrollProgress - 0.5) * 80;
        parallaxImgRef.current.style.transform = `translateY(${translateY}px) scale(1.1)`;
      }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  return (
    <section className="parallax-quote" id="quote" ref={sectionRef}>
      <div className="parallax-bg">
        <img
          src={coffeeBeans}
          alt="Roasted coffee beans"
          id="parallaxImg"
          ref={parallaxImgRef}
        />
      </div>
      <div className="parallax-overlay"></div>
      <div className="parallax-content scroll-reveal" ref={contentRef}>
        <div className="quote-mark">"</div>
        <p className="quote-text">
          Coffee is a language in itself. Each sip speaks of the soil, the hands, and the
          passion that brought it from seed to cup.
        </p>
        <span className="quote-author">— The Ember &amp; Oak Philosophy</span>
      </div>
    </section>
  );
}
