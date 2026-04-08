import { InteractiveKeyboard } from './components/InteractiveKeyboard';
import typewriterMockup from 'figma:asset/0f64e134b594fb672bffa107b7071aaa1a7b52a3.png';

export default function App() {
  return (
    <div className="bg-[#F5F5F5] relative size-full">
      <div className="absolute h-[872px] left-[296px] top-[76px] w-[848px]">
        {/* Typewriter mockup image */}
        <div className="absolute h-[872px] left-0 top-0 w-[848px]">
          <img 
            alt="Typewriter" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={typewriterMockup} 
          />
        </div>
        
        {/* Interactive keyboard positioned in the black area */}
        <div className="absolute h-[184.423px] left-[227px] top-[613px] w-[410px]">
          <InteractiveKeyboard />
        </div>
      </div>
    </div>
  );
}