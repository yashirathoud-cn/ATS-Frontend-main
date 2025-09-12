import { useState, useRef, useEffect } from "react";
import upload from "../../../assets/upload/bg_image.png"; // Import your background image
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function ResumeChecker() {
  const [file, setFile] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [roles, setRoles] = useState([]); // State to store roles from API
  const [error, setError] = useState(null); // State to handle errors
  const [selectionType, setSelectionType] = useState(null); // Track if role or job description is selected
  const [fileSizeError, setFileSizeError] = useState(null); // State for file size error
  const [analysisResult, setAnalysisResult] = useState(null); // State to store analysis result
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // API Base URL from environment variable (Vite style)
  const API_BASE_URL = import.meta.env.VITE_RESUME_API_DATA_URL;

  // Fetch roles from API on component mount and sort alphabetically
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/roles`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch roles: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Fetched roles:", data); // Debugging log

        // Sort roles alphabetically by title
        const sortedRoles = (data.roles || []).sort((a, b) =>
          a.title.localeCompare(b.title)
        );

        // Set sorted roles
        setRoles(sortedRoles);
      } catch (error) {
        console.error("Error loading job roles:", error);
        setError("Error loading roles. Please try again.");
        setRoles([]); // Fallback to empty array
      }
    };

    fetchRoles();
  }, []);

  // Handle selection of role
  const handleRoleChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSelectionType("role");
      // Clear job description when role is selected
      document.getElementById("jobDescription").value = "";
      setAnalysisResult(null); // Clear any previous JD-related errors
    } else {
      setSelectionType(null);
    }
  };

  // Handle input in job description
  const handleJobDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      setSelectionType("jobDescription");
      // Reset role select when job description is entered
      document.getElementById("roleSelect").value = "";
    } else {
      setSelectionType(null);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please upload a PDF or DOC file.");
        setFileSizeError(null); // Clear file size error if type is invalid
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setFileSizeError("File size must be less than 2MB.");
        setFile(null); // Clear file to prevent invalid file from being set
        return;
      }
      setFile(selectedFile);
      setFileSizeError(null); // Clear error if file is valid
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle calculate button click with API integration
  const handleCalculateScore = async () => {
    if (!file) {
      alert("Please upload a resume first.");
      return;
    }

    setIsCalculating(true);
    setError(null); // Reset any previous errors
    setAnalysisResult(null); // Reset previous analysis result

    // Get form values
    const roleSelect = document.getElementById("roleSelect");
    const jobDescription = document.getElementById("jobDescription");
    const selectedRoleId = roleSelect.value;
    const jdText = jobDescription.value;

    const formData = new FormData();
    formData.append("resume", file);

    let endpoint = "";
    // Determine which analysis endpoint to use
    if (jdText && jdText.trim() !== "") {
      endpoint = `${API_BASE_URL}/analyze/with-jd`;
      formData.append("job_description", jdText);
      formData.append("role_id", null);
    } else if (selectedRoleId && selectedRoleId !== "") {
      endpoint = `${API_BASE_URL}/analyze/with-role`;
      formData.append("role_id", selectedRoleId);
    } else {
      endpoint = `${API_BASE_URL}/analyze/general`;
      formData.append("role_id", null);
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(
        "API response:",
        data,
        "Type of data.analysis:",
        typeof data.analysis,
        "Is array:",
        Array.isArray(data.analysis)
      ); // Debugging log

      if (response.ok) {
        // Check for errors in the API response
        if (
          data.error ||
          (Array.isArray(data.analysis) && data.analysis.some((item) => item.error))
        ) {
          // Handle irrelevant JD or other errors
          const errors = data.error
            ? [{ error: data.error }]
            : data.analysis.filter((item) => item.error);
          setAnalysisResult(errors);
          setIsCalculating(false);
        } else if (data.analysis_id) {
          // Store analysisId in localStorage for robustness
          localStorage.setItem("analysisId", data.analysis_id);
          // Redirect to ATS Score page with analysis data if no errors
          navigate("/ats-score", {
            state: { analysisData: data, analysisId: data.analysis_id },
          });
        } else {
          // Handle unexpected response structure
          setError("Unexpected response from server. Please try again.");
          setIsCalculating(false);
        }
      } else {
        // Handle non-200 responses
        const errorMessage = data.detail || data.error || "Unknown error";
        setAnalysisResult([{ error: errorMessage }]);
        setIsCalculating(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setAnalysisResult([{ error: "An error occurred. Please try again." }]);
      setIsCalculating(false);
    }
  };

  // Clear all selections
  const handleClearSelections = () => {
    document.getElementById("roleSelect").value = "";
    document.getElementById("jobDescription").value = "";
    setSelectionType(null);
    setAnalysisResult(null); // Clear analysis result when selections are cleared
  };

  return (
    <section
      className="bg-black text-white --font-primary min-h-screen flex items-center justify-center py-6 px-2 w-full relative bg-no-repeat bg-contain md:bg-right md:bg-contain bg-top sm:bg-cover header-offset"
      style={{ backgroundImage: `url(${upload})` }} // Background image
    >
      <div className="container mx-auto px-4 py-6 w-full">
        <div className="max-w-7xl mx-auto text-left">
          {/* Heading */}
          <h1 className="text-5xl font-bold mb-4 gap-8">
            {t('ai_resume_checker')}
          </h1>
          <h1 className="text-5xl font-bold mb-4 gap-8">
            {t('get_instant_feedback')}
          </h1>
          {/* Subheading */}
          <p className="text-2xl text-gray-300 mb-14 gap-y-6">
            {t('upload_resume_instruction')}
          </p>
          {/* Call to Action */}
          <p className="text-3xl text-center font-bold mb-4 text-gray-100">
            {t('get_resume_score_now')}
          </p>
          {/* Display error if any (e.g., role fetching error) */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          {/* Upload Section */}
          <div className="rounded-lg px-8 py-4 sm:p-6 mb-6 border border-white-700 w-full max-w-5xl mx-auto bg-black-800 border-gray-400">
            <div className="flex flex-col items-center">
              <div className="mb-3 sm:mb-4">
                <svg
                  className="w-8 h-8 sm:w-12 sm:h-12 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <button
                onClick={handleUploadClick}
                className="bg-blue-700 text-white px-6 py-2 rounded-md text-2xl font-medium tracking-wide hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 mb-3 sm:mb-4 w-full sm:w-auto"
              >
                {t('upload_your_resume')}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              {file && (
                <p className="text-xs sm:text-sm text-gray-300 mb-2">
                  Uploaded: {file.name}
                </p>
              )}
              <p className="text-base sm:text-xl font-bold text-gray flex items-center justify-center">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                  viewBox="0 0 22 22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#E0E0E0"
                    stroke="none"
                    d="M18 8h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM9 6a3 3 0 016 0v2H9V6z"
                  />
                </svg>
                {t('privacy_guaranteed')}
              </p>
              {/* Conditionally display file size error */}
              {fileSizeError && (
                <p className="text-sm sm:text-lg text-red-500 text-center w-full mt-2">
                  {fileSizeError}
                </p>
              )}
              {/* Center aligned file format text */}
              <p className="text-sm sm:text-lg text-gray text-center w-full mt-2">
                {t('supported_formats')}
                <br className="hidden sm:block" />
                {t('max_size')}
              </p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 max-w-5xl justify-center items-center mx-auto">
            <div className="w-full md:w-1/2">
              <label className="block text-sm text-gray-400 mb-2">
                {t('select_a_role')}
              </label>
              <select
                id="roleSelect"
                className={`w-full bg-black bg-opacity-50 text-white border ${
                  selectionType === "jobDescription"
                    ? "border-gray-800 bg-gray-900 opacity-50"
                    : "border-gray-600"
                } rounded-md px-4 py-2`}
                onChange={handleRoleChange}
                disabled={selectionType === "jobDescription"}
              >
                <option value="">{t('any')}</option>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))
                ) : (
                  <option value="">{t('loading_roles')}</option>
                )}
              </select>
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm text-gray-400 mb-2">
                {t('job_description')}
              </label>
              {/* Display analysis result (e.g., irrelevant JD error) above Job Description */}
              {analysisResult && (
                <div className="mb-2">
                  {analysisResult.map((item, index) => (
                    <p key={index} className="text-sm sm:text-lg text-red-500">
                      {item.error}
                    </p>
                  ))}
                </div>
              )}
              <textarea
                id="jobDescription"
                className={`w-full !bg-black text-white border ${
                  selectionType === "role"
                    ? "border-gray-800 bg-gray-900 opacity-50"
                    : "border-gray-600"
                } rounded-md px-4 py-2`}
                rows="3"
                placeholder={t('paste_job_description_here')}
                onChange={handleJobDescriptionChange}
                disabled={selectionType === "role"}
              ></textarea>
            </div>
          </div>

          {/* Selection Info and Clear Button */}
          <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
            {selectionType && (
              <p className="text-sm text-gray-300">
                {t('currently_using')}:{" "}
                <span className="font-bold text-blue-400">
                  {selectionType === "role"
                    ? t('role_selection')
                    : t('job_description')}
                </span>
              </p>
            )}
            {selectionType && (
              <button
                onClick={handleClearSelections}
                className="px-4 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600"
              >
                {t('clear_selection')}
              </button>
            )}
          </div>

          {/* Calculate Button - Centered */}
          <div className="flex justify-center">
            <button
              onClick={handleCalculateScore}
              disabled={isCalculating}
              className={`px-8 py-3 rounded-md font-bold text-xl tracking-wide transition-all duration-300 transform hover:scale-105 ${
                isCalculating
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {isCalculating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-gray-300"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t('calculating')}...
                </span>
              ) : (
                t('calculate_resume_score')
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResumeChecker;