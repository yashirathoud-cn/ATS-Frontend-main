import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrbWithText from "./Orb";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from 'react-i18next';
// import anim from "../../assets/images/anim.gif";
 
// Utility function to parse analysisData and map to userData structure
const parseAnalysisData = (data) => {
  const defaultData = {
    score: 0,
    resumeSummary:
      ""
      ,
    keySkills: [],
    missingKeywords: [],
    resumeStrengths: [
      // "Technical skills clearly highlighted",
      // "Clean formatting",
      // "Quantifiable achievements",
    ],
    improvementAreas: [
      {
        area: "Missing Keywords",
        description:
          "Your resume is missing some keywords from the job description.",
      },
      {
        area: "Achievements or Certifications",
        
        description: "Include more measurable achievements and results.",
      },
    ],
    recommendations: [
      // "Add relevant certifications to enhance your resume",
      // "Quantify achievements more precisely",
      // "Ensure consistent capitalization and formatting",
    ],
    keywordMatchData: [
      { name: "Python", resume: 12, jobDescription: 15 },
      { name: "AWS", resume: 8, jobDescription: 10 },
      { name: "Azure", resume: 7, jobDescription: 6 },
      { name: "Microservices", resume: 5, jobDescription: 8 },
      { name: "RESTful APIs", resume: 6, jobDescription: 7 },
    ],
    detailedImprovements: {
      format: 90,
      skills: 95,
      experience: 85,
      education: 80,
      resumeSummaryDetailed:
        "Extensiv e experience in Python development and cloud technologies (AWS and Azure). Demonstrated expertise in building scalable and high-performance applications.",
    },
    achievements: [],
  };
 
  if (!data) return defaultData;
 
  let analysisObj = {};
  if (Array.isArray(data)) {
    if (data.length === 0) return defaultData;
    analysisObj = data[0] || {};
  } else if (typeof data === "object") {
    analysisObj = data;
  } else {
    return defaultData;
  }
 
  const parsedData = { ...defaultData };
 
  if (analysisObj && typeof analysisObj === "object") {
    parsedData.score =
      analysisObj.ATS_Score !== undefined
        ? analysisObj.ATS_Score
        : defaultData.score;
    parsedData.keySkills = analysisObj.Key_Skills || defaultData.keySkills;
    parsedData.resumeStrengths =
      analysisObj.Resume_Strength || defaultData.resumeStrengths;
    parsedData.recommendations =
      analysisObj.Suggestions_for_Improvement || defaultData.recommendations;
    parsedData.achievements = analysisObj.Achievements_or_Certifications || [];
    if (analysisObj.Summary && Array.isArray(analysisObj.Summary)) {
      parsedData.resumeSummary = analysisObj.Summary.join(" ");
      parsedData.detailedImprovements.resumeSummaryDetailed =
        analysisObj.Summary.join(" ");
    }
    if (
      analysisObj.Missing_Keywords &&
      typeof analysisObj.Missing_Keywords === "object"
    ) {
      parsedData.missingKeywords = [
        ...(analysisObj.Missing_Keywords.EXPERIENCE
          ? [analysisObj.Missing_Keywords.EXPERIENCE]
          : []),
        ...(analysisObj.Missing_Keywords.PROJECTS
          ? [analysisObj.Missing_Keywords.PROJECTS]
          : []),
        ...(analysisObj.Missing_Keywords.SUMMARY
          ? [analysisObj.Missing_Keywords.SUMMARY]
          : []),
        ...(analysisObj.Missing_Keywords.SKILLS
          ? [analysisObj.Missing_Keywords.SKILLS]
          : []),
      ].filter(Boolean);
    }
    if (
      analysisObj.Score_Breakdown &&
      typeof analysisObj.Score_Breakdown === "object"
    ) {
      parsedData.detailedImprovements = {
        format:
          analysisObj.Score_Breakdown.FORMAT !== undefined
            ? parseInt(analysisObj.Score_Breakdown.FORMAT) || 0
            : defaultData.detailedImprovements.format,
        skills:
          analysisObj.Score_Breakdown.SKILLS !== undefined
            ? parseInt(analysisObj.Score_Breakdown.SKILLS) || 0
            : defaultData.detailedImprovements.skills,
        experience:
          analysisObj.Score_Breakdown.EXPERIENCE !== undefined
            ? parseInt(analysisObj.Score_Breakdown.EXPERIENCE) || 0
            : defaultData.detailedImprovements.experience,
        education:
          analysisObj.Score_Breakdown.EDUCATION !== undefined
            ? parseInt(analysisObj.Score_Breakdown.EDUCATION) || 0
            : defaultData.detailedImprovements.education,
        resumeSummaryDetailed: parsedData.resumeSummary,
      };
    }
    parsedData.improvementAreas = [
      {
        area: "Missing Keywords",
        description:
          parsedData.missingKeywords.length > 0
            ? `Your resume is missing some keywords in ${parsedData.missingKeywords.join(
                ", "
              )}`
            : defaultData.improvementAreas[0].description,
      },
      {
        area: "Achievements or Certifications",
        description:
          parsedData.achievements.length > 0
            ? "Consider adding more quantifiable achievements"
            : "No achievements or certifications listed",
      },
    ];
  }
 
  return parsedData;
};
 
