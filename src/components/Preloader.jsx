import { useEffect, useRef, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader${hidden ? ' hidden' : ''}`} id="preloader">
      <div className="preloader-logo">EMBER &amp; OAK</div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill"></div>
      </div>
    </div>
  );
}
