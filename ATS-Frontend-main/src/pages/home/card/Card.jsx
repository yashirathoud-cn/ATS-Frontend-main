import React from "react";
import { useTranslation } from 'react-i18next';

// Images (replace with your actual assets or CDN)
const images = {
  Customization: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920",
  Career_Summary: "https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&w=1920",
  Word_Choice: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1920",
  Formatting: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1920",
  Achievements: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1920",
  Completeness: "https://images.pexels.com/photos/3184314/pexels-photo-3184314.jpeg?auto=compress&cs=tinysrgb&w=1920",
};

const UpdatedCardComponent = () => {
  const { t } = useTranslation();
  const cardData = [
    {
      key: "Customization",
      title: t('card_customization_title'),
      description: t('card_customization_desc'),
    },
    {
      key: "Career_Summary",
      title: t('card_career_summary_title'),
      description: t('card_career_summary_desc'),
    },
    {
      key: "Word_Choice",
      title: t('card_word_choice_title'),
      description: t('card_word_choice_desc'),
    },
    {
      key: "Formatting",
      title: t('card_formatting_title'),
      description: t('card_formatting_desc'),
    },
    {
      key: "Achievements",
      title: t('card_achievements_title'),
      description: t('card_achievements_desc'),
    },
    {
      key: "Completeness",
      title: t('card_completeness_title'),
      description: t('card_completeness_desc'),
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white min-h-screen flex flex-col items-center px-4 py-14 md:px-10">
      {/* Header */}
      <div className="text-center max-w-4xl mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide uppercase animate-fade-in">
          {t('card_header')}
        </h1>
        <div className="w-28 h-1 mx-auto mt-4 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full animate-pulse" />
        <p className="text-gray-300 text-lg md:text-xl mt-5 leading-relaxed max-w-2xl mx-auto animate-fade-in-delayed">
          {t('card_subheader')}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl w-full">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)] transition-all duration-500 hover:scale-[1.04] hover:shadow-cyan-500/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={images[card.key]}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              {/* Animated Glow Ring */}
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full border-4 border-cyan-400 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 blur-lg animate-ping" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center z-20 relative">
              <h3 className="text-xl font-bold text-cyan-400 mb-2 tracking-wider">
                {card.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={scrollToTop}
          className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white text-lg font-bold px-10 py-3 rounded-full shadow-lg hover:shadow-pink-500/40 hover:from-cyan-300 hover:to-pink-400 transition-all duration-300 animate-bounce"
        >
          {t('card_cta')}
        </button>
      </div>
    </div>
  );
};

export default UpdatedCardComponent;
