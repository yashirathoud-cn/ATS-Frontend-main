import React from "react";
import { useNavigate } from "react-router-dom";
import step1 from "../../assets/images/JobBuilder/step1.png";
import step2 from "../../assets/images/JobBuilder/Step2.png"; 
import step3 from "../../assets/images/JobBuilder/step3.png";
import step4 from "../../assets/images/JobBuilder/step4.png"; 
import { useTranslation } from 'react-i18next';

export default function Job_ready() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateResume = () => {
    navigate("/resume_writer");
  };

  return (
    <div className="min-screen bg-black text-white p-12">
      <div className="container mx-auto px-4 py-auto max-w-7xl ">
        {/* Centered Heading */}
        <h1 className="text-4xl font-bold text-center mb-12">
          {t('resume_steps_heading')}
        </h1>

        {/* Four-Column Grid for Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15 mb-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg">
              <img 
                src={step1} 
                alt={t('resume_steps_step1_alt')} 
                className="w-50 h-50 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('resume_steps_step1_title')}</h3>
            <h4 className="text-lg font-medium mb-2">{t('resume_steps_step1_subtitle')}</h4>
            <p className="text-gray-400 text-sm">
              {t('resume_steps_step1_desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg">
              <img 
                src={step2} 
                alt={t('resume_steps_step2_alt')} 
                className="w-50 h-50 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('resume_steps_step2_title')}</h3>
            <h4 className="text-lg font-medium mb-2">{t('resume_steps_step2_subtitle')}</h4>
            <p className="text-gray-400 text-sm">
              {t('resume_steps_step2_desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg">
              <img 
                src={step3} 
                alt={t('resume_steps_step3_alt')} 
                className="w-50 h-50 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('resume_steps_step3_title')}</h3>
            <h4 className="text-lg font-medium mb-2">{t('resume_steps_step3_subtitle')}</h4>
            <p className="text-gray-400 text-sm">
              {t('resume_steps_step3_desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg">
              <img 
                src={step4} 
                alt={t('resume_steps_step4_alt')} 
                className="w-50 h-50 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('resume_steps_step4_title')}</h3>
            <h4 className="text-lg font-medium mb-2">{t('resume_steps_step4_subtitle')}</h4>
            <p className="text-gray-400 text-sm">
              {t('resume_steps_step4_desc')}
            </p>
          </div>
        </div>

        {/* Centered Button with cursor-pointer */}
        <div className="text-center">
          <button 
            onClick={handleCreateResume}
            className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t('resume_steps_create_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
