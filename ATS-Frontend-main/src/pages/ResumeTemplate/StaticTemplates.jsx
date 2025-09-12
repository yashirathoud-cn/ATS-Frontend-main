import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import img1 from "../../assets/image.png";
 
export default function StaticTemplates() {
  const { t } = useTranslation();
  // Function to handle scroll to bottom when button is clicked
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollWidth,
      behavior: "smooth",
    });
  };
 
  return (
    <div className="bg-black text-white min-h-screen flex flex-col pt-20 px-4">
      {/* Changed from max-w-4xl centered to full width with padding */}
      <div className="w-full px-4 md:px-12 lg:px-24">
        {/* Header - Removed auto margins and center alignment */}
        <h1 className="text-5xl font-bold mb-6 pt-4 text-left --font-primary">
          {t('static_templates_heading')}
        </h1>
        <p className="text-gray-300 mb-4 text-2xl text-left --font-primary max-w-2xl">
          {t('static_templates_subheading')}
        </p>
 
        <div className="my-2 flex justify-end">
          <img
            src={img1}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "600px",
              marginLeft: "30%",
            }}
          />
        </div>
 
        <div className="my-8">
          {/* Changed from center to left alignment */}
          <p className=" text-gray-300 mb-8 text-2xl --font-primary max-w-2xl">
            {t('static_templates_choose')}
          </p>
 
          <div className="flex">
            {/* Changed from justify-center to default (start) */}
            <button
              className="bg-blue-800 hover:bg-blue-700 text-white py-3 px-8 rounded flex items-center text-lg --font-primary"
              onClick={scrollToBottom}
            >
              {t('static_templates_browse_btn')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 26 26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="lucide lucide-chevron-down"
              >
                <path d="m10 12 6 6 6-6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 