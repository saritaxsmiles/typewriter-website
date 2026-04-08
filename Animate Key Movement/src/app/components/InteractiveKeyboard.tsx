import { useState, useEffect } from 'react';
import Keyboard from '../../imports/Keyboard';

export function InteractiveKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative size-full">
      <style>
        {Array.from(pressedKeys).map(key => {
          const dataNames = getDataNamesForKey(key);
          return dataNames.map(name => 
            `[data-name="Keyboard"] > div > div > [data-name="${name}"], [data-name="Keyboard"] > div > [data-name="${name}"] { transform: translateY(15px) !important; }`
          ).join('\n');
        }).join('\n')}
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
  );
}

function getDataNamesForKey(key: string): string[] {
  const keyMap: Record<string, string[]> = {
    '1': ['10'], '2': ['11'], '3': ['12'], '4': ['13'], '5': ['14'],
    '6': ['15'], '7': ['16'], '8': ['17'], '9': ['18'], '0': ['19'],
    'tab': ['tab'], 
    'q': ['q'], 'w': ['w'], 'e': ['e'], 'r': ['r'], 't': ['t'],
    'y': ['y'], 'u': ['u'], 'i': ['i'], 'o': ['o'], 'p': ['p'],
    'a': ['a'], 's': ['s'], 'd': ['d'], 'f': ['f'], 'g': ['g'],
    'h': ['h'], 'j': ['j'], 'k': ['k'], 'l': ['l'], 
    'z': ['z'], 'x': ['x'], 'c': ['c'], 'v': ['v'], 'b': ['b'],
    'n': ['n'], 'm': ['m'], ' ': ['space']
  };
  return keyMap[key] || [];
}