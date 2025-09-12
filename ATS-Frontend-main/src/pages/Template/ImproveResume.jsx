 
import React, { useState, useEffect, memo } from "react";
import { Briefcase, Code, GraduationCap, Star, User, Download } from "lucide-react";
import { useParams } from "react-router-dom";
 
const ImproveResume = () => {
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
  const [selectedSectionType, setSelectedSectionType] = useState("experience");
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
 
  // Convert API data to Template7-compatible structure
  const convertToResumeDataFormat = (apiData) => {
    if (!apiData || typeof apiData !== "object") {
      console.error("Invalid API data:", apiData);
      return {
        pages: [
          {
            header: { name: "Your Name", contact: "", linkedin: "https://linkedin.com/in/your-profile" },
            sections: {},
          },
        ],
      };
    }
 
    const improvedResume = apiData?.improved_resume || {};
    const suggestions = apiData?.suggestions || [];
 
    const boldKey = (key) => `<strong>${key}</strong>`;
    const boldValue = (value, key) => (["Name", "Title", "Project_Name"].includes(key) ? `<strong>${value}</strong>` : value);
 
    const transformedResume = {};
    Object.entries(improvedResume).forEach(([key, content]) => {
      const cleanedKey = key.replace(/_/g, " ");
      const boldedKey = boldKey(cleanedKey);
 
      // Special handling for Skills section to align with JSON structure
      if (key === "Skills" && typeof content === "object" && content !== null) {
        const skillsContent = [];
        Object.entries(content).forEach(([skillCategory, skillItems]) => {
          if (Array.isArray(skillItems)) {
            skillsContent.push({
              type: "category",
              value: skillCategory.replace(/_/g, " "),
              items: skillItems,
            });
          }
        });
        transformedResume[boldedKey] = skillsContent;
      } else if (Array.isArray(content)) {
        transformedResume[boldedKey] = content.map((item) =>
          typeof item === "object" && item !== null
            ? Object.fromEntries(Object.entries(item).map(([k, v]) => [boldKey(k), boldValue(v, k)]))
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
 
      if (key === "<strong>Skills</strong>") {
        sectionType = "skills";
        formattedContent = content; // Already formatted as categories with items
      } else if (Array.isArray(content)) {
        sectionType = "list";
        if (key === "<strong>Work Experience</strong>") {
          formattedContent = content.map((item) => {
            if (typeof item === "object" && item !== null) {
              const entries = Object.entries(item);
              let result = [];
              let description = [];
              entries.forEach(([k, v]) => {
                if (k === "<strong>Name</strong>" || k === "<strong>Title</strong>" || k === "<strong>Role</strong>") {
                  result.push({ type: "title", value: `<strong>${v}</strong>` });
                } else if (k === "<strong>Dates</strong>") {
                  result.push({ type: "field", value: v });
                } else if (k === "<strong>Project_Name</strong>") {
                  result.push({ type: "field", value: `<strong>${v}</strong>` });
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
        } else if (key === "<strong>Education</strong>") {
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null ? Object.values(item).join("<br>") : item
          );
        } else {
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null ? Object.values(item).join("<br>") : item
          );
        }
      } else if (typeof content === "object" && content !== null) {
        sectionType = "list";
        formattedContent = Object.values(content).filter(Boolean);
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
            contact:
              (improvedResume["Contact_Information"]?.Phone || "") +
              ", " +
              (improvedResume["Contact_Information"]?.Email || ""),
            linkedin:
              improvedResume["Contact_Information"]?.Github ||
              "https://linkedin.com/in/your-profile",
          },
          sections: formattedSections,
        },
      ],
    };
  };
 
  // Fetch improved resume data with multiple fetch prevention
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
 
        const data = await response.json();
        console.log("Raw API data:", data);
        if (isMounted) {
          setResumeData(convertToResumeDataFormat(data));
          hasFetched = true;
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        if (isMounted) {
          setError(`Failed to fetch improved resume: ${err.message}. Check the analysis ID or server status.`);
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
 
    const resumeElement = document.getElementById("resume-content").cloneNode(true);
 
    const elementsToRemove = resumeElement.querySelectorAll(".opacity-0, button, select, .group-hover\\:opacity-100");
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
          padding: ${isMobile ? "5mm 2" : "10mm 2"};
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          background: #ffffff !important;
        }
        #print-container h3 {
          font-size: 12pt !important;
          font-weight: 600 !important;
          margin-top: 8pt !important;
          margin-bottom: 4pt !important;
          color: #1f2937 !important;
        }
        #resume-content {
          max-width: 100% !important;
          width: 100% !important;
          padding: ${isMobile ? "2mm" : "4mm"} !important;
          margin: 0 !important;
          background: #ffffff !important;
          flex-grow: 1;
          box-shadow: none !important;
        }
        h1 {
          font-size: 24pt !important;
          font-weight: bold !important;
          text-align: center !important;
          margin-bottom: 16pt !important;
          color: #1f2937 !important;
        }
        h2 {
          font-size: 14pt !important;
          font-weight: 600 !important;
          border-bottom: 1pt solid #000000 !important;
          padding-bottom: 4pt !important;
          margin-top: 16pt !important;
          margin-bottom: 8pt !important;
          display: flex !important;
          align-items: center !important;
          color: #1f2937 !important;
        }
        p, li {
          font-size: 10pt !important;
          line-height: 1.5 !important;
        }
        .flex {
          display: flex !important;
          gap: 16pt !important;
          width: 100% !important;
        }
        .w-1\\/3 {
          width: 33.333% !important;
          background: #f3f4f6 !important;
          padding: 12pt !important;
          border-radius: 4pt !important;
          margin: 0 !important;
        }
        .w-2\\/3 {
          width: 66.667% !important;
          padding-left: 12pt !important;
          margin: 0 !important;
        }
        ul {
          list-style: disc !important;
          padding-left: 20pt !important;
        }
        .list-disc {
          list-style-type: disc !important;
        }
        .ml-4 {
          margin-left: 16pt !important;
        }
        .ml-5 {
          margin-left: 20pt !important;
        }
        .space-y-1 > * + * {
          margin-top: 4pt !important;
        }
        .space-y-4 > * + * {
          margin-top: 16pt !important;
        }
        .text-gray-600 {
          color: #4b5563 !important;
        }
        .text-gray-700 {
          color: #374151 !important;
        }
        .text-black {
          color: #000000 !important;
        }
        .bg-gray-100 {
          background: #f3f4f6 !important;
        }
        .italic {
          font-style: italic !important;
        }
        svg {
          fill: #3b82f6 !important;
          stroke: #3b82f6 !important;
        }
        .text-blue-500 {
          color: #3b82f6 !important;
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
 
  const saveToHistory = () => setHistory([...history, JSON.stringify(resumeData)]);
 
  const startEditing = (sectionKey, content, title = "", index = null) => {
    if (sectionKey === "name") {
      setEditingSection("name");
      setEditContent(content || "");
    } else if (sectionKey === "contact") {
      setEditingSection("contact");
      setEditContent(content || "");
    } else {
      setEditingSection(sectionKey);
      setEditContent(content);
      setEditTitle(title || resumeData.pages[currentPage].sections[sectionKey]?.title || "");
      setEditingIndex(index);
    }
  };
 
  const saveChanges = (sectionKey) => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const currentSections = updatedPages[currentPage].sections;
 
    if (sectionKey === "name") {
      updatedPages[currentPage].header.name = editContent;
    } else if (sectionKey === "contact") {
      const [contact, linkedin] = editContent.split("\n");
      updatedPages[currentPage].header.contact = contact || "";
      updatedPages[currentPage].header.linkedin = linkedin || "";
    } else if (currentSections[sectionKey].type === "text") {
      currentSections[sectionKey].content = editContent;
      currentSections[sectionKey].title = editTitle || currentSections[sectionKey].title;
    } else if (currentSections[sectionKey].type === "list" || currentSections[sectionKey].type === "skills") {
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
      default:
        formattedText = selectedText;
    }
    const newContent = editContent.substring(0, start) + formattedText + editContent.substring(end);
    setEditContent(newContent);
    textarea.focus();
    const newPosition = start + formattedText.length;
    textarea.setSelectionRange(newPosition, newPosition);
  };
 
  const EditToolbar = () => (
    <div className="bg-white rounded shadow p-1 inline-flex items-center space-x-1 z-20">
      <button className="p-1 hover:bg-gray-100 rounded" onClick={() => applyFormatting("bold")} title="Bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button className="p-1 hover:bg-gray-100 rounded" onClick={() => applyFormatting("italic")} title="Italic">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button className="p-1 hover:bg-gray-100 rounded" onClick={() => applyFormatting("underline")} title="Underline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>
      <button className="p-1 hover:bg-gray-100 rounded" onClick={() => applyFormatting("list")} title="List">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
    </div>
  );
 
  const addNewSection = () => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const newSectionKey = `custom-${Date.now()}`;
    let defaultContent = "Enter your content here";
    let sectionType = "text";
 
    updatedPages[currentPage].sections[newSectionKey] = {
      title: selectedSectionType.charAt(0).toUpperCase() + selectedSectionType.slice(1),
      content: defaultContent,
      type: sectionType,
    };
 
    setResumeData({ ...resumeData, pages: updatedPages });
    startEditing(newSectionKey, defaultContent, selectedSectionType.charAt(0).toUpperCase() + selectedSectionType.slice(1));
  };
 
  const addNewPage = () => {
    saveToHistory();
    const newPage = { header: {}, sections: {} };
    setResumeData({ ...resumeData, pages: [...resumeData.pages, newPage] });
    setCurrentPage(resumeData.pages.length);
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
        {error.includes("404") && (
          <p className="text-gray-600 mt-2">
            The analysis ID may be invalid or the server endpoint is unavailable. Please verify the ID or contact support.
          </p>
        )}
        {error.includes("Invalid or missing") && (
          <p className="text-gray-600 mt-2">Check the URL or re-analyze your resume.</p>
        )}
      </div>
    );
  }
 
  const iconMap = {
    experience: <Briefcase className="inline-block mr-2 w-5 h-5 text-blue-500" />,
    projects: <Code className="inline-block mr-2 w-5 h-5 text-blue-500" />,
    education: <GraduationCap className="inline-block mr-2 w-5 h-5 text-blue-500" />,
    skills: <Star className="inline-block mr-2 w-5 h-5 text-blue-500" />,
    summary: <User className="inline-block mr-2 w-5 h-5 text-blue-500" />,
  };
 
  const renderSection = (sectionKey, sectionData) => {
    if (!sectionData) return null;
 
    return (
      <section key={sectionKey} className="mt-6 relative group">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold border-b pb-1 flex items-center">
            {iconMap[sectionKey.replace(/<strong>|<\/strong>/g, "").toLowerCase()] || null} {sectionData.title}
          </h2>
          {editingSection !== sectionKey && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  let content;
                  if (sectionData.type === "skills") {
                    content = sectionData.content
                      .map((category) => `${category.value}:\n${category.items.join("\n")}`)
                      .join("\n\n");
                  } else {
                    content =
                      sectionData.type === "text"
                        ? sectionData.content
                        : sectionData.content
                            .map((item) => (Array.isArray(item) ? item.map((i) => i.value).join("\n") : item))
                            .join("\n");
                  }
                  startEditing(sectionKey, content, sectionData.title);
                }}
                className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 px-2 py-1 bg-white shadow-sm rounded"
              >
                Edit
              </button>
              <button
                onClick={() => removeSection(sectionKey)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 px-2 py-1 bg-white shadow-sm rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        {editingSection === sectionKey ? (
          <div className="relative mt-2">
            <div className="absolute -top-12 left-0">
              <EditToolbar />
            </div>
            <input
              type="text"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter section title"
            />
            <textarea
              id="editTextarea"
              className="w-full h-48 p-2 border border-gray-300 rounded"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => saveChanges(sectionKey)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingSection(null);
                  setEditTitle("");
                }}
                className="ml-2 px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {sectionData.type === "text" ? (
              <p dangerouslySetInnerHTML={{ __html: sectionData.content }}></p>
            ) : sectionData.type === "skills" ? (
              <div className="space-y-2">
                {sectionData.content.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800">{category.value}</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{ __html: item }}
                        ></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sectionKey === "<strong>Work Experience</strong>" ? (
                  sectionData.content.map((item, index) => (
                    <div key={index} className="ml-4">
                      {item.map((field, idx) => (
                        <div key={idx}>
                          {field.type === "title" && (
                            <p
                              className="<strong>font-bold text-black<strong>"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                            ></p>
                          )}
                          {field.type === "field" && (
                            <p
                              className="text-gray-900"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                            ></p>
                          )}
                          {field.type === "description" && (
                            <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
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
                    </div>
                  ))
                ) : sectionKey === "<strong>Contact Information</strong>" ? (
                  <div className="space-y-1">
                    {sectionData.content.map((item, index) => (
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: Array.isArray(item) ? item.join("<br>") : item }}
                      ></p>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {sectionData.content.map((item, index) => (
                      <li
                        key={index}
                        dangerouslySetInnerHTML={{ __html: Array.isArray(item) ? item.join("<br>") : item }}
                      ></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    );
  };
 
  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 py-20">
      {resumeData?.pages.map((page, pageIndex) => (
        currentPage === pageIndex && (
          <div
            key={pageIndex}
            id="resume-content"
            className="bg-white max-w-4xl w-full p-8 rounded-lg shadow-lg text-gray-800 mb-8 font-sans"
          >
            {/* Name */}
            <div className="text-center relative group">
              {editingSection === "name" ? (
                <div className="relative">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <EditToolbar />
                  </div>
                  <textarea
                    id="editTextarea"
                    className="w-full h-12 p-2 border border-gray-300 rounded"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={() => saveChanges("name")}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="ml-2 px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl font-bold">{page.header.name}</h1>
              )}
              <button
                onClick={() => startEditing("name", page.header.name || "")}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 px-2 py-1 bg-white shadow-sm rounded"
              >
                Edit Name
              </button>
            </div>
 
            {/* Two-column layout */}
            <div className="flex mt-6">
              {/* Sidebar */}
              <div className="w-1/3 pr-4 bg-gray-100 p-4 rounded">
                {Object.entries(page.sections)
                  .filter(([key]) =>
                    [
                      "<strong>Skills</strong>",
                      "<strong>Education</strong>",
                      "<strong>Languages</strong>",
                      "<strong>Certifications</strong>",
                      "<strong>Hobbies</strong>",
                    ].includes(key)
                  )
                  .map(([key, section]) => renderSection(key, section))}
              </div>
 
              {/* Main Content */}
              <div className="w-2/3 pl-4">
                {Object.entries(page.sections)
                  .filter(
                    ([key]) =>
                      ![
                        "<strong>Skills</strong>",
                        "<strong>Education</strong>",
                        "<strong>Languages</strong>",
                        "<strong>Certifications</strong>",
                        "<strong>Hobbies</strong>",
                      ].includes(key)
                  )
                  .map(([key, section]) => renderSection(key, section))}
              </div>
            </div>
          </div>
        )
      ))}
 
      {/* Action Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={openPrintDialog}
          disabled={pdfGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center disabled:bg-blue-300"
        >
          <Download className="mr-2 w-5 h-5" />
          {pdfGenerating ? "Preparing Print..." : "Download Resume"}
        </button>
 
        {resumeData?.pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`px-4 py-2 rounded ${currentPage === index ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Page {index + 1}
          </button>
        ))}
        <button
          onClick={addNewPage}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add New Page
        </button>
      </div>
 
      {/* Add Section and Undo */}
      <div className="mt-2 mb-8 flex justify-center space-x-4">
        <select
          value={selectedSectionType}
          onChange={(e) => setSelectedSectionType(e.target.value)}
          className="px-4 py-2 bg-white text-gray-800 border border-blue-500 rounded hover:bg-blue-50"
        >
          <option value="text">Text</option>
          <option value="experience">Experience</option>
          <option value="achievements">Achievements</option>
          <option value="hobbies">Hobbies</option>
          <option value="certifications">Certifications</option>
          <option value="languages">Languages</option>
        </select>
        <button
          onClick={addNewSection}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Section
        </button>
        {history.length > 0 && (
          <button
            onClick={undoLastAction}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Undo Last Action
          </button>
        )}
      </div>
    </div>
  );
};
 
export default memo(ImproveResume);
 