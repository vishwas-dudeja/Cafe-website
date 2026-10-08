import { useEffect, useRef, useState } from 'react';
import latteArt from '../assets/images/latte-art.png';
import coldBrew from '../assets/images/cold-brew.png';
import cafeInterior from '../assets/images/cafe-interior.png';
import pastries from '../assets/images/pastries.png';

const menuCategories = [
  {
    id: 'coffee',
    label: 'Coffee',
    index: '01',
    note: 'Espresso bar · filter · single origin',
    image: latteArt,
    imageAlt: 'Latte with hand-poured rosetta art at Ember & Oak',
    visual: {
      eyebrow: 'Current pour',
      title: 'Ethiopia — Guji',
      notes: 'Jasmine · Bergamot · Peach',
    },
    items: [
      {
        name: 'Ember Espresso',
        price: '$4',
        description: 'Chocolate / walnut / caramel',
        label: 'House favorite',
      },
      {
        name: 'House Americano',
        price: '$4.5',
        description: 'Double espresso / filtered water',
      },
      { name: 'Cortado', price: '$5', description: 'Espresso / silky milk / balanced' },
      { name: 'Flat White', price: '$5.5', description: 'Double ristretto / microfoam' },
      { name: 'House Latte', price: '$6', description: 'Espresso / steamed milk' },
      {
        name: 'Maple Sea Salt Latte',
        price: '$6.5',
        description: 'Maple / espresso / sea salt / milk',
        label: 'Popular',
      },
      { name: 'Pour Over', price: '$7', description: 'Rotating single-origin coffee' },
    ],
  },
  {
    id: 'cold',
    label: 'Cold',
    index: '02',
    note: 'Steeped, shaken, and served over ice',
    image: coldBrew,
    imageAlt: 'Glass of cold brew over ice',
    visual: { eyebrow: 'Steeped 18 hours', title: 'House cold brew', notes: 'Chocolate · Molasses' },
    items: [
      { name: 'Classic Cold Brew', price: '$5.5', description: '18-hour steep / chocolate / molasses', label: 'House favorite' },
      { name: 'Nitro Cold Brew', price: '$6', description: 'Velvety / naturally sweet' },
      { name: 'Iced Latte', price: '$6', description: 'Espresso / milk / ice' },
      { name: 'Orange Espresso Tonic', price: '$6.5', description: 'Espresso / tonic / fresh orange' },
      { name: 'Vanilla Cream Cold Brew', price: '$6.5', description: 'Cold brew / vanilla cream' },
      { name: 'Iced Matcha', price: '$6.5', description: 'Ceremonial matcha / milk' },
    ],
  },
  {
    id: 'tea',
    label: 'Tea',
    index: '03',
    note: 'Loose leaf, matcha, and chai',
    image: cafeInterior,
    imageAlt: 'Warm morning light inside the café — the tea bar',
    visual: { eyebrow: 'Brewed to order', title: 'The tea list', notes: 'Loose leaf · Matcha · Chai' },
    items: [
      { name: 'Ceremonial Matcha', price: '$6', description: 'Stone-ground matcha / hot water' },
      { name: 'Matcha Latte', price: '$6.5', description: 'Matcha / steamed milk', label: 'Popular' },
      { name: 'Masala Chai', price: '$5.5', description: 'Black tea / spices / milk' },
      { name: 'Earl Grey', price: '$4.5', description: 'Bergamot / black tea' },
      { name: 'Jasmine Green', price: '$4.5', description: 'Floral / delicate' },
      { name: 'Hibiscus Iced Tea', price: '$5', description: 'Hibiscus / citrus / lightly sweetened' },
    ],
  },
  {
    id: 'pastries',
    label: 'Pastries',
    index: '04',
    note: 'Baked in-house each morning',
    image: pastries,
    imageAlt: 'Fresh pastries on a wooden board at Ember & Oak',
    visual: { eyebrow: 'Baked daily', title: 'From the oven', notes: 'Morning & midday' },
    items: [
      { name: 'Butter Croissant', price: '$4.5', description: 'Flaky / cultured butter', label: 'House favorite' },
      { name: 'Almond Croissant', price: '$5.5', description: 'Almond cream / toasted almonds' },
      { name: 'Cardamom Bun', price: '$5', description: 'Cardamom sugar / soft brioche' },
      { name: 'Pain au Chocolat', price: '$5', description: 'Dark chocolate / laminated pastry' },
      { name: 'Lemon Olive Oil Cake', price: '$6', description: 'Lemon / olive oil / sea salt' },
      { name: 'Seasonal Fruit Tart', price: '$7', description: 'Pastry cream / seasonal fruit', label: 'Seasonal' },
    ],
  },
  {
    id: 'brunch',
    label: 'Brunch',
    index: '05',
    note: 'Weekend plates, served 9—3',
    image: null,
    visual: { eyebrow: 'Weekends / 9 — 3', title: 'Weekend brunch', notes: 'Seasonal plates · served until sold out' },
    items: [
      { name: 'Avocado Sourdough', price: '$12', description: 'Avocado / chili / lemon / herbs', label: 'Popular' },
      { name: 'Egg & Cheddar Brioche', price: '$11', description: 'Soft egg / cheddar / brioche' },
      { name: 'Ricotta Toast', price: '$13', description: 'Whipped ricotta / honey / seasonal fruit', label: 'Vegetarian' },
      { name: 'Mushroom Toast', price: '$14', description: 'Roasted mushroom / herbs / sourdough' },
      { name: 'House Granola', price: '$10', description: 'Yogurt / granola / fruit / honey', label: 'Vegetarian' },
      { name: 'Breakfast Plate', price: '$16', description: 'Eggs / sourdough / greens / potatoes' },
    ],
  },
];

