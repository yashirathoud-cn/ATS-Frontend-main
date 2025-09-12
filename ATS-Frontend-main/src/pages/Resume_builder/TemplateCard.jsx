import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img0 from "../../assets/img0.png"
import img01 from "../../assets/img01.png"
import img02 from "../../assets/img02.png"
import img03 from "../../assets/img03.png"
import img12 from "../../assets/img12.jpeg"
import img4 from "../../assets/img4.png"
import { useTranslation } from 'react-i18next';
// Define resume templates to display
const resumeTemplates = [
  {
    id: 1,
    name: "Joseph Bear",
    title: "Data Analyst",
    style: "Modern Dark",
    image: img0
  },
  {
    id: 2,
    title: "Marketing Director",
    image: img01    // 400 * 600
  },
  {
    id: 3,
    title: "UX Designer",
    image: img02
  },
  {
    id: 4,
    title: "Software Engineer",
    image: img03
  },
  {
    id: 5,
    title: "Software Engineer",
 
    image: img12
  },
  {
    id: 6,
    title: "Software Engineer",
    image: img4
  }
];
 
export default function TemplateCard() {
  const { t } = useTranslation();
  const [active, setActive] = useState(1);
  const MAX_VISIBILITY = 4;
 
  const goNext = () => {
    setActive(current => (current < resumeTemplates.length - 1 ? current + 1 : current));
  };
 
  const goPrev = () => {
    setActive(current => (current > 0 ? current - 1 : current));
  };
 
  const calculateStyles = (index) => {
    const offset = active - index;
    const direction = Math.sign(offset);
    const absOffset = Math.abs(offset);
 
    if (absOffset >= MAX_VISIBILITY) {
      return { display: 'none' };
    }
 
    // Different styling for different positions
    if (offset === 0) { // Active card
      return {
        transform: 'translateX(0) scale(1)',
        zIndex: 3,
        boxShadow: '0 10px 30px rgba(50, 26, 187, 0.4)'
      };
    } else {
      // Side cards with staggered positioning
      const xTranslate = direction * (280 + (absOffset * 30));
      const scale = 1 - (absOffset * 0.05);
     
      return {
        transform: `translateX(${xTranslate}px) scale(${scale})`,
        zIndex: 2 - absOffset,
      };
    }
  };
 
  return (
    <div className="flex flex-col items-center w-full h-screen bg-black overflow-hidden">
      {/* Header Section */}
      <div className="text-center max-w-5xl mb-1 md:mb-1 px-4">
        <h1 className="text-4xl font-bold mb-6 leading-tight">
          {t('template_card_heading')}
        </h1>
        <p className="text-lg md:text-xl mb-12 !text-gray-300 mx-auto leading-relaxed">
          {t('template_card_subheading')}
        </p>
      </div>
     
      <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center">
        {/* Templates */}
        {resumeTemplates.map((template, i) => (
          <div
            key={template.id}
            className="absolute w-64 md:w-80 h-96 md:h-120 bg-white rounded-lg shadow-xl transition-all duration-500 ease-out cursor-pointer"
            style={calculateStyles(i)}
            onClick={() => setActive(i)}
          >
            <img
              src={template.image}
              alt={template.name ? `${template.name} Resume Template` : t('template_card_resume_template_alt')}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-gray-200 text-sm">{t(`template_card_title_${template.id}`)}</p>
            </div>
          </div>
        ))}
 
        {/* Navigation buttons */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-8 z-10">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded shadow transition-colors duration-300"
            onClick={goNext}
            disabled={active === resumeTemplates.length - 1}
          >
            <ChevronLeft className="inline mr-1" size={16} /> {t('template_card_prev')}
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded shadow transition-colors duration-300"
            onClick={goPrev}
            disabled={active === 0}
          >
            {t('template_card_next')}<ChevronRight className="inline ml-1" size={16} />
          </button>
         
        </div>
      </div>
    </div>
  );
}