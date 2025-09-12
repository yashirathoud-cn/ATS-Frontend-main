import React from "react";
import { useTranslation } from "react-i18next";
import PlanCard from "./PlanCard"; // Import the reusable component

const Plans = () => {
  const { t } = useTranslation();
  const plans = [
    {
      title: t("plan_one_year"),
      price: "XXXX",
      features: [
        t("plan_resume_builder"),
        t("plan_ats_score_checker"),
        t("plan_job_recommendation"),
        t("plan_job_apply"),
      ],
      validity: "12 Months",
      isPopular: false,
    },
    {
      title: t("plan_three_months"),
      price: "XXXX",
      features: [
        t("plan_resume_builder"),
        t("plan_ats_score_checker"),
        t("plan_job_recommendation"),
        t("plan_job_apply"),
      ],
      validity: "3 Months",
      isPopular: true, // This plan is marked as popular
    },
    {
      title: t("plan_one_month"),
      price: "XXXX",
      features: [
        t("plan_resume_builder"),
        t("plan_ats_score_checker"),
        t("plan_job_recommendation"),
        t("plan_job_apply"),
      ],
      validity: "1 Month",
      isPopular: false,
    },
  ];

  return (
    <div className="bg-black text-white min-screen py-10 px-6">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{t("plans_choose_plan")}</h1>
        <p className="text-base sm:text-lg md:text-xl mt-3 sm:mt-4 text-gray-300 px-4 max-w-3xl mx-auto">
          {t("plans_unlock_possibilities")}
        </p>
      </div>

      {/* Plans Grid - Optimized for all tablet sizes */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-6 md:px-8">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;