import { Fragment, useEffect, useRef, useState } from 'react';
import coffeeBeans from '../assets/images/coffee-beans.png';
import heroCoffee from '../assets/images/hero-coffee.png';
import latteArt from '../assets/images/latte-art.png';

const stages = [
  {
    num: '01',
    word: 'ORIGIN',
    img: coffeeBeans,
    alt: 'Roasted coffee beans — the raw material sourced from Ethiopia, Colombia, and Brazil',
    meta: ['ETHIOPIA', 'COLOMBIA', 'BRAZIL'],
  },
  {
    num: '02',
    word: 'ROAST',
    img: heroCoffee,
    alt: 'Dark, freshly roasted coffee ready for the grinder',
    meta: ['SMALL-BATCH ROASTED', 'MEDIUM-LIGHT / BALANCED', 'SEVERAL TIMES WEEKLY'],
  },
  {
    num: '03',
    word: 'BREW',
    img: latteArt,
    alt: 'Finished cup of Ember & Oak coffee with hand-poured latte art',
    meta: ['ESPRESSO · FILTER · MILK', 'RECIPES DIALED ALL DAY', 'BREWED TO ORDER'],
  },
];

function DetailRow({ label, value }) {
  return (
    <div className="journey-detail-row">
      <span className="journey-detail-key">{label}</span>
      <span className="journey-detail-val">{value}</span>
    </div>
  );
}

