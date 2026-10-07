import latteArt from '../assets/images/latte-art.png';
import coldBrew from '../assets/images/cold-brew.png';
import pastries from '../assets/images/pastries.png';
import useScrollReveal from '../hooks/useScrollReveal';

const categories = [
  {
    img: latteArt,
    alt: 'Barista crafting beautiful latte art',
    tag: 'Signature',
    title: 'Crafted Lattes',
    desc: 'Silky, aromatic, and artfully poured every time.',
  },
  {
    img: coldBrew,
    alt: 'Iced cold brew coffee with milk swirl',
    tag: 'Refreshing',
    title: 'Cold Brew',
    desc: 'Smooth, rich, and steeped for 18 hours to perfection.',
  },
  {
    img: pastries,
    alt: 'Fresh artisan pastries and baked goods',
    tag: 'Fresh Daily',
    title: 'Pastries & Bakes',
    desc: 'Warm croissants, scones, and seasonal delights.',
  },
];

function CategoryCard({ img, alt, tag, title, desc }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div
      className="category-card scroll-reveal-scale"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={img} alt={alt} />
      <div className="category-card-overlay">
        <span className="category-tag">{tag}</span>
        <h3 className="category-title">{title}</h3>
        <p className="category-desc">{desc}</p>
        <a href="#menu" className="category-link">
          View Menu <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
}

export default function Categories() {
  const headerRef = useScrollReveal('scroll-reveal');
  const gridRef = useScrollReveal('stagger-children');

  return (
    <section className="categories-section section-padding" id="categories">
      <div className="section-header scroll-reveal" ref={headerRef}>
        <div className="section-tag">What We Offer</div>
        <h2 className="section-title">
          Explore Our <em>Collection</em>
        </h2>
        <p className="section-desc">
          From signature blends to seasonal specials, discover the flavors that define our craft.
        </p>
      </div>

      <div className="categories-grid stagger-children" ref={gridRef}>
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} {...cat} />
        ))}
      </div>
    </section>
  );
}
