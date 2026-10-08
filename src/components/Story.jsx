import { useEffect, useRef, useState } from 'react';
import cafeInterior from '../assets/images/cafe-interior.png';

function Counter({ target, suffix = '', padZero = false }) {
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
          const duration = 1800;
          const startTime = performance.now();

          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(target * eased);
            setCount(currentVal);
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(update);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const formatted = padZero && count < 10 ? `0${count}` : `${count}`;

  return (
    <span ref={elRef} className="story-stat-number">
      {formatted}
      {suffix && <span className="story-stat-suffix">{suffix}</span>}
    </span>
  );
}

export default function Story() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('story-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="story-editorial" id="story" ref={sectionRef}>
      {/* Subtle large background year artwork */}
      <div className="story-year-bg" aria-hidden="true">
        2018
      </div>

      <div className="story-editorial-container">
        {/* Main Editorial Grid */}
        <div className="story-main-grid">
          {/* Left / Narrative Column */}
          <div className="story-narrative">
            <span className="story-eyebrow">OUR STORY / BROOKLYN / 2018</span>

            <h2 className="story-heading">
              BORN FROM FIRE.
              <br />
              BUILT AROUND <span className="story-heading-accent">RITUAL.</span>
            </h2>

            <div className="story-paragraphs">
              <p className="story-lead">
                What started as a small roasting setup in a Brooklyn garage became a neighborhood
                ritual — built around carefully sourced beans, patient roasting, and an obsession
                with getting every cup right.
              </p>
              <p className="story-body">
                We work with producers across three continents, roast in small batches, and brew each
                coffee with the attention it deserves. For us, coffee isn't simply something you
                drink. It's time shared, ideas started, and a reason to stay a little longer.
              </p>
            </div>
          </div>

          {/* Right / Photograph Column */}
          <div className="story-visual-column">
            <div className="story-image-wrap">
              <img
                src={cafeInterior}
                alt="Warm and inviting interior of Ember &amp; Oak coffeehouse in Brooklyn"
                className="story-photo"
                loading="lazy"
              />
            </div>
            <div className="story-photo-caption">
              <span>01 / THE WORKSHOP</span>
              <span>BROOKLYN, NY</span>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="story-stats-strip">
          <div className="story-stat-cell">
            <Counter target={12} />
            <span className="story-stat-label">Origins Sourced</span>
          </div>

          <div className="story-stat-divider" aria-hidden="true"></div>

          <div className="story-stat-cell">
            <Counter target={50} suffix="K+" />
            <span className="story-stat-label">Cups Served</span>
          </div>

          <div className="story-stat-divider" aria-hidden="true"></div>

          <div className="story-stat-cell">
            <Counter target={7} padZero={true} />
            <span className="story-stat-label">Years Roasting</span>
          </div>
        </div>
      </div>
    </section>
  );
}
