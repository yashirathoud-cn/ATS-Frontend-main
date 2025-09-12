import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./Plans.module.css";

const PlanCard = ({ title, price, features, validity, isPopular }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate("/under_construction");
  };

  // Map feature keys to translation keys
  const featureKeyMap = {
    "Resume Builder": t("plan_resume_builder"),
    "ATS Score Checker": t("plan_ats_score_checker"),
    "Job Recommendation": t("plan_job_recommendation"),
    "Job Apply": t("plan_job_apply"),
  };

  // Map plan title to translation key
  const planTitleKeyMap = {
    "One Year": t("plan_one_year"),
    "Three Months": t("plan_three_months"),
    "One Month": t("plan_one_month"),
  };

  return (
    <div className="relative h-full">
      <div
        className={`${styles["bg-gray-700"]} ${styles["shadow-lg"]} p-5 sm:p-6 rounded-lg ${styles["border-orange-500"]} h-full flex flex-col justify-between`}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">{planTitleKeyMap[title] || title}</h2>
          <p className="text-3xl sm:text-4xl font-bold mt-2">₹ {price}</p>

          <div className={`border-b mt-2 ${styles["border-gray-700"]}`}></div>

          <p className="mt-4 text-gray-300 uppercase text-sm sm:text-base">{t("plan_all_features")}</p>
          <ul className="mt-2 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-2 flex-shrink-0">✔</span>
                <span className="flex-grow">{featureKeyMap[feature] || feature}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-gray-300 font-bold text-lg sm:text-xl">
            {t("plan_templates")}
          </p>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">{t("plan_validity", { validity })}</p>
        </div>

        <button
          onClick={handleUpgradeClick}
          className={`${styles["bg-gray-700"]} ${styles["border-orange-500"]} w-full text-orange-500 font-bold py-2 sm:py-3 rounded-lg mt-6`}
        >
          {t("plan_upgrade_now")}
        </button>
      </div>

      {isPopular && (
        <span
          className={`${styles["bg-purple-600"]} absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full`}
        >
          {t("plan_most_popular")}
        </span>
      )}
    </div>
  );
};

export default PlanCard;