export default function CoffeeJourney() {
  const sectionRef = useRef(null);
  const chapterRefs = useRef([]);
  const finaleRef = useRef(null);
  // active = chapter owning the visual stage; prev = the one handing off,
  // so its image can crossfade out instead of snapping back to the idle scale.
  const [stage, setStage] = useState({ active: 0, prev: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const supportsObserver = typeof IntersectionObserver === 'function';
    const chapters = chapterRefs.current.filter(Boolean);
    const revealTargets = [...chapters, finaleRef.current].filter(Boolean);

    if (!supportsObserver) {
      section.classList.add('journey-revealed');
      revealTargets.forEach((el) =>
        el.classList.add(`${el.dataset.reveal || 'chapter'}-revealed`)
      );
      return undefined;
    }

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('journey-revealed');
          sectionObserver.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    sectionObserver.observe(section);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const kind = entry.target.dataset.reveal || 'chapter';
          entry.target.classList.add(`${kind}-revealed`);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));

    // Active stage: whichever chapter crosses the middle band of the viewport.
    // Works in both scroll directions — no one-time reveal logic, and the stage
    // is never cleared, so exactly one image is always visible.
    const stageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.dataset.stage);
          if (Number.isNaN(index)) return;
          setStage((current) =>
            current.active === index ? current : { active: index, prev: current.active }
          );
        });
      },
      { threshold: 0, rootMargin: '-35% 0px -45% 0px' }
    );
    chapters.forEach((el) => stageObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
      stageObserver.disconnect();
    };
  }, []);

  return (
    <section className="coffee-journey" id="process" ref={sectionRef}>
      <div className="journey-inner">
        {/* Editorial introduction */}
        <header className="journey-intro">
          <span className="journey-eyebrow">THE PROCESS / 01—03</span>
          <div className="journey-intro-grid">
            <h2 className="journey-heading">
              <span className="editorial-lines">
                <span className="editorial-line">
                  <span>FROM ORIGIN</span>
                </span>
                <span className="editorial-line">
                  <span>TO CUP.</span>
                </span>
              </span>
            </h2>
            <p className="journey-description">
              Great coffee isn&rsquo;t created at the machine. It starts thousands of miles
              earlier — with where it&rsquo;s grown, how it&rsquo;s roasted, and the decisions
              made before the first drop reaches the cup.
            </p>
          </div>
        </header>

        <div className="journey-layout">
          {/* Sticky editorial visual */}
          <div className="journey-visual-column">
            <div className="journey-visual-sticky">
              <div className="journey-progress" aria-hidden="true">
                {stages.map((s, index) => (
                  <Fragment key={`progress-${s.num}`}>
                    <span
                      className={`journey-progress-num${
                        index === stage.active ? ' is-active' : ''
                      }`}
                    >
                      {s.num}
                    </span>
                    {index < stages.length - 1 && <span className="journey-progress-line" />}
                  </Fragment>
                ))}
              </div>

              <div className="journey-frame">
                <div className="journey-image-stack">
                  {stages.map((s, index) => {
                    const isActive = index === stage.active;
                    const isLeaving = index === stage.prev && !isActive;
                    return (
                      <img
                        key={`stage-image-${s.word}`}
                        src={s.img}
                        alt={isActive ? s.alt : ''}
                        className={`journey-image${isActive ? ' is-active' : ''}${
                          isLeaving ? ' is-leaving' : ''
                        }`}
                        loading="lazy"
                      />
                    );
                  })}
                  <div className="journey-image-scrim" aria-hidden="true" />
                </div>

                <div className="journey-stage-display" aria-hidden="true">
                  {stages.map((s, index) => (
                    <div
                      key={`stage-display-${s.word}`}
                      className={`journey-stage-slide${
                        index === stage.active ? ' is-active' : ''
                      }`}
                    >
                      <span className="journey-stage-num">{s.num}</span>
                      <span className="journey-stage-word">{s.word}</span>
                      <ul className="journey-stage-meta">
                        {s.meta.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling chapters */}
          <ol className="journey-chapters">
            <li
              className="journey-chapter"
              data-stage="0"
              data-reveal="chapter"
              data-active={stage.active === 0 ? 'true' : 'false'}
              ref={(el) => {
                chapterRefs.current[0] = el;
              }}
            >
              <div className="journey-chapter-head">
                <span className="journey-number">01</span>
                <span className="journey-label">Origin</span>
              </div>

              <div className="journey-chapter-media">
                <img src={stages[0].img} alt={stages[0].alt} loading="lazy" />
              </div>

              <h3 className="journey-title">
                GOOD COFFEE
                <br />
                STARTS BEFORE
                <br />
                THE ROASTER.
              </h3>

              <p className="journey-copy">
                We source coffees for character, traceability, and seasonality — working with
                producers and import partners across Ethiopia, Colombia, and Brazil.
              </p>

              <div className="journey-details">
                <DetailRow label="Ethiopia" value="Floral / Citrus / Tea-like" />
                <DetailRow label="Colombia" value="Caramel / Stone Fruit / Cocoa" />
                <DetailRow label="Brazil" value="Chocolate / Nut / Brown Sugar" />
              </div>

              <span className="journey-micro">3 origins / seasonally rotated</span>
            </li>

            <li
              className="journey-chapter"
              data-stage="1"
              data-reveal="chapter"
              data-active={stage.active === 1 ? 'true' : 'false'}
              ref={(el) => {
                chapterRefs.current[1] = el;
              }}
            >
              <div className="journey-chapter-head">
                <span className="journey-number">02</span>
                <span className="journey-label">Roast</span>
              </div>

              <div className="journey-chapter-media">
                <img src={stages[1].img} alt={stages[1].alt} loading="lazy" />
              </div>

              <h3 className="journey-title">
                ROASTED TO
                <br />
                REVEAL,
                <br />
                NOT TO HIDE.
              </h3>

              <p className="journey-copy">
                Every coffee is roasted in small batches to develop sweetness, balance, and
                clarity without burying the character of the bean.
              </p>

              <p className="journey-note">Small-batch roasted</p>

              <div className="journey-details">
                <DetailRow label="Roast profile" value="Medium-light / balanced" />
                <DetailRow label="Roasted" value="Several times weekly" />
              </div>
            </li>

            <li
              className="journey-chapter"
              data-stage="2"
              data-reveal="chapter"
              data-active={stage.active === 2 ? 'true' : 'false'}
              ref={(el) => {
                chapterRefs.current[2] = el;
              }}
            >
              <div className="journey-chapter-head">
                <span className="journey-number">03</span>
                <span className="journey-label">Brew</span>
              </div>

              <div className="journey-chapter-media">
                <img src={stages[2].img} alt={stages[2].alt} loading="lazy" />
              </div>

              <h3 className="journey-title">
                THE LAST FEW
                <br />
                GRAMS MATTER.
              </h3>

              <p className="journey-copy">
                Recipes are dialed throughout the day, adjusting grind, dose, water, and
                extraction so each coffee reaches the cup the way it was intended.
              </p>

              <div className="journey-details">
                <DetailRow label="Espresso" value="Dialed throughout the day" />
                <DetailRow label="Filter" value="Brewed to order" />
                <DetailRow label="Milk" value="Textured for sweetness and clarity" />
              </div>

              <p className="journey-aside">Every cup is the end of a much longer process.</p>
            </li>
          </ol>
        </div>

        {/* Section payoff */}
        <div className="journey-finale" data-reveal="finale" ref={finaleRef}>
          <p className="journey-finale-line">
            THREE STAGES.
            <br />
            ONE CUP.
          </p>
          <span className="journey-finale-index">01 / 02 / 03</span>
        </div>
      </div>
    </section>
  );
}