export default function Menu() {
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);
  const timerRef = useRef(null);

  const [activeId, setActiveId] = useState('coffee');
  const [listId, setListId] = useState('coffee');
  const [isFading, setIsFading] = useState(false);

  const listCategory = menuCategories.find((c) => c.id === listId) || menuCategories[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    if (typeof IntersectionObserver !== 'function') {
      section.classList.add('menu-revealed');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('menu-revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  function selectCategory(id) {
    if (id === activeId) return;
    setActiveId(id);
    setIsFading(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setListId(id);
      setIsFading(false);
    }, 170);
  }

  function handleTabKeyDown(e, idx) {
    const len = menuCategories.length;
    let next = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % len;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + len) % len;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = len - 1;
    if (next === null) return;
    e.preventDefault();
    const id = menuCategories[next].id;
    selectCategory(id);
    tabRefs.current[next]?.focus();
    tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  function handleExperienceScroll(e) {
    e.preventDefault();
    const target = document.querySelector('#experience');
    if (!target) return;
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '80',
      10
    );
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <section className="menu-editorial" id="menu" ref={sectionRef}>
      <div className="menu-inner">
        <header className="menu-header">
          <div className="menu-header-left">
            <span className="menu-eyebrow">The menu / Seasonal selection</span>
            <h2 className="menu-title">
              <span className="menu-title-line">
                <span>WHAT WE&rsquo;RE</span>
              </span>
              <span className="menu-title-line">
                <span>POURING.</span>
              </span>
            </h2>
          </div>
          <div className="menu-header-right">
            <p className="menu-intro">
              Built around seasonal coffees, thoughtful recipes, and a few things worth staying for.
            </p>
            <span className="menu-season">Current menu</span>
          </div>
        </header>

        <div
          className="menu-nav"
          role="tablist"
          aria-label="Menu categories"
          aria-orientation="horizontal"
        >
          {menuCategories.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              id={`menu-tab-${cat.id}`}
              aria-controls="menu-panel"
              aria-selected={cat.id === activeId}
              tabIndex={cat.id === activeId ? 0 : -1}
              className={`menu-nav-item${cat.id === activeId ? ' is-active' : ''}`}
              onClick={() => selectCategory(cat.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
            >
              <span className="menu-nav-label">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="menu-content">
          <div
            className="menu-panel"
            role="tabpanel"
            id="menu-panel"
            aria-labelledby={`menu-tab-${listId}`}
            tabIndex={0}
          >
            <div className={`menu-panel-inner${isFading ? ' is-fading' : ''}`}>
              <div className="menu-panel-meta">
                <span className="menu-panel-index">{listCategory.index} / {listCategory.label}</span>
                <span className="menu-panel-note">{listCategory.note}</span>
              </div>

              <ul className="menu-list">
                {listCategory.items.map((item) => (
                  <li className="menu-item" key={item.name}>
                    <div className="menu-item-main">
                      <h3 className="menu-item-title">{item.name}</h3>
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                    {item.label && <span className="menu-item-label">{item.label}</span>}
                    <p className="menu-item-description">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="menu-visual">
            <div className="menu-visual-frame">
              {menuCategories.map((cat) => {
                const isActive = cat.id === activeId;
                return (
                  <figure
                    key={cat.id}
                    className={`menu-visual-panel${isActive ? ' is-active' : ''}`}
                    aria-hidden={!isActive}
                  >
                    {cat.image ? (
                      <img
                        className="menu-visual-image"
                        src={cat.image}
                        alt={isActive ? cat.imageAlt : ''}
                        loading="lazy"
                      />
                    ) : (
                      <div className="menu-visual-typo" aria-hidden="true">
                        <span className="menu-visual-typo-word">{cat.label}</span>
                        <span className="menu-visual-typo-rule" />
                        <span className="menu-visual-typo-sub">{cat.visual.notes}</span>
                      </div>
                    )}
                    <figcaption className="menu-visual-meta">
                      <span className="menu-visual-eyebrow">{cat.visual.eyebrow}</span>
                      <span className="menu-visual-title">{cat.visual.title}</span>
                      <span className="menu-visual-notes">{cat.visual.notes}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>

        <div className="menu-practical">
          <span>Oat / almond +$0.75</span>
          <span>Extra shot +$1.50</span>
          <span>Decaf available</span>
          <span>Syrups +$0.75</span>
        </div>

        <div className="menu-footer">
          <div className="menu-footer-text">
            <span className="menu-footer-label">Dietary needs?</span>
            <p className="menu-footer-copy">
              Ask our team — we&rsquo;ll help you find the right option.
            </p>
          </div>
          <a href="#experience" className="menu-footer-cta" onClick={handleExperienceScroll}>
            See the experience <span aria-hidden="true"> ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
