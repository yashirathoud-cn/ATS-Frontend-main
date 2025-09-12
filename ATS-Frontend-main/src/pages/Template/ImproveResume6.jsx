import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
 
const ImproveResume6 = () => {
  const { analysisId } = useParams();
  console.log("Fetching improved resume with analysisId:", analysisId || "undefined");
 
  const [resumeData, setResumeData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedSectionType, setSelectedSectionType] = useState("text");
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
 
  const API_BASE_URL = import.meta.env.VITE_RESUME_API_DATA_URL;
 
  // Helper function to convert paragraph text to bullet points
  const convertToBulletPoints = (text) => {
    if (!text || typeof text !== "string") return [];
 
    const sentences = text
      .split(/(?<=[.!?])\s+|(?<=[.!?])$|\n/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
 
    return sentences;
  };
 
  // Convert API data to resume data format
  const convertToResumeDataFormat = (apiData) => {
    if (!apiData || typeof apiData !== "object" || !apiData.improved_resume) {
      console.error("Invalid or missing API data:", apiData);
      return {
        pages: [
          {
            sections: {},
          },
        ],
      };
    }
 
    const improvedResume = apiData.improved_resume || {};
    const suggestions = apiData.suggestions || [];
 
    const boldKey = (key) => `<strong>${key}</strong>`;
    const boldValue = (value, key) => (["Name", "Title", "Role"].includes(key) ? `<strong>${value}</strong>` : value);
 
    const transformedResume = {};
    Object.entries(improvedResume).forEach(([key, content]) => {
      const cleanedKey = key.replace(/_/g, " ");
      const boldedKey = boldKey(cleanedKey);
 
      if (Array.isArray(content)) {
        transformedResume[boldedKey] = content.map((item) =>
          typeof item === "object" && item !== null
            ? Object.fromEntries(
                Object.entries(item).map(([k, v]) => [boldKey(k), boldValue(v, k)])
              )
            : item
        );
      } else if (typeof content === "object" && content !== null) {
        transformedResume[boldedKey] = Object.fromEntries(
          Object.entries(content).map(([k, v]) => [boldKey(k), boldValue(v, k)])
        );
      } else {
        transformedResume[boldedKey] = content;
      }
    });
 
    const formattedSections = {};
    Object.entries(transformedResume).forEach(([key, content]) => {
      let sectionType = "text";
      let formattedContent = content;
      let sectionTitle = key.replace(/<strong>|<\/strong>/g, "");
 
      if (Array.isArray(content)) {
        sectionType = "list";
        if (key === "<strong>Work Experience</strong>" || key === "<strong>Projects</strong>") {
          formattedContent = content.map((item) => {
            if (typeof item === "object" && item !== null) {
              const entries = Object.entries(item);
              let result = [];
              let description = [];
              entries.forEach(([k, v]) => {
                if (k === "<strong>Name</strong>" || k === "<strong>Title</strong>" || k === "<strong>Role</strong>") {
                  result.push({ type: "title", value: v });
                } else if (k === "<strong>Dates</strong>") {
                  result.push({ type: "field", value: v });
                } else if (
                  (k === "<strong>Responsibilities</strong>" || k === "<strong>Description</strong>") &&
                  typeof v === "string"
                ) {
                  description = convertToBulletPoints(v);
                } else if (
                  (k === "<strong>Responsibilities</strong>" || k === "<strong>Description</strong>") &&
                  Array.isArray(v)
                ) {
                  description = v;
                } else if (Array.isArray(v)) {
                  result.push({ type: "field", value: v.join(", ") });
                } else {
                  result.push({ type: "field", value: v });
                }
              });
              if (description.length > 0) {
                result.push({ type: "description", value: description });
              }
              return result;
            }
            return item;
          });
        } else if (key === "<strong>Contact Information</strong>") {
          sectionType = "contact";
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null
              ? Object.values(item).filter((value, idx) => value !== undefined)
              : item
          );
        } else {
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null ? Object.values(item).join("<br>") : item
          );
        }
      } else if (typeof content === "object" && content !== null) {
        if (key === "<strong>Contact Information</strong>") {
          sectionType = "contact";
          formattedContent = Object.values(content).filter((value) => value !== undefined);
        } else {
          sectionType = "list";
          formattedContent = Object.values(content).filter(Boolean);
        }
      } else if (typeof content === "string") {
        sectionType = "text";
        formattedContent = content;
      }
 
      formattedSections[key] = {
        title: sectionTitle,
        content: formattedContent,
        type: sectionType,
      };
    });
 
    if (suggestions.length > 0) {
      formattedSections.suggestions = {
        title: "Suggestions",
        content: suggestions,
        type: "list",
      };
    }
 
    return {
      pages: [
        {
          sections: formattedSections,
        },
      ],
    };
  };
 
  // Fetch improved resume data
  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;
 
    const fetchImprovedResume = async () => {
      if (hasFetched) {
        console.log("Fetch skipped: Already fetched for analysisId:", analysisId);
        return;
      }
 
      console.log("Starting fetch for analysisId:", analysisId);
      if (!analysisId || analysisId === ":analysisId") {
        console.log("Invalid analysisId detected:", analysisId);
        if (isMounted) {
          setError("Invalid or missing analysis ID. Please ensure a valid ID is provided in the URL.");
          setLoading(false);
        }
        return;
      }
 
      try {
        setLoading(true);
        console.log("Sending request to:", `${API_BASE_URL}/direct-improve/${analysisId}`);
        const response = await fetch(`${API_BASE_URL}/direct-improve/${analysisId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
 
        console.log("Response status:", response.status);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Resume not found. The analysis ID may be invalid.");
          } else if (response.status === 500) {
            throw new Error("Server error. Please try again later.");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
 
        const data = await response.json();
        console.log("Improved resume data:", data);
 
        if (isMounted) {
          setResumeData(convertToResumeDataFormat(data));
          hasFetched = true;
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        if (isMounted) {
          setError(`Failed to fetch improved resume: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log("Fetch completed, loading set to false");
        }
      }
    };
 
    fetchImprovedResume();
 
    return () => {
      isMounted = false;
    };
  }, [analysisId]);
 
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
 
    checkMobile();
    window.addEventListener("resize", checkMobile);
 
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
 
  // Function to open print dialog for PDF generation
  const openPrintDialog = () => {
    setIsDownloading(true);
 
    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.position = "absolute";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.width = "210mm";
    printContainer.style.height = "297mm";
    printContainer.style.background = "#FFFFFF";
 
    const resumeElement = document.querySelector(".bg-white.max-w-4xl.w-full.p-6.text-black");
    if (!resumeElement) {
      console.error("Resume content element not found");
      setIsDownloading(false);
      return;
    }
    const clonedResumeElement = resumeElement.cloneNode(true);
 
    const elementsToRemove = clonedResumeElement.querySelectorAll(
      "button, select, .group-hover\\:opacity-100, .opacity-0, input, textarea, .bg-white.p-4.rounded.shadow-lg"
    );
    elementsToRemove.forEach((element) => element.remove());
 
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0 !important;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body * {
          visibility: hidden;
        }
        #print-container, #print-container * {
          visibility: visible;
        }
        #print-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 210mm !important;
          height: 297mm !important;
          font-family: Arial, sans-serif;
          color: #111827 !important;
          padding: 0 !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          background: #FFFFFF !important;
        }
        .bg-white.max-w-4xl.w-full.p-6.text-black {
          max-width: 210mm !important;
          width: 210mm !important;
          padding: 10mm !important;
          margin: 0 auto !important;
          background: #FFFFFF !important;
          flex-grow: 1;
          box-shadow: none !important;
          border-radius: 0 !important;
          position: relative;
          box-sizing: border-box;
        }
        .bg-white.max-w-4xl.w-full.p-6.text-black:first-child {
          padding-bottom: 30mm !important; /* Add gap at the bottom of the first page */
        }
        .bg-white.max-w-4xl.w-full.p-6.text-black:nth-child(2) {
          padding-top: 10mm !important; /* Add gap at the top of the second page */
        }
        section .bg-gray-200 h2 {
          font-size: 16pt !important;
          font-weight: bold !important;
          color: #000000 !important;
          background: #E5E7EB !important;
          padding: 4pt !important;
          margin: 0 !important;
          width: 100% !important;
          text-align: center !important; /* Center-align only section titles */
        }
        p, li, div {
          font-size: 10pt !important;
          line-height: 1.5 !important;
          text-align: left !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .font-semibold {
          font-weight: 600 !important;
        }
        .font-bold {
          font-weight: 700 !important;
        }
        strong {
          font-weight: 700 !important; /* Ensure subheadings (bolded via <strong>) are bold */
        }
        ul.list-disc {
          list-style: disc inside !important;
          padding: 0 !important;
          margin: 0 auto !important;
          text-align: left !important;
          max-width: 180mm !important;
          display: block !important;
        }
        ul.list-disc li {
          text-align: left !important;
          margin: 0 !important;
          display: list-item !important;
          width: auto !important;
        }
        .ml-5 {
          margin-left: 0 !important;
        }
        .space-y-1 > * + * {
          margin-top: 4pt !important;
        }
        .space-y-2 > * + * {
          margin-top: 8pt !important;
        }
        .space-y-4 > * + * {
          margin-top: 16pt !important;
        }
        svg {
          stroke: #000000 !important;
        }
        .border-gray-300 {
          border-color: #D1D5DB !important;
        }
        .text-gray-700 {
          color: #111827 !important;
          text-align: left !important;
        }
        .text-black {
          color: #000000 !important;
          text-align: left !important;
        }
        header, footer, ::-webkit-print-header-footer {
          display: none !important;
        }
      }
    `;
    printContainer.appendChild(style);
    printContainer.appendChild(clonedResumeElement);
    document.body.appendChild(printContainer);
 
    const mainContent = document.querySelector("body > *:not(#print-container)");
    if (mainContent) mainContent.style.display = "none";
 
    window.print();
 
    document.body.removeChild(printContainer);
    if (mainContent) mainContent.style.display = "";
    setIsDownloading(false);
  };
 
  const saveToHistory = () => {
    setHistory([...history, JSON.stringify(resumeData)]);
  };
 
  const startEditing = (sectionKey, content, title = "", index = null) => {
    setEditingSection(sectionKey);
    setEditContent(content);
    setEditTitle(title || resumeData.pages[currentPage].sections[sectionKey]?.title || "");
    setEditingIndex(index);
  };
 
  const saveChanges = (sectionKey) => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const currentSections = updatedPages[currentPage].sections;
 
    if (currentSections[sectionKey].type === "text" || currentSections[sectionKey].type === "contact") {
      currentSections[sectionKey].content = editContent.split("\n").filter((item) => item.trim() !== "");
      currentSections[sectionKey].title = editTitle || currentSections[sectionKey].title;
    } else if (currentSections[sectionKey].type === "list") {
      currentSections[sectionKey].content = editContent.split("\n").filter((item) => item.trim() !== "");
      currentSections[sectionKey].title = editTitle || currentSections[sectionKey].title;
    }
 
    setResumeData({ ...resumeData, pages: updatedPages });
    setEditingSection(null);
    setEditingIndex(null);
    setEditTitle("");
  };
 
  const removeSection = (sectionKey) => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    delete updatedPages[currentPage].sections[sectionKey];
    setResumeData({ ...resumeData, pages: updatedPages });
  };
 
  const undoLastAction = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setResumeData(JSON.parse(lastState));
      setHistory(history.slice(0, -1));
    }
  };
 
  const applyFormatting = (format) => {
    const textarea = document.getElementById("editTextarea");
    if (!textarea) return;
 
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);
 
    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `<strong>${selectedText || "Bold text"}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${selectedText || "Italic text"}</em>`;
        break;
      case "underline":
        formattedText = `<u>${selectedText || "Underlined text"}</u>`;
        break;
      case "list":
        formattedText = selectedText ? "\n• " + selectedText.split("\n").join("\n• ") : "\n• New list item";
        break;
      case "circle":
        formattedText = " ○ " + (selectedText || "");
        break;
      case "box":
        formattedText = " □ " + (selectedText || "");
        break;
      case "bullet":
        formattedText = " • " + (selectedText || "");
        break;
      default:
        formattedText = selectedText;
    }
 
    const newContent = editContent.substring(0, start) + formattedText + editContent.substring(end);
    setEditContent(newContent);
 
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
 
  const EditToolbar = () => (
    <div className="bg-white rounded shadow-md p-2 inline-flex items-center space-x-1 z-20 border border-gray-300">
      <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => applyFormatting("bold")} title="Bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => applyFormatting("italic")} title="Italic">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("underline")}
        title="Underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>
      <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => applyFormatting("list")} title="List">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => applyFormatting("bullet")} title="Bullet">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="1"></circle>
        </svg>
      </button>
      <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => applyFormatting("circle")} title="Circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </button>
      <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => applyFormatting("box")} title="Box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      </button>
    </div>
  );
 
  const addNewSection = () => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const newSectionKey = `custom-${Date.now()}`;
    let defaultContent;
    let sectionType;
 
    switch (selectedSectionType) {
      case "achievements":
      case "certifications":
      case "hobbies":
      case "languages":
        defaultContent = "Enter your content here";
        sectionType = "text";
        break;
      case "list":
        defaultContent = ["Add your items here"];
        sectionType = "list";
        break;
      default:
        defaultContent = "Enter content here";
        sectionType = "text";
    }
 
    updatedPages[currentPage].sections[newSectionKey] = {
      title: selectedSectionType.charAt(0).toUpperCase() + selectedSectionType.slice(1),
      content: defaultContent,
      type: sectionType,
    };
 
    let editContentString;
    if (sectionType === "text") {
      editContentString = defaultContent;
    } else if (sectionType === "list") {
      editContentString = defaultContent.join("\n");
    }
 
    setResumeData({ ...resumeData, pages: updatedPages });
    startEditing(
      newSectionKey,
      editContentString,
      selectedSectionType.charAt(0).toUpperCase() + selectedSectionType.slice(1)
    );
  };
 
  const addNewPage = () => {
    saveToHistory();
    const newPage = {
      sections: {},
    };
    const updatedPages = [...resumeData.pages, newPage];
    setResumeData({ ...resumeData, pages: updatedPages });
    setCurrentPage(updatedPages.length - 1);
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Preparing your resume...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p className="text-red-600 text-lg font-semibold">{error}</p>
        {error.includes("404") && (
          <p className="text-gray-600 mt-2 text-center max-w-md">
            The analysis ID may be invalid or the server endpoint is unavailable. Please verify the ID or contact support.
          </p>
        )}
        {error.includes("Invalid or missing") && (
          <p className="text-gray-600 mt-2 text-center max-w-md">Check the URL or re-analyze your resume.</p>
        )}
        {error.includes("Server error") && (
          <p className="text-gray-600 mt-2 text-center max-w-md">
            There was a server issue. Please try again later or contact support.
          </p>
        )}
      </div>
    );
  }
 
  const renderSection = (sectionKey, sectionData) => {
    if (!sectionData || !sectionData.content) return null;
 
    if (sectionData.type === "text" || sectionData.type === "contact") {
      const contentArray = Array.isArray(sectionData.content) ? sectionData.content : [sectionData.content];
      return (
        <section key={sectionKey} className="mb-4 relative group">
          <div className="bg-gray-200 w-full">
            <div className="flex justify-between items-center">
              <h2
                className="text-lg font-bold text-black p-2 w-full text-center"
                dangerouslySetInnerHTML={{ __html: sectionData.title }}
              ></h2>
              {editingSection !== sectionKey && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-2 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => startEditing(sectionKey, contentArray.join("\n"), sectionData.title)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeSection(sectionKey)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 hover:bg-red-100 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          {editingSection === sectionKey ? (
            <div className="relative mt-2">
              <div className="absolute -top-12 right-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full min-h-32 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black resize-y overflow-auto"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="ml-2 px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed mt-2">
              {contentArray.map((item, index) => (
                <p
                  key={index}
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: item }}
                ></p>
              ))}
            </div>
          )}
        </section>
      );
    } else if (sectionData.type === "list") {
      const contentArray = Array.isArray(sectionData.content) ? sectionData.content : [sectionData.content];
      return (
        <section key={sectionKey} className="mb-4 relative group">
          <div className="bg-gray-200 w-full">
            <div className="flex justify-between items-center">
              <h2
                className="text-lg font-bold text-black p-2 w-full text-center"
                dangerouslySetInnerHTML={{ __html: sectionData.title }}
              ></h2>
              {editingSection !== sectionKey && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-2 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() =>
                      startEditing(
                        sectionKey,
                        contentArray
                          .map((item) =>
                            Array.isArray(item)
                              ? item.map((i) => (i.value ? i.value : i)).join("\n")
                              : item
                          )
                          .join("\n"),
                        sectionData.title
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeSection(sectionKey)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 hover:bg-red-100 rounded-full text-sm font-medium transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          {editingSection === sectionKey ? (
            <div className="relative mt-2">
              <div className="absolute -top-12 right-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full min-h-32 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black resize-y overflow-auto"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="ml-2 px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed mt-2">
              {sectionKey === "<strong>Work Experience</strong>" || sectionKey === "<strong>Projects</strong>" ? (
                <div className="space-y-4">
                  {contentArray.map((item, index) => (
                    <div key={index}>
                      {Array.isArray(item) ? (
                        item.map((field, idx) => (
                          <div key={idx}>
                            {field.type === "title" && (
                              <p
                                className="font-semibold text-black"
                                dangerouslySetInnerHTML={{ __html: field.value }}
                              ></p>
                            )}
                            {field.type === "field" && (
                              <p
                                className="text-gray-700"
                                dangerouslySetInnerHTML={{ __html: field.value }}
                              ></p>
                            )}
                            {field.type === "description" && (
                              <ul className="list-disc mt-1 space-y-1">
                                {(Array.isArray(field.value) ? field.value : field.value.split(/(?<=[\w\s]),\s*(?=\w)/)).map(
                                  (desc, descIdx) => (
                                    <li
                                      key={descIdx}
                                      className="text-gray-700"
                                      dangerouslySetInnerHTML={{ __html: desc }}
                                    ></li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        ))
                      ) : (
                        <p
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{ __html: item }}
                        ></p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc mt-1 space-y-1">
                  {contentArray.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item }}
                    ></li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      );
    }
  };
 
  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 py-20">
      {resumeData?.pages.map((page, pageIndex) => (
        currentPage === pageIndex && (
          <div key={pageIndex} className="bg-white max-w-4xl w-full p-6 text-black">
            {/* Render Sections */}
            <div>
              {page.sections &&
                Object.entries(page.sections).map(([key, section]) => renderSection(key, section))}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={openPrintDialog}
                disabled={isDownloading}
                className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 font-medium ${
                  isDownloading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDownloading ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
          </div>
        )
      ))}
 
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-4xl mb-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <button
              onClick={addNewSection}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Section
            </button>
            <select
              value={selectedSectionType}
              onChange={(e) => setSelectedSectionType(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="achievements">Achievements</option>
              <option value="certifications">Certifications</option>
              <option value="hobbies">Hobbies</option>
              <option value="languages">Languages</option>
            </select>
          </div>
 
          <div className="flex flex-wrap items-center space-x-3">
            {resumeData?.pages.length > 1 && (
              <div className="flex items-center space-x-2 mr-3">
                {resumeData.pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === index ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={addNewPage}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 flex items-center"
              title="Add New Page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Page
            </button>
            {history.length > 0 && (
              <button
                onClick={undoLastAction}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200 flex items-center"
                title="Undo Last Action"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
                Undo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default React.memo(ImproveResume6);