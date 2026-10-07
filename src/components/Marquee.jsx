export default function Marquee() {
  const items = [
    'Single Origin',
    'Artisan Roasted',
    'Fresh Pastries',
    'Cold Brew',
    'Pour Over',
    'Espresso Bar',
    'Organic Beans',
    'Latte Art',
  ];

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {allItems.map((item, idx) => (
          <span className="marquee-item" key={idx}>{item}</span>
        ))}
      </div>
    </div>
  );
}
