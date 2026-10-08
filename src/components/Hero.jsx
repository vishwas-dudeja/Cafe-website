import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMagnetic from '../hooks/useMagnetic';
import useRipple from '../hooks/useRipple';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const MOBILE_QUERY = '(max-width: 767px)';

const HERO_CONFIG = {
  desktop: {
    frameBase: '/hero-frames/frame-',
    frameCount: 240,
    scrollDistance: 5500,
    dprCap: 2,
    revealStart: 0.7,
    revealDuration: 0.14,
    revealY: 30,
    indicatorDuration: 0.12,
    representativeFrame: 0,
    childStagger: 0,
    crop: { x: 0.5, portraitX: 0.65, y: 0.5 },
  },
  mobile: {
    frameBase: '/hero-frames-mobile/frame-',
    frameCount: 240,
    scrollDistance: 3400,
    dprCap: 1.5,
    revealStart: 0.62,
    revealDuration: 0.16,
    revealY: 18,
    indicatorDuration: 0.15,
    representativeFrame: 239,
    childStagger: 0.02,
    crop: { x: 0.5, portraitX: 0.5, y: 0.7 },
  },
};

const getInitialMode = () =>
  typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop';

const pad4 = (n) => String(n).padStart(4, '0');
const frameUrl = (base, i) => `${base}${pad4(i + 1)}.webp`;

function drawFrame(canvas, img, crop) {
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
    // Desktop frames: cup shifts right in the 2nd half, so bias the crop right on
    // narrow (portrait) canvases. Mobile frames are authored 9:16 -> centered.
    const horizontalBias = canvasAspect < 1 ? crop.portraitX : crop.x;
    sx = (iw - sw) * horizontalBias;
    sy = 0;
  } else {
    // Image is taller -> crop top/bottom
    sw = iw;
    sh = iw / canvasAspect;
    sx = 0;
    sy = (ih - sh) * crop.y;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const framesRef = useRef([]);
  const currentIdxRef = useRef(0);
  const [_loadPct, setLoadPct] = useState(0);
  const [mode, setMode] = useState(getInitialMode);

  // Subtle magnetic pull for the primary CTAs
  const {
    ref: menuBtnRef,
    onMouseMove: menuBtnMove,
    onMouseLeave: menuBtnLeave,
  } = useMagnetic(0.12);
  const {
    ref: storyBtnRef,
    onMouseMove: storyBtnMove,
    onMouseLeave: storyBtnLeave,
  } = useMagnetic(0.12);
  const menuRipple = useRipple();

  const exploreMenu = (e) => {
    menuRipple.perform(e);
    handleSmoothScroll(e, '#menu');
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
    };
  };

  // Helper to safely get the best available frame
  const getFrame = (idx, count) => {
    const frames = framesRef.current;
    if (frames[idx]) return frames[idx];
    for (let d = 1; d < count; d++) {
      if (idx - d >= 0 && frames[idx - d]) return frames[idx - d];
      if (idx + d < count && frames[idx + d]) return frames[idx + d];
    }
    return frames[0] || null;
  };

  // 0. Breakpoint: switch the frame source without touching the rest of the site
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setMode(e.matches ? 'mobile' : 'desktop');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 1. Sync canvas size with device pixel ratio
  useEffect(() => {
    const cfg = HERO_CONFIG[mode];
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = 0;
    const syncSize = (force) => {
      const dpr = Math.min(window.devicePixelRatio || 1, cfg.dprCap);
      const w = Math.trunc(canvas.offsetWidth * dpr);
      const h = Math.trunc(canvas.offsetHeight * dpr);
      const resized = canvas.width !== w || canvas.height !== h;
      if (!resized && !force) return;
      if (resized) {
        canvas.width = w;
        canvas.height = h;
      }
      const frame = getFrame(currentIdxRef.current, cfg.frameCount);
      if (frame) drawFrame(canvas, frame, cfg.crop);
    };

    syncSize(true);
    const onResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        syncSize(false);
      });
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [mode]);

  // 2. Preload frames (Priority: first/representative frame immediately, then batches)
  useEffect(() => {
    const cfg = HERO_CONFIG[mode];
    let cancelled = false;

    // Fresh array per source so a stale load can never land in the new set
    const target = new Array(cfg.frameCount).fill(null);
    framesRef.current = target;
    currentIdxRef.current = -1;

    // Drop the previous source's bitmap; CSS keeps the #888078 fallback visible
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const loadInto = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) target[i] = img;
          resolve(img);
        };
        img.onerror = () => resolve(null);
        img.src = frameUrl(cfg.frameBase, i);
      });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Reduced motion: one stable representative frame, no scrubbing
      loadInto(cfg.representativeFrame).then((img) => {
        if (cancelled || !img) return;
        currentIdxRef.current = cfg.representativeFrame;
        if (canvasRef.current) drawFrame(canvasRef.current, img, cfg.crop);
        setLoadPct(100);
      });
      return () => {
        cancelled = true;
      };
    }

    // First frame immediately
    loadInto(0).then((img) => {
      if (cancelled) return;
      if (img) {
        currentIdxRef.current = 0;
        if (canvasRef.current) drawFrame(canvasRef.current, img, cfg.crop);
        setLoadPct(Math.round((1 / cfg.frameCount) * 100));
      }

      // Remaining frames in batches of 12
      const BATCH = 12;
      let loadedCount = img ? 1 : 0;
      (async () => {
        for (let start = 1; start < cfg.frameCount; start += BATCH) {
          if (cancelled) break;
          const end = Math.min(start + BATCH, cfg.frameCount);
          const results = await Promise.all(
            Array.from({ length: end - start }, (_, k) => loadInto(start + k))
          );
          loadedCount += results.filter(Boolean).length;
          if (!cancelled) {
            setLoadPct(Math.round((loadedCount / cfg.frameCount) * 100));
          }
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  // 3. GSAP ScrollTrigger
  useEffect(() => {
    const cfg = HERO_CONFIG[mode];
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
          end: `+=${cfg.scrollDistance}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      // Frame progression 0 -> frameCount - 1
      tl.to(
        proxy,
        {
          frame: cfg.frameCount - 1,
          ease: 'none',
          duration: 1,
          onUpdate: () => {
            const idx = Math.round(proxy.frame);
            if (idx === currentIdxRef.current) return;
            currentIdxRef.current = idx;

            const frame = getFrame(idx, cfg.frameCount);
            if (frame && canvasRef.current) {
              drawFrame(canvasRef.current, frame, cfg.crop);
            }
          },
        },
        0
      );

      // Scroll indicator fade out
      if (indicator) {
        tl.fromTo(
          indicator,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -10, ease: 'power1.out', duration: cfg.indicatorDuration },
          0
        );
      }

      // Content reveal
      if (content) {
        tl.fromTo(
          content,
          { opacity: 0, y: cfg.revealY, pointerEvents: 'none' },
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: cfg.revealDuration,
          },
          cfg.revealStart
        );

        // Mobile only: very subtle stagger between eyebrow, heading, body, CTA
        if (cfg.childStagger > 0) {
          const children = content.querySelectorAll(
            '.hero-badge, .hero-title, .hero-subtitle, .hero-actions'
          );
          if (children.length) {
            tl.fromTo(
              children,
              { y: 26 },
              {
                y: 0,
                ease: 'power2.out',
                duration: cfg.revealDuration + 0.04,
                stagger: cfg.childStagger,
              },
              cfg.revealStart
            );
          }
        }
      }
    }, section);

    return () => {
      ctx.revert();
      gsap.killTweensOf(proxy);
    };
  }, [mode]);

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
            className="btn-primary has-ripple"
            onClick={exploreMenu}
            ref={menuBtnRef}
            onMouseMove={menuBtnMove}
            onMouseLeave={menuBtnLeave}
          >
            <span>Explore Our Menu →</span>
          </a>
          <a
            href="#story"
            className="btn-secondary btn-sweep"
            onClick={(e) => handleSmoothScroll(e, '#story')}
            ref={storyBtnRef}
            onMouseMove={storyBtnMove}
            onMouseLeave={storyBtnLeave}
          >
            <span>Our Story</span>
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
