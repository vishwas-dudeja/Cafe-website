import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAME_PREFIX = '/hero-frames/frame-';
const HERO_SCROLL_DISTANCE = 5500;

const pad4 = (n) => String(n).padStart(4, '0');
const frameUrl = (i) => `${FRAME_PREFIX}${pad4(i + 1)}.webp`;

function drawFrame(canvas, img) {
  if (!canvas || !img) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;

  if (!iw || !ih) return;

  const canvasAspect = cw / ch;
  const imageAspect = iw / ih;

  let sx, sy, sw, sh;

  if (imageAspect > canvasAspect) {
    // Image is wider than canvas -> crop sides
    sh = ih;
    sw = ih * canvasAspect;
    // On narrow screens (mobile portrait), the coffee cup shifts to the right in the 2nd half.
    // Setting cropBias to ~0.65 keeps the cup centered / visible in both halves of the animation
    const cropBias = canvasAspect < 1 ? 0.65 : 0.5;
    sx = (iw - sw) * cropBias;
    sy = 0;
  } else {
    // Image is taller -> crop top/bottom
    sw = iw;
    sh = iw / canvasAspect;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const framesRef = useRef(new Array(FRAME_COUNT).fill(null));
  const currentIdxRef = useRef(0);
  const [_loadPct, setLoadPct] = useState(0);

  // Magnetic hover effect for buttons
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '80',
        10
      );
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  // Helper to safely get the best available frame
  const getFrame = (idx) => {
    if (framesRef.current[idx]) return framesRef.current[idx];
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (idx - d >= 0 && framesRef.current[idx - d]) return framesRef.current[idx - d];
      if (idx + d < FRAME_COUNT && framesRef.current[idx + d]) return framesRef.current[idx + d];
    }
    return framesRef.current[0] || null;
  };

  // 1. Sync canvas size with device pixel ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;

      const frame = getFrame(currentIdxRef.current);
      if (frame) drawFrame(canvas, frame);
    };

    syncSize();
    window.addEventListener('resize', syncSize);
    return () => window.removeEventListener('resize', syncSize);
  }, []);

  // 2. Preload frames (Priority: Frame 0 immediately, then batches)
  useEffect(() => {
    let cancelled = false;

    // Load frame 0 immediately
    const firstImg = new Image();
    firstImg.onload = () => {
      if (cancelled) return;
      framesRef.current[0] = firstImg;
      if (canvasRef.current) {
        drawFrame(canvasRef.current, firstImg);
      }
    };
    firstImg.src = frameUrl(0);

    // Preload remaining frames in batches
    const BATCH = 12;
    async function loadAllFrames() {
      let loadedCount = 1;
      for (let start = 0; start < FRAME_COUNT; start += BATCH) {
        if (cancelled) break;
        const end = Math.min(start + BATCH, FRAME_COUNT);
        const batch = [];

        for (let i = start; i < end; i++) {
          if (i === 0 && framesRef.current[0]) continue;
          batch.push(
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                framesRef.current[i] = img;
                loadedCount++;
                resolve();
              };
              img.onerror = () => {
                loadedCount++;
                resolve();
              };
              img.src = frameUrl(i);
            })
          );
        }

        await Promise.all(batch);
        if (!cancelled) {
          setLoadPct(Math.round((loadedCount / FRAME_COUNT) * 100));
        }
      }
    }

    loadAllFrames();

    return () => {
      cancelled = true;
    };
  }, []);

  // 3. GSAP ScrollTrigger
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    const indicator = scrollIndicatorRef.current;
    if (!section || !canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (content) {
        content.style.opacity = '1';
        content.style.transform = 'none';
        content.style.pointerEvents = 'auto';
      }
      if (indicator) {
        indicator.style.display = 'none';
      }
      return;
    }

    const proxy = { frame: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${HERO_SCROLL_DISTANCE}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      // Frame progression 0 -> 239
      tl.to(
        proxy,
        {
          frame: FRAME_COUNT - 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            const idx = Math.round(proxy.frame);
            if (idx === currentIdxRef.current) return;
            currentIdxRef.current = idx;

            const frame = getFrame(idx);
            if (frame && canvasRef.current) {
              drawFrame(canvasRef.current, frame);
            }
          },
        },
        0
      );

      // Scroll indicator fade out (0 -> 0.12)
      if (indicator) {
        tl.fromTo(
          indicator,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -10, ease: 'power1.out', duration: 0.12 },
          0
        );
      }

      // Content reveal (0.70 -> 0.84)
      if (content) {
        tl.fromTo(
          content,
          { opacity: 0, y: 30, pointerEvents: 'none' },
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: 0.14,
          },
          0.70
        );
      }
    }, section);

    return () => {
      ctx.revert();
      gsap.killTweensOf(proxy);
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="hero-scroll-section">
      <canvas ref={canvasRef} className="hero-frame-canvas" />

      <div className="hero-content" ref={contentRef}>
        <div className="hero-badge">Est. 2018 · Artisan Roasters</div>
        <h1 className="hero-title">
          Where Every Cup <br />Tells a <em>Story</em>
        </h1>
        <p className="hero-subtitle">
          Hand-roasted beans, crafted drinks, and a space designed for connection.{' '}
          Welcome to your new favorite coffeehouse.
        </p>
        <div className="hero-actions">
          <a
            href="#menu"
            className="btn-primary"
            onClick={(e) => handleSmoothScroll(e, '#menu')}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Explore Our Menu →
          </a>
          <a
            href="#story"
            className="btn-secondary"
            onClick={(e) => handleSmoothScroll(e, '#story')}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Our Story
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator" ref={scrollIndicatorRef}>
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
