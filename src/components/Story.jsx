import { useEffect, useRef, useState } from 'react';
import cafeInterior from '../assets/images/cafe-interior.png';
import useScrollReveal from '../hooks/useScrollReveal';

function Counter({ target }) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(update);
            else setCount(target);
          };
          requestAnimationFrame(update);
          observer.disconnect();
        }
      },
      { threshold: 0.85 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="stat-number" ref={elRef}>
      {count}
    </div>
  );
}

export default function Story() {
  const imageRef = useScrollReveal('scroll-reveal-left');
  const textRef = useScrollReveal('scroll-reveal-right');
  const statsRef = useScrollReveal('stagger-children');

  return (
    <section className="story-section section-padding" id="story">
      <div className="story-content">
        <div className="story-image-container" ref={imageRef}>
          <img
            src={cafeInterior}
            alt="Warm interior of Ember &amp; Oak coffeehouse with exposed brick and industrial lighting"
          />
          <div className="story-image-overlay"></div>
        </div>

        <div className="story-text" ref={textRef}>
          <div className="section-tag">Our Story</div>
          <h2 className="section-title">
            Crafted with <em>Passion,</em>
            <br />Served with Love
          </h2>
          <p>
            What began as a small roasting operation in a Brooklyn garage has grown into a beloved
            neighborhood institution. Every bean is hand-selected from sustainable farms across
            three continents, roasted in small batches, and brewed with meticulous care.
          </p>
          <p>
            At Ember &amp; Oak, we believe great coffee is more than a drink — it's a ritual, a
            moment of calm, a bridge between strangers. Our doors are open to dreamers, creators,
            and anyone who appreciates the art of a perfect cup.
          </p>

          <div className="story-stats stagger-children" ref={statsRef}>
            <div className="stat-item">
              <Counter target={12} />
              <div className="stat-label">Origins Sourced</div>
            </div>
            <div className="stat-item">
              <Counter target={50} />
              <div className="stat-label">K+ Cups Served</div>
            </div>
            <div className="stat-item">
              <Counter target={7} />
              <div className="stat-label">Years Roasting</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
