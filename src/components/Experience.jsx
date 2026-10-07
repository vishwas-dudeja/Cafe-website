import { useEffect, useRef } from 'react';
import cafeInterior from '../assets/images/cafe-interior.png';
import latteArt from '../assets/images/latte-art.png';
import coffeeBeans from '../assets/images/coffee-beans.png';
import pastries from '../assets/images/pastries.png';
import heroCoffee from '../assets/images/hero-coffee.png';
import useScrollReveal from '../hooks/useScrollReveal';

const cards = [
  {
    img: cafeInterior,
    alt: 'Cozy cafe seating area',
    title: 'The Lounge',
    desc: 'A cozy workspace and reading nook, curated for focus and comfort.',
  },
  {
    img: latteArt,
    alt: 'Latte art workshop',
    title: 'Latte Art Workshops',
    desc: 'Learn the craft from our head barista, every Saturday morning.',
  },
  {
    img: coffeeBeans,
    alt: 'Coffee cupping session',
    title: 'Cupping Sessions',
    desc: 'Explore origins and flavor profiles in our guided tastings.',
  },
  {
    img: pastries,
    alt: 'Brunch at the cafe',
    title: 'Weekend Brunch',
    desc: 'Fresh pastries, seasonal bowls, and bottomless drip coffee.',
  },
  {
    img: heroCoffee,
    alt: 'Acoustic night at Ember & Oak',
    title: 'Acoustic Evenings',
    desc: 'Live local music, craft mocktails, and a warm glow every Friday night.',
  },
];

export default function Experience() {
  const headerRef = useScrollReveal('scroll-reveal');
  const scrollRef = useRef(null);

  // Drag-to-scroll horizontal
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section className="experience-section section-padding" id="experience">
      <div className="section-header scroll-reveal" ref={headerRef}>
        <div className="section-tag">The Experience</div>
        <h2 className="section-title">
          More Than <em>Coffee</em>
        </h2>
        <p className="section-desc">
          From cupping sessions to live acoustic evenings — there's always something brewing.
        </p>
      </div>

      <div
        className="experience-scroll-container"
        id="experienceScroll"
        ref={scrollRef}
      >
        {cards.map((card, idx) => (
          <div className="experience-card" key={idx}>
            <img src={card.img} alt={card.alt} />
            <div className="experience-card-content">
              <h3 className="experience-card-title">{card.title}</h3>
              <p className="experience-card-desc">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
