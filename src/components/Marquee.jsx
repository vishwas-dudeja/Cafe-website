export default function Marquee() {
  const items = [
    'Small Batch Roasted',
    'Brooklyn Born',
    'Ethically Sourced',
    'Brewed with Intention',
    'Est. 2018',
    'Single Origin Beans',
    'Craft Roasting',
    'Pour Over & Espresso',
  ];

  // Duplicate for seamless infinite loop
  const allItems = [...items, ...items];

  return (
    <div className="marquee-section" aria-label="Brand Highlights">
      <div className="marquee-track">
        {allItems.map((item, idx) => (
          <span className="marquee-item" key={idx}>
            <span>{item}</span>
            <span className="marquee-separator" aria-hidden="true">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
