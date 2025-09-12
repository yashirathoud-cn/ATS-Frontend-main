import React from 'react';
import { useTranslation } from 'react-i18next';
import img0 from '../../assets/img0.png';
import img01 from '../../assets/img01.png';
import img02 from '../../assets/img02.png';
import img03 from '../../assets/img03.png';
import img12 from '../../assets/img12.jpeg';
import img4 from '../../assets/img4.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-black text-white p-6  px-4 md:px-12 lg:px-24">
      <h1 className="text-4xl font-bold mb-2 px-2 --font-primary">{t('template_cards_main_heading')}</h1>
      <p className="text-xl text-gray-300 px-2  --font-primary">
        {t('template_cards_main_subheading')}
      </p>
    </div>
  );
};

const SecondaryHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-black text-white p-6 mt-8 px-4 md:px-12 lg:px-24">
      <h2 className="text-4xl font-bold mb-2 px-2 --font-primary">{t('template_cards_featured_heading')}</h2>
      <p className="text-xl text-gray-300 px-2 --font-primary">
        {t('template_cards_featured_subheading')}
      </p>
    </div>
  );
};

const TemplateCard = ({ id, name, image, onTemplateSelect }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleTemplateClick = () => {
    onTemplateSelect(id);
  };

  return (
    <div
      className="relative w-86 h-118 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10"></div>
     
      <div className="w-full h-full relative overflow-hidden">
        <img
          src={image}
          alt={name || t('template_cards_professional_resume')}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>
     
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-black/20 z-20">
        <h3 className="text-xl text-white font-bold mb-1">{name}</h3>
        <div className={`flex items-center justify-end transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
     
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/70 to-black/50 transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } z-30`}
      >
        <button
          onClick={handleTemplateClick}
          className="bg-gradient-to-r from-blue-600 to-blue-800 --font-primary hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/50 flex items-center justify-center space-x-2"
        >
          <span>{t('template_cards_use_template')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TemplateCardList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const analysisIdFromState = state?.analysisId;

  const templates = [
    {
      id: 'professional-resume',
      name: t('template_cards_professional_resume'),
      image: img01,
      routeHandler: (analysisId) => `/improve_resume/${analysisId}/professional-resume`,
    },
    {
      id: 'creative-cv',
      name: t('template_cards_creative_cv'),
      image: img4,
      routeHandler: (analysisId) => `/improve_resume2/${analysisId}/creative-cv`,
    },
    {
      id: 'classic-format',
      name: t('template_cards_classic_format'),
      image: img12,
      routeHandler: (analysisId) => `/improve_resume3/${analysisId}/classic-format`,
    },
    {
      id: 'technical-resume',
      name: t('template_cards_technical_resume'),
      image: img0,
      routeHandler: (analysisId) => `/improve_resume4/${analysisId}/technical-resume`,
    },
    {
      id: 'entry-level',
      name: t('template_cards_entry_level'),
      image: img02,
      routeHandler: (analysisId) => `/improve_resume5/${analysisId}/entry-level`,
    },
    {
      id: 'executive-cv',
      name: t('template_cards_executive_cv'),
      image: img03,
      routeHandler: (analysisId) => `/improve_resume6/${analysisId}/executive-cv`,
    },
  ];

  const handleTemplateSelect = (templateId) => {
    const selectedTemplate = templates.find((template) => template.id === templateId);
    if (!selectedTemplate) {
      console.error(`Template with ID ${templateId} not found.`);
      alert(t('template_cards_error_not_found'));
      return;
    }

    const analysisId = analysisIdFromState || localStorage.getItem('analysisId');
    if (!analysisId) {
      alert(t('template_cards_error_no_analysis'));
      return;
    }

    const routePath = selectedTemplate.routeHandler(analysisId);
    console.log(`Navigating to: ${routePath}`);
    navigate(routePath);
  };

  const firstSectionTemplates = templates.slice(0, 3);
  const secondSectionTemplates = templates.slice(3);

  return (
    <div className="flex flex-col w-full bg-black min-h-screen">
      <Header />
      <div className="flex flex-wrap justify-center gap-8 p-12">
        {firstSectionTemplates.map((template, index) => (
          <TemplateCard key={index} {...template} onTemplateSelect={handleTemplateSelect} />
        ))}
      </div>
      <SecondaryHeader />
      <div className="flex flex-wrap justify-center gap-8 p-12">
        {secondSectionTemplates.map((template, index) => (
          <TemplateCard key={`second-${index}`} {...template} onTemplateSelect={handleTemplateSelect} />
        ))}
      </div>
    </div>
  );
};

export default TemplateCardList;