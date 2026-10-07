export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#" className="nav-logo">
            EMBER &amp; OAK
            <span>Coffee Workshop</span>
          </a>
          <p>
            Where every cup tells a story. Hand-roasted beans, crafted drinks, and a space
            designed for connection since 2018.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter / X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l6.5 8L4 20h2l5.5-6.5L16 20h4l-7-8.5L20 4h-2l-5 6-4-6H4z"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Visit</h4>
          <ul>
            <li><a href="#">Locations</a></li>
            <li><a href="#">Hours &amp; Directions</a></li>
            <li><a href="#">Private Events</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Menu</h4>
          <ul>
            <li><a href="#">Espresso Drinks</a></li>
            <li><a href="#">Cold Brew</a></li>
            <li><a href="#">Pastries</a></li>
            <li><a href="#">Seasonal Specials</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Newsletter</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Ember &amp; Oak Coffee Workshop. All rights reserved. Roasted with love.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
