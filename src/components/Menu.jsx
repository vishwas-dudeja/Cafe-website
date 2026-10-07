import latteArt from '../assets/images/latte-art.png';
import coldBrew from '../assets/images/cold-brew.png';
import heroCoffee from '../assets/images/hero-coffee.png';
import pastries from '../assets/images/pastries.png';
import useScrollReveal from '../hooks/useScrollReveal';

const menuItems = [
  {
    img: latteArt,
    alt: 'Signature Vanilla Latte',
    title: 'Signature Vanilla Latte',
    price: '$5.50',
    desc: 'House espresso, steamed oat milk, Madagascar vanilla, finished with micro-foam art.',
  },
  {
    img: coldBrew,
    alt: 'Honey Cinnamon Cold Brew',
    title: 'Honey Cinnamon Cold Brew',
    price: '$6.00',
    desc: '18-hour steeped cold brew, raw honey, Ceylon cinnamon, oat cream float.',
  },
  {
    img: heroCoffee,
    alt: 'Ember Espresso',
    title: 'Ember Espresso',
    price: '$4.00',
    desc: 'Double-pulled from our house blend — notes of dark chocolate, toasted walnut, and caramel.',
  },
  {
    img: pastries,
    alt: 'Artisan Croissant Board',
    title: 'Artisan Croissant Board',
    price: '$12.00',
    desc: 'Butter croissant, pain au chocolat, almond roll — served warm with house preserves.',
  },
];

export default function Menu() {
  const headerRef = useScrollReveal('scroll-reveal');

  return (
    <section className="menu-section section-padding" id="menu">
      <div className="section-header scroll-reveal" ref={headerRef}>
        <div className="section-tag">The Menu</div>
        <h2 className="section-title">
          Our <em>Favorites</em>
        </h2>
        <p className="section-desc">
          Time-tested classics and seasonal inspirations, all made with love.
        </p>
      </div>

      <div className="menu-grid">
        {menuItems.map((item, idx) => (
          <MenuCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}

function MenuCard({ img, alt, title, price, desc }) {
  const ref = useScrollReveal('scroll-reveal');

  return (
    <div className="menu-card scroll-reveal" ref={ref}>
      <div className="menu-card-image">
        <img src={img} alt={alt} />
      </div>
      <div className="menu-card-content">
        <h3 className="menu-card-title">{title}</h3>
        <span className="menu-card-price">{price}</span>
        <p className="menu-card-desc">{desc}</p>
      </div>
    </div>
  );
}
