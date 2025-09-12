import React from "react";
import { useTranslation } from 'react-i18next';
import p1 from "../../assets/images/p1.png";
import p2 from "../../assets/images/p2.png";
import p3 from "../../assets/images/p3.png";

function Industry() {
  const { t } = useTranslation();
  return (
    <div className="bg-black text-white --font-primary min-h-screen flex flex-col items-center px-2 md:px-4 py-6 md:p-10">
      {/* Header Section */}
      <div className="text-center max-w-5xl mb-10 md:mb-16 px-4">
        <h1 className="text-5xl md:teaxt-5xl font-bold mb-6 leading-tight">
          {t('industry_header')}
        </h1>
        <p className="text-lg md:text-xl !text-gray-300  mx-auto leading-relaxed">
          {t('industry_subheader')}
        </p>
      </div>

      {/* Check Score Section */}
      <div className="w-full      flex flex-col md:flex-row items-center gap-25 md:gap-12 p-6 md:p-8 rounded-xl ">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
            {t('check_resume_score_benchmark')}
          </h2>
          <p className="text-gray-300 mb-4 ">
            {t('ai_tool_compares')}
          </p>
          <ul className="list-disc pl-5 space-y-3 text-gray-300">
            <li>
              <strong className="font-semibold">
                {t('analysis_of_resume_scores')}
              </strong>
              <br />
              {t('benchmark_resume_against_standards')}
            </li>
            <li>
              <strong className="font-semibold">
                {t('detailed_review_report')}
              </strong>
              <br />
              {t('exhaustive_survey_strengths_improvements')}
            </li>
            <li>
              <strong className="font-semibold ">
                {t('customised_enhancement_advice')}
              </strong>
              <br />
              {t('avoids_overused_phrases')}
            </li>
          </ul>
        </div>
        <div className="flex-1 mt-6 md:mt-0">
          <img
            src={p1}
            alt="Resume score dashboard"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Calculate Score Section */}
      <div className="w-full       flex flex-col md:flex-row-reverse items-center gap-25 md:gap-12 p-6 md:p-8 rounded-xl ">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
            {t('how_resume_score_determined')}
          </h2>
          <p className="text-gray-300 mb-4 ">
            {t('make_resume_stand_out')}
          </p>
          <ul className="list-disc pl-5 space-y-3 text-gray-300">
            <li>
              <strong className="font-semibold">{t('completeness')}</strong>
              <br />
              {t('completeness_desc')}
            </li>
            <li>
              <strong className="font-semibold">{t('effectiveness')}</strong>
              <br />
              {t('effectiveness_desc')}
            </li>
            <li>
              <strong className="font-semibold ">{t('language_quality')}</strong>
              <br />
              {t('language_quality_desc')}
            </li>
          </ul>
        </div>
        <div className="flex-1 mt-6 md:mt-0">
          <img
            src={p2}
            alt="Resume checklist"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Enhance Resume Section */}
      <div className="w-full      flex flex-col md:flex-row items-center gap-25 md:gap-12 p-6 md:p-8 rounded-xl ">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
            {t('use_ai_to_improve_resume')}
          </h2>
          <p className="text-gray-300 mb-4">
            {t('get_actionable_insights')}
          </p>
          <ul className="list-disc pl-5 space-y-3 text-gray-300">
            <li>
              <strong className="font-semibold">
                {t('one_click_improvements')}
              </strong>{" "}
              <br />
              {t('ai_recommended_modifications')}
            </li>
            <li>
              <strong className="font-semibold">
                {t('customised_advice_for_you')}
              </strong>
              <br />
              {t('tailored_advice_background_goals')}
            </li>
            <li>
              <strong className="font-semibold">
                {t('boost_resume_score')}
              </strong>
              <br />
              {t('boost_impact_content_interview')}
            </li>
          </ul>
        </div>
        <div className="flex-1 mt-6 md:mt-0">
          <img
            src={p3}
            alt="AI suggestions interface"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Industry;