export default function AtsScorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisData, analysisId } = location.state || {
    analysisData: {},
    analysisId: null,
  };
  const { t } = useTranslation();
 
  // Initialize userData with parsed analysisData
  const [userData, setUserData] = useState(() =>
    parseAnalysisData(analysisData.analysis || [])
  );
  // Update userData if analysisData changes (e.g., due to navigation back)
  useEffect(() => {
    setUserData(parseAnalysisData(analysisData.analysis || []));
  }, [analysisData]);
  // Update color classes to handle 0% score
  const scoreColorClass =
    userData.score >= 80
      ? "text-green-600"
      : userData.score >= 60
      ? "text-gray-800"
      : "text-red-600";
 
  const scoreGaugeColor =
    userData.score >= 80
      ? "#10B981"
      : userData.score >= 60
      ? "#1742d1"
      : "#EF4444";
 
  const handleUpgradeResume = () => {
    if (!analysisId) {
      alert("Please analyze your resume first to get an analysis ID.");
      return;
    }
    console.log("Navigating to resume templates with analysisId:", analysisId); // Debug log
    navigate("/resume_template", { state: { analysisId } }); // Pass analysisId to TemplateCardList
  };
 
  const handleJobRecommendations = () => {
    navigate("/job_recommendations");
  };
 
  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {t('ats_resume_score')}
        </h1>
        <p className="text-6xl pt-5 text-center text-white mb-8 font-bold">
          {t('resume_score_in')}
        </p>
 
        {/* Score Card */}
        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div
              className="p-8 flex flex-col items-center justify-center md:w-1/3 border-r border-gray-200"
              style={{ backgroundColor: "#e5f3ff" }}
            >
              <div className="text-xl font-medium text-gray-900">
                {t('your_resume_score')}
              </div>
              <div className="mt-6 relative">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={scoreGaugeColor}
                    strokeWidth="9"
                    strokeDasharray={`${Math.max(
                      userData.score * 2.83,
                      0.1
                    )} 283`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${scoreColorClass}`}>
                    {userData.score || 0}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {t('ats_score')}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-800 text-center">
                {userData.score >= 80
                  ? t('excellent_match')
                  : userData.score >= 60
                  ? t('good_match')
                  : userData.score > 0
                  ? t('needs_improvement')
                  : t('critical_improvements')}
              </div>
              <button
                onClick={handleUpgradeResume}
                className="px-8 py-3 mt-6 bg-blue-900 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors"
                disabled={!analysisId}
              >
                {t('upgrade_resume')}
              </button>
            </div>
 
            <div
              className="p-8 md:w-2/3"
              style={{ backgroundColor: "#0a0a0a" }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userData.keySkills && userData.keySkills.length > 0 ? (
                    userData.keySkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      No key skills identified
                    </span>
                  )}
                </div>
              </div>
 
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Resume Strengths
                </h3>
                <ul className="list-disc pl-5 text-gray-300">
                  {userData.resumeStrengths &&
                  userData.resumeStrengths.length > 0 ? (
                    userData.resumeStrengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))
                  ) : (
                    <li className="text-gray-400">No strengths identified</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
 
        {/* Detailed Areas for Improvement Section */}
        <div className="bg-black rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <h1 className="text-5xl font-bold text-white mb-6">
              Areas for Improvement
            </h1>
            <p className="text-lg text-gray-300 mb-10">
              We have analyzed your resume and identified key areas where
              enhancements can make a stronger impact:
            </p>
 
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-10 px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">Format</h3>
                  <div className="w-24 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-800">
                      {userData.detailedImprovements.format || 0}%
                    </span>
                  </div>
                </div>
 
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">Skills</h3>
                  <div className="w-24 h-12 bg-red-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-800">
                      {userData.detailedImprovements.skills || 0}%
                    </span>
                  </div>
                </div>
 
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">Experience</h3>
                  <div className="w-24 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-800">
                      {userData.detailedImprovements.experience || 0}%
                    </span>
                  </div>
                </div>
 
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">Education</h3>
                  <div className="w-24 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-800">
                      {userData.detailedImprovements.education || 0}%
                    </span>
                  </div>
                </div>
              </div>
 
              <div
                className="bg-gray-900 rounded-lg p-6"
                style={{ backgroundColor: "#0a0a0a" }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Resume Summary
                </h2>
                <div className="pb-4">
                  <p className="text-gray-300 p-2">
                    {userData.detailedImprovements.resumeSummaryDetailed ||
                      "No summary available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Missing Keywords & Achievements Section */}
        <div
          className="bg-black-400 bg-opacity-40 rounded-xl shadow-md overflow-hidden mb-8"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Missing Keywords Section */}
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Missing Keywords
                </h3>
                {userData.missingKeywords &&
                userData.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.missingKeywords.map((keyword, index) => (
                      <li key={index} className="text-gray-300">
                        {keyword}
                      </li>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">
                    No missing keywords identified
                  </p>
                )}
              </div>
 
              {/* Achievements Section */}
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Achievements & Certifications
                </h3>
                {userData.achievements && userData.achievements.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {userData.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-300">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">
                    No achievements or certifications listed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
 
        {/* Suggestions For Improvement */}
        <div
          className="bg-gray-900 rounded-xl shadow-md overflow-hidden"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="p-6">
            <h2 className="text-4xl font-semibold text-white mb-6">
              Suggestions For Improvement
            </h2>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-300">
              {userData.recommendations &&
              userData.recommendations.length > 0 ? (
                userData.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))
              ) : (
                <li className="text-gray-400">No suggestions available</li>
              )}
            </ul>
            <div className="mt-8 bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Pro Tip</h3>
              <p className="text-blue-700">
                For the best results, tailor your resume for each job
                application. Focus on including the most relevant skills and
                experiences that match the specific job description.
              </p>
            </div>
          </div>
        </div>
 
        {/* CloudNexus Section */}
        <div
          className="mt-16 bg-gray-900 rounded-xl shadow-md overflow-hidden p-6"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-5xl font-bold text-white mb-4 inline">
                Craft your resume with CloudNexus
              </h2>
              <div className="mt-8 flex space-x-8">
                <button
                  className="px-8 py-4 bg-blue-800 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-colors"
                  onClick={handleUpgradeResume}
                >
                  Upgrade your Resume
                </button>
                <button
                  className="px-8 py-4 bg-blue-800 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-colors"
                  onClick={handleJobRecommendations}
                >
                  Job Recommendations
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-end">

            <OrbWithText 
  text="I am here for you"           // Text to display
  textColor="white"          // Text color
  textSize="1.5rem"          // Font size
  fontWeight="600"           // Font weight
  hue={18}                  // Color hue
  hoverIntensity={0.5}       // Hover distortion intensity
  rotateOnHover={true}       // Enable rotation on hover
  forceHoverState={false}    // Force hover state
/>
</div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}