// PremiumCard.jsx
import styles from "./Premium.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

const PremiumCard = ({ image, title, description }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.bgGray900} p-4 sm:p-6 rounded-lg ${styles.shadowLg}`}>
      <img
        src={image}
        alt={title}
        className="w-full h-40 sm:h-48 object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-semibold text-yellow-500">{t('premium_badge')}</h3>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-350">
        {title}
      </h2>
      <p className="mt-2 text-gray-300">{description}</p>
    </div>
  );
};

export default PremiumCard;