import { useEffect, useMemo, useRef, useState } from "react";

const TOTAL = 100; // 00..99
const pad2 = (n) => String(n).padStart(2, "0");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(!!mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

function Disclaimer({ open, onAccept }) {
  return (
    <div
      className={open ? "overlay isOpen" : "overlay"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discTitle"
    >
      <div className="modal">
        <div className="modalHeader">
          <div className="tag">VIEWER DISCRETION ADVISED</div>
          <h2 id="discTitle">This site contains crude humor, retro nonsense, and satire.</h2>
        </div>
        <div className="modalBody">
          <p>All characters and events depicted are entirely fictional. Even the ones that seem real.</p>
          <p className="muted">
            By continuing, you acknowledge this is satire and agree to proceed at your own risk.
          </p>
        </div>
        <div className="modalActions">
          <button className="btn primary" onClick={onAccept}>
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}

function Reader({ open, index, onClose, onPrev, onNext }) {
  const reduced = usePrefersReducedMotion();
  const startX = useRef(null);
  const startY = useRef(null);

  const src = `/img/comics/${pad2(index)}.jpg`;

  useEffect(() => {
    if (!open) return;
    const next = index < TOTAL - 1 ? new Image() : null;
    const prev = index > 0 ? new Image() : null;
    if (next) next.src = `/img/comics/${pad2(index + 1)}.jpg`;
    if (prev) prev.src = `/img/comics/${pad2(index - 1)}.jpg`;
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNext, onPrev]);

  const onTouchStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    startX.current = t.clientX;
    startY.current = t.clientY;
  };

  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onNext();
      else onPrev();
    }
    startX.current = null;
    startY.current = null;
  };

  return (
    <div className={open ? "overlay isOpen" : "overlay"} role="dialog" aria-modal="true" aria-label="Comic reader">
      <div className="reader">
        <div className="readerTop">
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <div className="readerMeta">
            <div className="readerTitle">ARCHIVE</div>
            <div className="readerSub">
              {pad2(index)} / {pad2(TOTAL - 1)}
            </div>
          </div>
          <div className="readerNav">
            <button className="btn" onClick={onPrev} disabled={index === 0}>
              Prev
            </button>
            <button className="btn primary" onClick={onNext} disabled={index === TOTAL - 1}>
              Next
            </button>
          </div>
        </div>

        <div className={reduced ? "readerBody" : "readerBody animate"} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <img className="comic" src={src} alt={`Comic ${pad2(index)}`} loading="eager" />
        </div>

        <div className="readerBottom">
          <button className="btn" onClick={onPrev} disabled={index === 0}>
            ◀
          </button>
          <button className="btn" onClick={onNext} disabled={index === TOTAL - 1}>
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const KEY = "eoguides_disclaimer_accepted_v1";
  const [discOpen, setDiscOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [page, setPage] = useState(0);

  const pages = useMemo(() => Array.from({ length: TOTAL }, (_, i) => i), []);

  useEffect(() => {
    const accepted = localStorage.getItem(KEY) === "true";
    if (!accepted) setDiscOpen(true);
  }, []);

  useEffect(() => {
    const locked = discOpen || readerOpen;
    document.documentElement.style.overflow = locked ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [discOpen, readerOpen]);

  const accept = () => {
    localStorage.setItem(KEY, "true");
    setDiscOpen(false);
  };

  const openReader = (i) => {
    setPage(i);
    setReaderOpen(true);
  };

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(TOTAL - 1, p + 1));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark">EO</div>
          <div className="brandText">
            <div className="brandName">eoguides</div>
            <div className="brandSub">archive</div>
          </div>
        </div>

        <div className="topActions">
          <button className="btn" onClick={() => setDiscOpen(true)}>
            Disclaimer
          </button>
          <button className="btn primary" onClick={() => openReader(0)}>
            Start
          </button>
          <button className="btn" onClick={() => openReader(TOTAL - 1)}>
            Latest
          </button>
        </div>
      </header>

      <main className="container">
        <div className="hero">
          <h1>Archive</h1>
          <p>Flip through 00 → 99 like a comic. Swipe on mobile, arrows on desktop.</p>
        </div>

        <div className="grid" aria-label="Archive grid">
          {pages.map((i) => (
            <button key={i} className="thumb" onClick={() => openReader(i)} aria-label={`Open comic ${pad2(i)}`}>
              <img src={`/img/comics/${pad2(i)}.jpg`} alt={`Comic ${pad2(i)}`} loading="lazy" />
              <div className="thumbLabel">{pad2(i)}</div>
            </button>
          ))}
        </div>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} eoguides</span>
        <span className="dot">•</span>
        <button className="linkBtn" onClick={() => setDiscOpen(true)}>
          Disclaimer
        </button>
      </footer>

      <Disclaimer open={discOpen} onAccept={accept} />
      <Reader open={readerOpen} index={page} onClose={() => setReaderOpen(false)} onPrev={prev} onNext={next} />
    </div>
  );
}
