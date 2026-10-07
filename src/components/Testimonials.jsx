import useScrollReveal from '../hooks/useScrollReveal';

const StarIcon = () => (
  <svg viewBox="0 0 20 20">
    <path d="M10 1l2.39 6.04H19l-5.3 4.06 1.97 6.31L10 13.27 4.33 17.4l1.97-6.31L1 7.04h6.61z" />
  </svg>
);

const Stars = () => (
  <div className="stars">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} />
    ))}
  </div>
);

const testimonials = [
  {
    text: 'This place has ruined every other cafe for me. The honey cinnamon cold brew is a religious experience. I\'ve brought every friend, date, and colleague here.',
    author: 'Sarah M.',
    role: 'Regular since 2020',
  },
  {
    text: "As a remote worker, I've tried every cafe in the city. Ember & Oak is the only one where I can actually focus AND enjoy a genuinely great cup of coffee. The vibes are unmatched.",
    author: 'James R.',
    role: 'Freelance Designer',
  },
  {
    text: "The weekend brunch is everything. Warm croissants, the most beautiful latte art I've ever seen, and the kindest baristas. This place feels like home.",
    author: 'Priya K.',
    role: 'Food Blogger',
  },
];

function TestimonialCard({ text, author, role }) {
  const ref = useScrollReveal('scroll-reveal');

  return (
    <div className="testimonial-card scroll-reveal" ref={ref}>
      <Stars />
      <div className="testimonial-quote">"</div>
      <p className="testimonial-text">{text}</p>
      <div className="testimonial-author">{author}</div>
      <div className="testimonial-role">{role}</div>
    </div>
  );
}

export default function Testimonials() {
  const headerRef = useScrollReveal('scroll-reveal');
  const containerRef = useScrollReveal('stagger-children');

  return (
    <section className="testimonials-section section-padding" id="testimonials">
      <div className="section-header scroll-reveal" ref={headerRef}>
        <div className="section-tag">Kind Words</div>
        <h2 className="section-title">
          What People <em>Say</em>
        </h2>
      </div>

      <div className="testimonials-container stagger-children" ref={containerRef}>
        {testimonials.map((t, idx) => (
          <TestimonialCard key={idx} {...t} />
        ))}
      </div>
    </section>
  );
}
