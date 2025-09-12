import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import jobready from "../../assets/images/JobBuilder/jobready.webp";
import { useTranslation } from 'react-i18next';

export default function Job_ready() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Handler for Create Your Resume button
  const handleCreateResume = () => {
    navigate("/resume_writer");
  };

  // Handler to trigger file input click and navigate to home page
  const handleImportResume = () => {
    // Navigate to the home page
    navigate("/");

    // No longer need to open file input since we're navigating away
    // fileInputRef.current.click();
  };

  // Handler for file selection with basic validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        alert(t('job_ready_alert_file_type'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('job_ready_alert_file_size'));
        return;
      }

      // File is valid - you can process it here
      console.log("Selected file:", file);
      // Optionally navigate to editor with file data
      // navigate("/resume-editor", { state: { file } });
    }
  };

  return (
    <div className="min-screen bg-black text-white p-10">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Changed md:grid-cols-2 to lg:grid-cols-2 so tablets show single column */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="space-y-10">
            <h1 className="text-4xl font-bold leading-tight">
              {t('job_ready_heading1')}
              <br />
              {t('job_ready_heading2')}
            </h1>
            <div className="space-y-4 text-lg">
              <p>
                {t('job_ready_paragraph1')}
              </p>
              {/* <p>
                Backed by job seekers and trusted by hiring experts, it's the      
                smarter way to get noticed and get hired. Start building your
                future today quickly, confidently, and with zero hassle.
              </p> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCreateResume}
                className="px-8 py-4 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                {t('job_ready_create_btn')}
              </button>
              <button
                onClick={handleImportResume}
                className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {t('job_ready_import_btn')}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </div>
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-lg">
                  {t('job_ready_benefit1')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-1 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-lg">
                  {t('job_ready_benefit2')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{t('job_ready_great')}</span>
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-green-500 px-2 py-1 rounded text-white text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>4.8</span>
              </div>
            </div>
          </div>
          {/* Right side - Enhanced Resume Preview */}
          <div className="bg-blue-600 rounded-xl pt-5 pb-5 shadow-xl overflow-hidden">
            <div className="relative group">
              <img
                src={jobready}
                alt={t('job_ready_preview_alt')}
                className="w-full h-auto object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('job_ready_hover_to_zoom')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
