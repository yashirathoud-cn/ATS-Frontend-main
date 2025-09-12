import { Terminal } from "lucide-react";
import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
 
const ImproveResume4 = () => {
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
  const [pdfGenerating, setPdfGenerating] = useState(false);
 
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
        sectionType = key === "<strong>Contact Information</strong>" ? "contact" : "list";
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
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null
              ? Object.values(item).filter((value) => value !== undefined)
              : item
          );
        } else {
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null ? Object.values(item).join("<br>") : item
          );
        }
      } else if (typeof content === "object" && content !== null) {
        sectionType = key === "<strong>Contact Information</strong>" ? "contact" : "list";
        if (key === "<strong>Contact Information</strong>") {
          formattedContent = Object.values(content).filter((value) => value !== undefined);
        } else {
          formattedContent = Object.entries(content)
            .map(([k, v]) => `${k}: ${v}`)
            .filter(Boolean);
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
 
  // Fetch improved resume data with multi-fetch prevention
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
      console.log("Cleanup: isMounted set to false");
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
    setPdfGenerating(true);
 
    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.position = "absolute";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.width = "210mm";
    printContainer.style.height = "297mm";
    printContainer.style.background = "white";
 
    const resumeElement = document
      .querySelector(".bg-white.max-w-4xl.w-full.p-8.rounded-xl.shadow-lg")
      .cloneNode(true);
 
    const elementsToRemove = resumeElement.querySelectorAll(
      "button, select, .group-hover\\:opacity-100, .opacity-0, input, textarea"
    );
    elementsToRemove.forEach((element) => element.remove());
 
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0;
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
          width: 210mm;
          height: 297mm;
          font-family: Arial, sans-serif;
          color: #1f2937 !important;
          padding: 5mm;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          background: #ffffff !important;
        }
        .bg-white.max-w-4xl.w-full.p-8.rounded-xl.shadow-lg {
          max-width: 100% !important;
          width: 100% !important;
          padding: 5mm !important;
          margin: 0 !important;
          background: #ffffff !important;
          flex-grow: 1;
          box-shadow: none !important;
          position: relative;
        }
        .absolute.top-0.left-0.w-full.h-8.bg-blue-600.rounded-t-xl {
          background: #1d4ed8 !important;
          width: 100% !important;
          height: 24pt !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-top-left-radius: 8pt !important;
          border-top-right-radius: 8pt !important;
        }
        h1 {
          font-size: 28pt !important;
          font-weight: bold !important;
          color: #1e3a8a !important;
        }
        h2 {
          font-size: 24pt !important;
          font-weight: bold !important;
          color: #1e3a8a !important;
          border-bottom: 2pt solid #bfdbfe !important;
          padding-bottom: 4pt !important;
          margin-bottom: 8pt !important;
        }
        p, li {
          font-size: 10pt !important;
          line-height: 1.5 !important;
        }
        .mt-8 {
          margin-top: 16pt !important;
        }
        .text-gray-700 {
          color: #374151 !important;
        }
        .text-gray-800 {
          color: #1f2937 !important;
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
          margin-left: 24pt !important;
        }
        .border-l-2.border-blue-200 {
          border-left: 2pt solid #bfdbfe !important;
        }
        .pl-2 {
          padding-left: 8pt !important;
        }
        .space-y-2 > * + * {
          margin-top: 8pt !important;
        }
        .space-y-4 > * + * {
          margin-top: 16pt !important;
        }
        svg {
          fill: #1d4ed8 !important;
          stroke: #1d4ed8 !important;
        }
        .text-blue-600 {
          color: #1d4ed8 !important;
        }
        .text-blue-800 {
          color: #1e3a8a !important;
        }
        .border-blue-200 {
          border-color: #bfdbfe !important;
        }
        header, footer, ::-webkit-print-header-footer {
          display: none !important;
        }
      }
    `;
    printContainer.appendChild(style);
    printContainer.appendChild(resumeElement);
    document.body.appendChild(printContainer);
 
    const mainContent = document.querySelector("body > *:not(#print-container)");
    if (mainContent) mainContent.style.display = "none";
 
    window.print();
 
    document.body.removeChild(printContainer);
    if (mainContent) mainContent.style.display = "";
    setPdfGenerating(false);
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
 
    if (sectionKey === "header") {
      const [contact, linkedin] = editContent.split("\n");
      updatedPages[currentPage].header = {
        name: updatedPages[currentPage].header.name, // Preserve the existing name
        contact: contact || updatedPages[currentPage].header?.contact,
        linkedin: linkedin || updatedPages[currentPage].header?.linkedin,
      };
    } else if (currentSections[sectionKey].type === "text" || currentSections[sectionKey].type === "contact") {
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
    <div className="bg-white rounded shadow-md p-2 inline-flex items-center space-x-1 z-20">
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("bold")}
        title="Bold"
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
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("italic")}
        title="Italic"
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
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("list")}
        title="List"
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
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("bullet")}
        title="Bullet"
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
          <circle cx="12" cy="12" r="1"></circle>
        </svg>
      </button>
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("circle")}
        title="Circle"
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
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </button>
      <button
        className="p-1.5 hover:bg-gray-100 rounded-full"
        onClick={() => applyFormatting("box")}
        title="Box"
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
      case "experience":
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
 
  const renderSection = (sectionKey, sectionData) => {
    // Skip rendering Contact Information section
    if (sectionKey === "<strong>Contact Information</strong>" || sectionData.type === "contact") {
      return null;
    }
 
    if (!sectionData) return null;
 
    if (sectionData.type === "text") {
      return (
        <section key={sectionKey} className="mt-8 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            ></h2>
            {editingSection !== sectionKey && (
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() =>
                    startEditing(sectionKey, sectionData.content, sectionData.title)
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
          {editingSection === sectionKey ? (
            <div className="relative mt-4">
              <div className="absolute -top-12 right-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="ml-3 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-gray-700 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: sectionData.content }}></p>
            </div>
          )}
        </section>
      );
    } else if (sectionData.type === "list") {
      return (
        <section key={sectionKey} className="mt-8 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            ></h2>
            {editingSection !== sectionKey && (
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() =>
                    startEditing(
                      sectionKey,
                      sectionData.content
                        .map((item) =>
                          Array.isArray(item)
                            ? item.map((i) => i.value || i).join("\n")
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
          {editingSection === sectionKey ? (
            <div className="relative mt-4">
              <div className="absolute -top-12 left-0">
                <EditToolbar />
              </div>
              <input
                type="text"
                className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter section title"
              />
              <textarea
                id="editTextarea"
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => saveChanges(sectionKey)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setEditTitle("");
                  }}
                  className="ml-3 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-gray-700">
              {sectionKey === "<strong>Work Experience</strong>" || sectionKey === "<strong>Projects</strong>" ? (
                <ul className="list-disc list-outside ml-6 space-y-4">
                  {sectionData.content.map((item, index) => (
                    <li key={index} className="pl-2">
                      {item.map((field, idx) => (
                        <div key={idx} className="mb-2">
                          {field.type === "title" && (
                            <p
                              className="font-semibold text-gray-800"
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
                            <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                              {field.value.map((desc, descIdx) => (
                                <li
                                  key={descIdx}
                                  className="text-gray-700"
                                  dangerouslySetInnerHTML={{ __html: desc }}
                                ></li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc list-outside ml-6 space-y-2">
                  {sectionData.content.map((item, index) => (
                    <li
                      key={index}
                      className="pl-2 border-l-2 border-blue-200"
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
 
  if (loading) {
    return (
      <div className="min-h-screen bg-black from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-600 font-medium">Preparing your resume...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-black from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
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
          <p className="text-gray-600 mt-2 text-center max-w-md">
            Check the URL or re-analyze your resume.
          </p>
        )}
        {error.includes("Server error") && (
          <p className="text-gray-600 mt-2 text-center max-w-md">
            There was a server issue. Please try again later or contact support.
          </p>
        )}
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-black from-blue-50 to-blue-100 flex flex-col items-center p-4 py-16">
      {resumeData?.pages.map((page, pageIndex) =>
        currentPage === pageIndex && (
          <div
            key={pageIndex}
            className="bg-white max-w-4xl w-full p-8 rounded-xl shadow-lg text-gray-800 mb-8 relative"
          >
            <div className="absolute top-0 left-0 w-full h-8 bg-blue-600 rounded-t-xl"></div>
            <div className="mt-8">
              <h1 className="text-3xl font-bold text-blue-800">{page.header.name}</h1>
              <p className="text-gray-700">{page.header.contact}</p>
              <p className="text-gray-700">
                <a href={page.header.linkedin} target="_blank" rel="noopener noreferrer">
                  {page.header.linkedin}
                </a>
              </p>
              {editingSection === "header" ? (
                <div className="relative mt-4">
                  <div className="absolute -top-12 right-0">
                    <EditToolbar />
                  </div>
                  <textarea
                    id="editTextarea"
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Enter contact and LinkedIn (one per line)"
                  />
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => saveChanges("header")}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingSection(null);
                        setEditTitle("");
                      }}
                      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("header", `${page.header.contact}\n${page.header.linkedin}`)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full text-sm font-medium transition-colors duration-200 mt-2"
                >
                  Edit Header
                </button>
              )}
            </div>
            <div className="mt-8">
              {page.sections &&
                Object.entries(page.sections).map(([key, section]) =>
                  renderSection(key, section)
                )}
            </div>
          </div>
        )
      )}
 
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mb-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <button
              onClick={addNewSection}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
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
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="text">Text</option>
              <option value="experience">Experience</option>
              <option value="achievements">Achievements</option>
              <option value="certifications">Certifications</option>
              <option value="hobbies">Hobbies</option>
              <option value="languages">Languages</option>
            </select>
          </div>
 
          <div className="flex flex-wrap items-center space-x-3">
            <button
              onClick={openPrintDialog}
              disabled={pdfGenerating}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:bg-blue-400"
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
                <path d="M6 9V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7"></path>
                <rect x="6" y="14" width="12" height="8" rx="1"></rect>
                <path d="M6 18h12"></path>
              </svg>
              {pdfGenerating ? "Preparing PDF..." : "Download PDF"}
            </button>
            {resumeData?.pages.length > 1 && (
              <div className="flex items-center space-x-2 mr-3">
                {resumeData.pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={addNewPage}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
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
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
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
                  <path d="M3 7v6h6"></path>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
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
 
export default memo(ImproveResume4);
 