import { useState, useEffect } from 'react';
import { HardHat, Construction, Settings, Hammer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UnderConstruction() {
  const { t } = useTranslation();
  const [showTools, setShowTools] = useState(false);
  
  // Effect to animate tools appearing after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTools(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col justify-center items-center px-4 py-19 overflow-hidden">
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gear */}
        <div className="absolute top-1/4 left-1/6 animate-spin-slow opacity-20">
          <Settings size={64} className="text-purple-600" />
        </div>
        
        {/* Animated gear */}
        <div className="absolute bottom-1/3 right-1/6 animate-spin-slow opacity-20">
          <Settings size={48} className="text-blue-500" />
        </div>
        
        {/* Floating hammer */}
        {showTools && (
          <div className="absolute top-1/2 right-1/4 animate-bounce-slow opacity-20">
            <Hammer size={36} className="text-yellow-500" />
          </div>
        )}
        
        {/* Floating shapes */}
        <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-yellow-500 rounded-lg animate-float opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-purple-600 rounded-full animate-float-delay opacity-10"></div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Construction Icon with animation */}
        <div className="flex justify-center mb-8">
          <div className="bg-yellow-500 p-5 rounded-full animate-pulse-slow">
            <HardHat size={48} className="text-gray-900" />
          </div>
        </div>
        
        {/* Main Heading with typing animation */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-down">
          {t('under_construction_heading')}
        </h1>
        
        {/* Subheading with slide-in animation */}
        <div className="overflow-hidden">
          <p className="text-xl text-gray-300 mb-12 max-w-xl mx-auto animate-slide-in">
            {t('under_construction_subheading')}
          </p>
        </div>
        
        {/* Construction site illustration */}
      
        {/* Footer */}
        <div className="mt-12 text-gray-500 animate-fade-in">
          <p>&copy; {new Date().getFullYear()} Your Company. {t('under_construction_footer')}</p>
        </div>
      </div>
    </div>
  );
}

// Inject required keyframe animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-15px) rotate(5deg); }
  }
  @keyframes float-delay {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-15px) rotate(-5deg); }
  }
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes fade-in-down {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-float-delay {
    animation: float-delay 7s ease-in-out infinite;
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
  .animate-fade-in-down {
    animation: fade-in-down 1s ease-out forwards;
  }
  .animate-slide-in {
    animation: slide-in 1s ease-out forwards;
  }
  .animate-fade-in {
    animation: fade-in 2s ease-out forwards;
  }
  .clip-triangle {
    clip-path: polygon(0 100%, 50% 0, 100% 100%);
  }
`;
document.head.appendChild(styleSheet);