import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
 
const ImproveResume2 = () => {
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
 
  const convertToBulletPoints = (text) => {
    if (!text || typeof text !== "string") return [];
 
    const sentences = text
      .split(/(?<=[.!?])\s+|(?<=[.!?])$|\n/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
 
    return sentences;
  };
 
  const convertToResumeDataFormat = (apiData) => {
    if (!apiData || typeof apiData !== "object" || !apiData.improved_resume) {
      console.error("Invalid or missing API data:", apiData);
      return {
        pages: [
          {
            header: { name: "Your Name", contact: "", linkedin: "https://linkedin.com/in/your-profile" },
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
          header: {
            name: improvedResume["Contact_Information"]?.Name || "Your Name",
            contact:
              (improvedResume["Contact_Information"]?.Phone || "") +
              ", " +
              (improvedResume["Contact_Information"]?.Email || ""),
            linkedin:
              improvedResume["Contact_Information"]?.Github ||
              improvedResume["Contact_Information"]?.Linkedin ||
              "https://linkedin.com/in/your-profile",
          },
          sections: formattedSections,
        },
      ],
    };
  };
 
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
 
    const resumeElement = document.querySelector(".bg-white.max-w-5xl.w-full.rounded-lg.shadow-xl.p-8");
    if (!resumeElement) {
      console.error("Resume content element not found");
      setIsDownloading(false);
      return;
    }
    const clonedResumeElement = resumeElement.cloneNode(true);
 
    const elementsToRemove = clonedResumeElement.querySelectorAll(
      "button, select, .group-hover\\:opacity-100, .opacity-0, input, textarea, .mt-8.flex.justify-center, .mt-8.flex.flex-col"
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
          padding: 2mm !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          background: #FFFFFF !important;
        }
        .bg-white.max-w-5xl.w-full.rounded-lg.shadow-xl.p-8 {
          max-width: 100% !important;
          width: 100% !important;
          padding: 2mm !important;
          margin: 0 !important;
          background: #FFFFFF !important;
          flex-grow: 1;
          box-shadow: none !important;
          border-radius: 0 !important;
          position: relative;
        }
        h2 {
          font-size: 20pt !important;
          font-weight: bold !important;
          color: #15803D !important;
          border-bottom: 2pt solid #DCFCE7 !important;
          padding-bottom: 2pt !important;
          margin: 0 !important;
        }
        p, li {
          font-size: 10pt !important;
          line-height: 1.5 !important;
        }
        .mb-6 {
          margin-bottom: 12pt !important;
        }
        .mt-3 {
          margin-top: 6pt !important;
        }
        .text-gray-900 {
          color: #111827 !important;
        }
        .text-green-800 {
          color: #15803D !important;
        }
        .border-green-200 {
          border-color: #DCFCE7 !important;
        }
        .font-semibold {
          font-weight: 600 !important;
        }
        .font-bold {
          font-weight: 700 !important;
        }
        ul.list-disc {
          list-style: disc !important;
          padding-left: 20pt !important;
          margin-left: 20pt !important;
        }
        .ml-6 {
          margin-left: 18pt !important;
        }
        .ml-4 {
          margin-left: 12pt !important;
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
          stroke: #1E3A8A !important;
        }
        .border-gray-300 {
          border-color: #D1D5DB !important;
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
    setEditingIndex(index);
    setEditTitle(title || resumeData.pages[currentPage].sections[sectionKey]?.title || "");
 
    const section = resumeData.pages[currentPage].sections[sectionKey];
    if (section.type === "list" && sectionKey !== "<strong>Work Experience</strong>" && sectionKey !== "<strong>Projects</strong>") {
      // For simple list sections like Skills, join the items with newlines
      setEditContent(Array.isArray(content) ? content.join("\n") : content);
    } else if (sectionKey === "<strong>Work Experience</strong>" || sectionKey === "<strong>Projects</strong>") {
      // For complex sections, convert the structured content to a string representation
      const contentArray = Array.isArray(content) ? content : [content];
      const formattedContent = contentArray
        .map((item) => {
          if (Array.isArray(item)) {
            return item
              .map((field) => {
                if (field.type === "description") {
                  return field.value.join("\n");
                }
                return field.value;
              })
              .join("\n");
          }
          return item;
        })
        .join("\n\n");
      setEditContent(formattedContent);
    } else {
      setEditContent(content);
    }
  };
 
  const saveChanges = (sectionKey) => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const currentSections = updatedPages[currentPage].sections;
 
    if (sectionKey === "header") {
      const [contact, linkedin] = editContent.split("\n");
      updatedPages[currentPage].header = {
        contact: contact || updatedPages[currentPage].header?.contact,
        linkedin: linkedin || updatedPages[currentPage].header?.linkedin,
      };
    } else if (currentSections[sectionKey].type === "text" || currentSections[sectionKey].type === "contact") {
      currentSections[sectionKey].content = editContent.split("\n").filter((item) => item.trim() !== "");
      currentSections[sectionKey].title = editTitle || currentSections[sectionKey].title;
    } else if (currentSections[sectionKey].type === "list") {
      if (sectionKey === "<strong>Work Experience</strong>" || sectionKey === "<strong>Projects</strong>") {
        // Preserve the complex structure for Work Experience and Projects
        const entries = editContent.split("\n\n").map((entry) => {
          const lines = entry.split("\n").filter((line) => line.trim());
          const result = [];
          let description = [];
          lines.forEach((line, idx) => {
            if (idx === 0) {
              result.push({ type: "title", value: line });
            } else if (idx === 1) {
              result.push({ type: "field", value: line });
            } else {
              description.push(line);
            }
          });
          if (description.length > 0) {
            result.push({ type: "description", value: description });
          }
          return result;
        });
        currentSections[sectionKey].content = entries;
      } else {
        // For simple list sections like Skills
        currentSections[sectionKey].content = editContent.split("\n").filter((item) => item.trim() !== "");
      }
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
    <div className="bg-white rounded-lg shadow-md p-2 flex items-center space-x-2 z-20">
      <button className="p-2 hover:bg-blue-100 rounded" onClick={() => applyFormatting("bold")} title="Bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E3A8A"
          strokeWidth="2"
        >
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button className="p-2 hover:bg-blue-100 rounded" onClick={() => applyFormatting("italic")} title="Italic">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E3A8A"
          strokeWidth="2"
        >
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button className="p-2 hover:bg-blue-100 rounded" onClick={() => applyFormatting("underline")} title="Underline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E3A8A"
          strokeWidth="2"
        >
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>
      <button className="p-2 hover:bg-blue-100 rounded" onClick={() => applyFormatting("circle")} title="Circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E3A8A"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </button>
      <button className="p-2 hover:bg-blue-100 rounded" onClick={() => applyFormatting("box")} title="Box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1E3A8A"
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
      case "text":
      case "hobbies":
      case "certifications":
      case "achievements":
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
      header: {},
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
          <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
        {error.includes("404") && (
          <p className="text-gray-600 mt-2">
            The analysis ID may be invalid or the server endpoint is unavailable. Please verify the ID or contact support.
          </p>
        )}
        {error.includes("Invalid or missing") && (
          <p className="text-gray-600 mt-2">Check the URL or re-analyze your resume.</p>
        )}
        {error.includes("Server error") && (
          <p className="text-gray-600 mt-2">There was a server issue. Please try again later or contact support.</p>
        )}
      </div>
    );
  }
 
  const renderSection = (sectionKey, sectionData) => {
    if (!sectionData || !sectionData.content) return null;
 
    if (sectionData.type === "text") {
      return (
        <section key={sectionKey} className="mb-6 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-1"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            ></h2>
            {editingSection !== sectionKey && (
              <div className="flex space-x-2">
                <button
                  onClick={() => startEditing(sectionKey, sectionData.content, sectionData.title)}
                  className="opacity-0 group-hover:opacity-100 text-blue-800 hover:text-blue-900 px-3 py-1 bg-white shadow-sm rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeSection(sectionKey)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 px-3 py-1 bg-white shadow-sm rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {editingSection === sectionKey ? (
            <div className="relative mt-3">
              <div className="absolute -top-12 right-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-2 p-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full h-40 p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p
                className="text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sectionData.content }}
              ></p>
            </div>
          )}
        </section>
      );
    } else if (sectionData.type === "contact") {
      const contentArray = Array.isArray(sectionData.content) ? sectionData.content : [sectionData.content];
      return (
        <section key={sectionKey} className="mb-6 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-1"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            ></h2>
            {editingSection !== sectionKey && (
              <div className="flex space-x-2">
                <button
                  onClick={() => startEditing(sectionKey, contentArray.join("\n"), sectionData.title)}
                  className="opacity-0 group-hover:opacity-100 text-blue-800 hover:text-blue-900 px-3 py-1 bg-white shadow-sm rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeSection(sectionKey)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 px-3 py-1 bg-white shadow-sm rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {editingSection === sectionKey ? (
            <div className="relative mt-3">
              <div className="absolute -top-12 right-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-2 p-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full h-40 p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              {contentArray.map((item, index) => (
                <p
                  key={index}
                  className="text-gray-900 leading-relaxed"
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
        <section key={sectionKey} className="mb-6 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-1"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            ></h2>
            {editingSection !== sectionKey && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    startEditing(
                      sectionKey,
                      contentArray,
                      sectionData.title
                    )
                  }
                  className="opacity-0 group-hover:opacity-100 text-blue-800 hover:text-blue-900 px-3 py-1 bg-white shadow-sm rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeSection(sectionKey)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 px-3 py-1 bg-white shadow-sm rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {editingSection === sectionKey ? (
            <div className="relative mt-3">
              <div className="absolute -top-12 right-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-2 p-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full h-40 p-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              {sectionKey === "<strong>Work Experience</strong>" || sectionKey === "<strong>Projects</strong>" ? (
                <div className="space-y-4">
                  {contentArray.map((item, index) => (
                    <div key={index} className="ml-4">
                      {Array.isArray(item) ? (
                        item.map((field, idx) => (
                          <div key={idx}>
                            {field.type === "title" && (
                              <p
                                className="font-semibold text-gray-900"
                                dangerouslySetInnerHTML={{ __html: field.value }}
                              ></p>
                            )}
                            {field.type === "field" && (
                              <p
                                className="text-gray-900 font-bold"
                                dangerouslySetInnerHTML={{ __html: field.value }}
                              ></p>
                            )}
                            {field.type === "description" && (
                              <ul className="list-disc list-outside ml-6 mt-1 space-y-1">
                                {(Array.isArray(field.value) ? field.value : field.value.split(/(?<=[\w\s]),\s*(?=\w)/)).map((desc, descIdx) => (
                                  <li
                                    key={descIdx}
                                    className="text-gray-900"
                                    dangerouslySetInnerHTML={{ __html: desc }}
                                  ></li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      ) : (
                        <p
                          className="text-gray-900"
                          dangerouslySetInnerHTML={{ __html: item }}
                        ></p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc list-outside ml-6 space-y-2">
                  {contentArray.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-900"
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
    <div className="min-h-screen bg-black flex flex-col items-center p-6 py-20">
      {resumeData?.pages.map((page, pageIndex) => (
        currentPage === pageIndex && (
          <div key={pageIndex} className="bg-white max-w-5xl w-full rounded-lg shadow-xl p-8">
            {Object.entries(page.sections).map(([key, section]) => renderSection(key, section))}
            <div className="mt-8 flex justify-center">
              <button
                onClick={openPrintDialog}
                disabled={isDownloading}
                className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                  isDownloading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDownloading ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedSectionType}
                onChange={(e) => setSelectedSectionType(e.target.value)}
                className="px-4 py-2 bg-white text-gray-900 border border-blue-800 rounded-lg hover:bg-blue-100"
              >
                <option value="text">Text</option>
                <option value="achievements">Achievements</option>
                <option value="hobbies">Hobbies</option>
                <option value="certifications">Certifications</option>
                <option value="languages">Languages</option>
              </select>
              <button
                onClick={addNewSection}
                className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
              >
                Add New Section
              </button>
              {history.length > 0 && (
                <button
                  onClick={undoLastAction}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Undo Last Action
                </button>
              )}
            </div>
          </div>
        )
      ))}
      <div className="flex space-x-4 mt-6">
        {resumeData?.pages.length > 1 &&
          resumeData.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              Page {index + 1}
            </button>
          ))}
        <button
          onClick={addNewPage}
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
        >
          Add New Page
        </button>
      </div>
    </div>
  );
};
 
export default React.memo(ImproveResume2);