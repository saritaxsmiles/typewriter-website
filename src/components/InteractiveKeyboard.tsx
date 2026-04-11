import { useRef, useState, useLayoutEffect } from 'react';
import Keyboard from '../imports/Keyboard';

const KEY_MAP: Record<string, string[]> = {
  '1': ['10'], '2': ['11'], '3': ['12'], '4': ['13'], '5': ['14'],
  '6': ['15'], '7': ['16'], '8': ['17'], '9': ['18'], '0': ['19'],
  'tab': ['tab'],
  'q': ['q'], 'w': ['w'], 'e': ['e'], 'r': ['r'], 't': ['t'],
  'y': ['y'], 'u': ['u'], 'i': ['i'], 'o': ['o'], 'p': ['p'],
  'a': ['a'], 's': ['s'], 'd': ['d'], 'f': ['f'], 'g': ['g'],
  'h': ['h'], 'j': ['j'], 'k': ['k'], 'l': ['l'],
  'z': ['z'], 'x': ['x'], 'c': ['c'], 'v': ['v'], 'b': ['b'],
  'n': ['n'], 'm': ['m'], ' ': ['space'],
};

function getDataNamesForKey(key: string): string[] {
  return KEY_MAP[key.toLowerCase()] ?? [];
}

type Props = { pressedKeys: Set<string> };

const KEYBOARD_WIDTH = 1120;
const KEYBOARD_HEIGHT = 570;
const KEYBOARD_SIZE_MULTIPLIER = 2;
const KEYBOARD_SCALE_REDUCE = 0.85; /* 15% smaller overall */
const KEYBOARD_SCALE_DOWN_1PCT = 0.99; /* scale entire keyboard down by 1% */

export function InteractiveKeyboard({ pressedKeys }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const fitScale = Math.min(1, w / KEYBOARD_WIDTH, h / KEYBOARD_HEIGHT);
      setScale(KEYBOARD_SCALE_DOWN_1PCT * KEYBOARD_SCALE_REDUCE * KEYBOARD_SIZE_MULTIPLIER * fitScale);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pressedSelectors = Array.from(pressedKeys)
    .flatMap((key) => getDataNamesForKey(key))
    .map((name) => `[data-name="Keyboard"] > div > div > [data-name="${name}"], [data-name="Keyboard"] > div > [data-name="${name}"] { transform: translateY(15px) !important; }`)
    .join('\n');

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div
        style={{
          width: KEYBOARD_WIDTH,
          height: KEYBOARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
      <style>
        {pressedSelectors}
        {`
          [data-name="Keyboard"] > div > div > [data-name="10"], [data-name="Keyboard"] > div > div > [data-name="11"],
          [data-name="Keyboard"] > div > div > [data-name="12"], [data-name="Keyboard"] > div > div > [data-name="13"],
          [data-name="Keyboard"] > div > div > [data-name="14"], [data-name="Keyboard"] > div > div > [data-name="15"],
          [data-name="Keyboard"] > div > div > [data-name="16"], [data-name="Keyboard"] > div > div > [data-name="17"],
          [data-name="Keyboard"] > div > div > [data-name="18"], [data-name="Keyboard"] > div > div > [data-name="19"],
          [data-name="Keyboard"] > div > div > [data-name="tab"], [data-name="Keyboard"] > div > div > [data-name="q"],
          [data-name="Keyboard"] > div > div > [data-name="w"], [data-name="Keyboard"] > div > div > [data-name="e"],
          [data-name="Keyboard"] > div > div > [data-name="r"], [data-name="Keyboard"] > div > div > [data-name="t"],
          [data-name="Keyboard"] > div > div > [data-name="y"], [data-name="Keyboard"] > div > div > [data-name="u"],
          [data-name="Keyboard"] > div > div > [data-name="i"], [data-name="Keyboard"] > div > div > [data-name="o"],
          [data-name="Keyboard"] > div > div > [data-name="p"], [data-name="Keyboard"] > div > div > [data-name="a"],
          [data-name="Keyboard"] > div > div > [data-name="s"], [data-name="Keyboard"] > div > div > [data-name="d"],
          [data-name="Keyboard"] > div > div > [data-name="f"], [data-name="Keyboard"] > div > div > [data-name="g"],
          [data-name="Keyboard"] > div > div > [data-name="h"], [data-name="Keyboard"] > div > div > [data-name="j"],
          [data-name="Keyboard"] > div > div > [data-name="k"], [data-name="Keyboard"] > div > div > [data-name="l"],
          [data-name="Keyboard"] > div > div > [data-name="z"], [data-name="Keyboard"] > div > div > [data-name="x"],
          [data-name="Keyboard"] > div > div > [data-name="c"], [data-name="Keyboard"] > div > div > [data-name="v"],
          [data-name="Keyboard"] > div > div > [data-name="b"], [data-name="Keyboard"] > div > div > [data-name="n"],
          [data-name="Keyboard"] > div > div > [data-name="m"],
          [data-name="Keyboard"] > div > [data-name="space"] {
            transition: transform 0.1s ease;
            transform: translateY(0);
          }
        `}
      </style>
      <Keyboard />
      </div>
    </div>
  );
}
