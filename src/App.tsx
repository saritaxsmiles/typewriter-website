import { useState, useEffect, useRef, useCallback } from 'react';
import { InteractiveKeyboard } from './components/InteractiveKeyboard';

const TYPEWRITER_IMG = '/assets/figma/typewriter.png';

function getDataKey(key: string): string {
  if (key.length === 1) return key.toLowerCase();
  if (key === ' ') return ' ';
  if (key === 'Shift') return 'Shift';
  if (key === 'Backspace') return 'Backspace';
  if (key === 'Enter') return 'Enter';
  if (key === 'Tab') return 'Tab';
  if (key === 'CapsLock') return 'CapsLock';
  return key;
}

function isPrintableKey(key: string): boolean {
  return key.length === 1 && (key >= ' ' || key === '\n' || key === '\t');
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/** If there's a non-collapsed selection in the paper pre, return [start, end] in buffer coordinates; else null. */
function getPaperSelectionRange(preEl: HTMLPreElement | null, bufferLength: number): [number, number] | null {
  if (!preEl) return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  if (!preEl.contains(range.startContainer) || !preEl.contains(range.endContainer)) return null;
  const textNode = preEl.firstChild;
  const getOffset = (node: Node, offset: number): number => {
    if (node === textNode && textNode?.nodeType === Node.TEXT_NODE) return Math.min(offset, bufferLength);
    if (node === preEl) return offset === 0 ? 0 : bufferLength;
    return bufferLength;
  };
  const start = getOffset(range.startContainer, range.startOffset);
  const end = getOffset(range.endContainer, range.endOffset);
  if (start === end) return null;
  return [Math.min(start, end), Math.max(start, end)];
}

export default function App() {
  const [buffer, setBuffer] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const wrapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLPreElement>(null);
  const bufferLengthRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  bufferLengthRef.current = buffer.length;
  const strikeAudioRef = useRef<HTMLAudioElement | null>(null);

  const playTypewriterSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.02);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      /* ignore */
    }
  }, []);

  const playStrikeSound = useCallback(() => {
    if (strikeAudioRef.current) {
      strikeAudioRef.current.currentTime = 0;
      strikeAudioRef.current.play().catch(() => {});
    } else {
      playTypewriterSound();
    }
  }, [playTypewriterSound]);

  useEffect(() => {
    const wav = new Audio('/assets/typewriter-strike.wav');
    wav.addEventListener('canplaythrough', () => {
      strikeAudioRef.current = wav;
    });
    wav.addEventListener('error', () => {});
  }, []);

  useEffect(() => {
    const clearPaperSelectionAndResetCursor = () => {
      window.getSelection()?.removeAllRanges();
      wrapRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const dataKey = getDataKey(e.key);
      setPressedKeys((prev) => new Set(prev).add(dataKey === 'Shift' ? e.key : dataKey));

      if ((e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return;

      const key = e.key;

      if (key === 'Backspace') {
        e.preventDefault();
        const range = getPaperSelectionRange(paperRef.current, bufferLengthRef.current);
        if (range) {
          const [start, end] = range;
          setBuffer((b) => b.slice(0, start) + b.slice(end));
          clearPaperSelectionAndResetCursor();
        } else {
          setBuffer((b) => b.slice(0, -1));
        }
        playStrikeSound();
        return;
      }
      if (key === 'Delete') {
        e.preventDefault();
        const range = getPaperSelectionRange(paperRef.current, bufferLengthRef.current);
        if (range) {
          const [start, end] = range;
          setBuffer((b) => b.slice(0, start) + b.slice(end));
          clearPaperSelectionAndResetCursor();
        } else {
          setBuffer((b) => b.slice(0, -1));
        }
        playStrikeSound();
        return;
      }
      if (key === 'Enter') {
        e.preventDefault();
        setBuffer((b) => b + '\n');
        playStrikeSound();
        return;
      }
      if (key === 'Tab') {
        e.preventDefault();
        setBuffer((b) => b + '    ');
        playStrikeSound();
        return;
      }
      if (key === ' ') {
        e.preventDefault();
        setBuffer((b) => b + ' ');
        playStrikeSound();
        return;
      }
      if (isPrintableKey(key)) {
        e.preventDefault();
        setBuffer((b) => b + key);
        playStrikeSound();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const dataKey = getDataKey(e.key);
      const keyToRemove = dataKey === 'Shift' ? e.key : dataKey;
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyToRemove);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playStrikeSound]);

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 pb-12 bg-white
        md:h-[100dvh] md:max-h-[100dvh] md:w-[100dvw] md:max-w-[100dvw] md:overflow-hidden md:p-0"
    >
      <div className="flex-1 flex items-center justify-center min-h-0 w-full">
        <div
          ref={wrapRef}
          className="relative max-w-[848px] w-full focus:outline-none overflow-visible
            md:max-h-full md:max-w-full md:h-full"
          tabIndex={0}
          role="application"
          aria-label="Typewriter"
          onClick={() => wrapRef.current?.focus()}
        >
          <img
            src={TYPEWRITER_IMG}
            alt="Typewriter"
            className="block w-full h-auto align-middle md:max-h-full md:max-w-full md:object-contain md:w-auto md:mx-auto"
          />

        {/* Paper overlay – anchored to metal bar at bottom, grows upward as text fills */}
        <div
          className="absolute left-[392px] w-[376px] bottom-[calc(100%-325px)] min-h-[51px] overflow-visible p-2 pt-2 pb-3 rounded-b shadow-sm border border-[#e2ddcb] bg-[#dcd3c3] flex flex-col justify-end"
          aria-label="Paper"
        >
          <pre
            ref={paperRef}
            className="m-0 font-[Special_Elite,'Courier_New',Courier,monospace] text-xs leading-normal text-[#1a1a1a] whitespace-pre-wrap break-words min-h-0"
          >
            {escapeHtml(buffer)}
            <span className="caret" style={{ animation: 'blink 1s step-end infinite' }}>|</span>
          </pre>
        </div>

        {/* Keyboard overlay – Figma Make layout */}
        <div
          className="absolute left-[26.77%] right-[24.88%] bottom-[8%] h-[21.15%] flex items-center justify-center overflow-visible"
          aria-label="Keyboard"
        >
          <InteractiveKeyboard pressedKeys={pressedKeys} />
        </div>
        </div>
      </div>

      <p className="mt-4 font-sans text-sm text-[#666] md:mt-0 md:flex-shrink-0 md:py-2 md:text-xs">
        Click the typewriter, then type. Keys light up and text appears on the paper.
      </p>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
