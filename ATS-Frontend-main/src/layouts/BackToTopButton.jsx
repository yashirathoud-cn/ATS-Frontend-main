import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calcScrollValue = () => {
    const pos = window.scrollY;
    const calcHeight = 
      document.documentElement.scrollHeight - 
      document.documentElement.clientHeight;
    
    const scrollValue = Math.round((pos * 100) / calcHeight);
    
    setScrollProgress(scrollValue);
    setIsVisible(pos > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', calcScrollValue);
    window.addEventListener('load', calcScrollValue);
    
    return () => {
      window.removeEventListener('scroll', calcScrollValue);
      window.removeEventListener('load', calcScrollValue);
    };
  }, []);

  return (
    <>
    
      {/* Scroll Progress Indicator */}
      <div 
        className={`fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-md cursor-pointer grid place-items-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={scrollToTop}
        style={{
          background: `conic-gradient(blue ${scrollProgress}%, #d7d7d7 ${scrollProgress}%)`
        }}
      >
        <div className="h-12 w-12 bg-white rounded-full grid place-items-center">
          <ArrowUp className="text-slate-800 h-6 w-6" />
        </div>
      </div>
    </>
  );
}