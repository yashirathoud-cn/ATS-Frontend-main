import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
 
const ImproveResume3 = () => {
  const { analysisId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingSection, setEditingSection] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedSectionType, setSelectedSectionType] = useState("text");
  const [error, setError] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
 
  const API_BASE_URL = import.meta.env.VITE_RESUME_API_DATA_URL;
 
  const convertToBulletPoints = (text) => {
    if (!text || typeof text !== "string") return [];
    return text
      .split(/(?<=[.!?])\s+|(?<=[.!?])$|\n/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0)
      .map((sentence) => `. ${sentence}`);
  };
 
  const convertToResumeDataFormat = (apiData) => {
    const improvedResume = apiData?.improved_resume || {};
    const suggestions = apiData?.suggestions || [];
 
    const boldKey = (key) => {
      const formattedKey = key.replace(/_/g, " ");
      return `<strong>${formattedKey}</strong>`;
    };
 
    const transformedResume = {};
    Object.entries(improvedResume).forEach(([key, content]) => {
      const boldedKey = boldKey(key);
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
            ? Object.fromEntries(
                Object.entries(item).map(([k, v]) => [boldKey(k), v])
              )
            : item
        );
      } else if (typeof content === "object" && content !== null) {
        transformedResume[boldedKey] = Object.fromEntries(
          Object.entries(content).map(([k, v]) => [boldKey(k), v])
        );
      } else {
        transformedResume[boldedKey] = content;
      }
    });
 
    const formattedSections = {};
    Object.entries(transformedResume).forEach(([key, content]) => {
      let sectionType = "text";
      let formattedContent = content;
 
      if (key === "<strong>Contact Information</strong>") return;
 
      if (key === "<strong>Skills</strong>") {
        sectionType = "skills";
        formattedContent = content;
      } else if (Array.isArray(content)) {
        sectionType = "list";
        if (key === "<strong>Work Experience</strong>") {
          formattedContent = content.map((item) => {
            if (typeof item === "object" && item !== null) {
              const entries = Object.entries(item);
              let result = [];
              let description = [];
              entries.forEach(([k, v]) => {
                if (k === "<strong>Name</strong>" || k === "<strong>Title</strong>") {
                  result.push({ type: "title", value: v });
                } else if (
                  (k === "<strong>Responsibilities</strong>" ||
                    k === "<strong>Description</strong>") &&
                  typeof v === "string"
                ) {
                  description = convertToBulletPoints(v);
                } else if (
                  (k === "<strong>Responsibilities</strong>" ||
                    k === "<strong>Description</strong>") &&
                  Array.isArray(v)
                ) {
                  description = v.map((item) => `${item}`);
                } else if (Array.isArray(v)) {
                  result.push({ type: "field", value: `${v.join(", ")}` });
                } else {
                  result.push({ type: "field", value: `${v}` });
                }
              });
              if (description.length > 0) {
                result.push({ type: "description", value: description });
              }
              return result;
            }
            return item;
          });
        } else if (key === "<strong>Projects</strong>") {
          formattedContent = content.map((item) => {
            if (typeof item === "object" && item !== null) {
              const entries = Object.entries(item);
              let result = [];
              entries.forEach(([k, v]) => {
                if (k === "<strong>Name</strong>" || k === "<strong>Title</strong>") {
                  result.push(v);
                } else if (typeof v === "string") {
                  const bulletPoints = convertToBulletPoints(v);
                  result.push(
                    bulletPoints.length > 0 ? bulletPoints.join("<br>") : `${v}`
                  );
                } else if (Array.isArray(v)) {
                  result.push(`${v.join(", ")}`);
                } else {
                  result.push(`${v}`);
                }
              });
              return result.join("<br>");
            }
            return item;
          });
        } else {
          formattedContent = content.map((item) =>
            typeof item === "object" && item !== null
              ? Object.entries(item)
                  .map(([k, v]) => `${v}`)
                  .join("<br>")
              : item
          );
        }
      } else if (typeof content === "object" && content !== null) {
        sectionType = "list";
        formattedContent = Object.entries(content)
          .map(([k, v]) => `${v}`)
          .filter(Boolean);
      } else if (typeof content === "string") {
        sectionType = "text";
        formattedContent = content;
      }
 
      formattedSections[key] = {
        title: key,
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
            name:
              transformedResume["<strong>Contact Information</strong>"]?.[
                "<strong>Name</strong>"
              ] || "Your Name",
            contact: [
              transformedResume["<strong>Contact Information</strong>"]?.[
                "<strong>Phone</strong>"
              ] || "",
              transformedResume["<strong>Contact Information</strong>"]?.[
                "<strong>Email</strong>"
              ] || "",
            ]
              .filter(Boolean)
              .join(", "),
            linkedin:
              transformedResume["<strong>Contact Information</strong>"]?.[
                "<strong>Linkedin</strong>"
              ] || "",
            github:
              transformedResume["<strong>Contact Information</strong>"]?.[
                "<strong>Github</strong>"
              ] || "",
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
      if (hasFetched) return;
 
      if (!analysisId || analysisId === ":analysisId") {
        if (isMounted) {
          setError(
            "Invalid or missing analysis ID. Please ensure a valid ID is provided in the URL."
          );
          setLoading(false);
        }
        return;
      }
 
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/direct-improve/${analysisId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
 
        const data = await response.json();
        if (isMounted) {
          setResumeData(convertToResumeDataFormat(data));
          hasFetched = true;
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to fetch improved resume: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
 
    fetchImprovedResume();
 
    return () => {
      isMounted = false;
    };
  }, [analysisId]);
 
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 
  const saveToHistory = () =>
    setHistory([...history, JSON.stringify(resumeData)]);
 
  const startEditing = (sectionKey, content, title = "") => {
    setEditingSection(sectionKey);
    setEditContent(content);
    setEditTitle(title || resumeData.pages[currentPage].sections[sectionKey]?.title || "");
  };
 
  const saveChanges = (sectionKey) => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const currentSections = updatedPages[currentPage].sections;
 
    if (sectionKey === "header") {
      const [contact, linkedin, github] = editContent.split("\n");
      updatedPages[currentPage].header = {
        ...updatedPages[currentPage].header,
        contact: contact || updatedPages[currentPage].header.contact,
        linkedin: linkedin || updatedPages[currentPage].header.linkedin,
        github: github || updatedPages[currentPage].header.github,
      };
    } else if (currentSections[sectionKey].type === "text") {
      currentSections[sectionKey].content = editContent;
      currentSections[sectionKey].title = editTitle || currentSections[sectionKey].title;
    } else if (
      currentSections[sectionKey].type === "list" ||
      currentSections[sectionKey].type === "skills"
    ) {
      currentSections[sectionKey].content = editContent
        .split("\n")
        .filter((item) => item.trim() !== "");
      currentSections[sectionKey].title = editTitle || currentSections[sectionKey].title;
    }
 
    setResumeData({ ...resumeData, pages: updatedPages });
    setEditingSection(null);
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
        formattedText = selectedText
          ? "\n. " + selectedText.split("\n").join("\n. ")
          : "\n. New list item";
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
 
    const newContent =
      editContent.substring(0, start) +
      formattedText +
      editContent.substring(end);
    setEditContent(newContent);
 
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
 
  const EditToolbar = () => (
    <div className="bg-white rounded-lg shadow-md p-2 flex items-center space-x-2 z-20">
      <button
        className="p-2 hover:bg-blue-100 rounded"
        onClick={() => applyFormatting("bold")}
        title="Bold"
      >
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
      <button
        className="p-2 hover:bg-blue-100 rounded"
        onClick={() => applyFormatting("italic")}
        title="Italic"
      >
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
      <button
        className="p-2 hover:bg-blue-100 rounded"
        onClick={() => applyFormatting("underline")}
        title="Underline"
      >
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
      <button
        className="p-2 hover:bg-blue-100 rounded"
        onClick={() => applyFormatting("circle")}
        title="Circle"
      >
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
      <button
        className="p-2 hover:bg-blue-100 rounded"
        onClick={() => applyFormatting("box")}
        title="Box"
      >
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
 
  const openPrintDialog = () => {
  setPdfGenerating(true);
 
  const printContainer = document.createElement("div");
  printContainer.id = "print-container";
  printContainer.style.position = "absolute";
  printContainer.style.top = "0";
  printContainer.style.left = "0";
  printContainer.style.width = "210mm";
  printContainer.style.minHeight = "297mm";
  printContainer.style.background = "white";
 
  const resumeElement = document.getElementById("resume-content").cloneNode(true);
 
  const elementsToRemove = resumeElement.querySelectorAll(
    ".opacity-0, button, select, .group-hover\\:opacity-100, input, textarea"
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
        margin: 0 !important;
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
        min-height: 297mm;
        font-family: Arial, sans-serif;
        color: #1f2937 !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box;
        background: #ffffff !important;
      }
      #resume-content {
        max-width: 210mm !important;
        width: 210mm !important;
        padding: ${isMobile ? "5mm" : "8mm"} !important;
        margin: 0 !important;
        background: #ffffff !important;
        box-shadow: none !important;
        break-inside: avoid !important;
      }
      /* Ensure top padding for subsequent pages */
      @page :not(:first) {
        #resume-content {
          padding-top: ${isMobile ? "5mm" : "8mm"} !important;
        }
      }
      .flex {
        display: flex !important;
        gap: 16pt !important;
      }
      .md\\:flex-row {
        flex-direction: row !important;
      }
      .w-full {
        width: 100% !important;
      }
      .md\\:w-1\\/3 {
        width: 33.333% !important;
      }
      .md\\:w-2\\/3 {
        width: 66.667% !important;
      }
      h1 {
        font-size: 24pt !important;
        font-weight: bold !important;
        text-align: center !important;
        background: #bfdbfe !important;
        color: #ffffff !important;
        padding: 12pt 0 !important;
        border-bottom: 1pt solid #93c5fd !important;
      }
      h2 {
        font-size: 14pt !important;
        font-weight: bold !important;
        border-bottom: 1pt solid #bfdbfe !important;
        padding-bottom: 4pt !important;
        margin-top: 16pt !important;
        margin-bottom: 8pt !important;
        color: #1E3A8A !important;
      }
      p, li {
        font-size: 10pt !important;
        line-height: 1.5 !important;
        color: #1f2937 !important;
      }
      ul {
        list-style: disc !important;
        padding-left: 20pt !important;
      }
      .list-disc {
        list-style-type: disc !important;
      }
      .list-none {
        list-style: none !important;
      }
      .ml-4 {
        margin-left: 16pt !important;
      }
      .ml-6 {
        margin-left: 24pt !important;
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
      .text-gray-900 {
        color: #1f2937 !important;
      }
      .text-gray-600 {
        color: #4b5563 !important;
      }
      .text-blue-800 {
        color: #1E3A8A !important;
      }
      .border-blue-200 {
        border-color: #bfdbfe !important;
      }
      .border-blue-300 {
        border-color: #93c5fd !important;
      }
      .bg-blue-200 {
        background: #bfdbfe !important;
      }
      a {
        color: #1E3A8A !important;
        text-decoration: underline !important;
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
  const addNewSection = () => {
    saveToHistory();
    const updatedPages = [...resumeData.pages];
    const newSectionKey = `custom-${Date.now()}`;
    let defaultContent;
    let sectionType;
 
    switch (selectedSectionType) {
      case "text":
      case "hobbies":
      case "achievements":
      case "languages":
        defaultContent = "Enter your content here";
        sectionType = "text";
        break;
      case "list":
      case "certifications":
      case "education":
      case "skills":
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
 
    const editContentString = sectionType === "text" ? defaultContent : defaultContent.join("\n");
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
    if (!sectionData) return null;
 
    if (sectionData.type === "text") {
      return (
        <section key={sectionKey} className="mb-6 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-1"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            />
            {editingSection !== sectionKey && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    startEditing(sectionKey, sectionData.content, sectionData.title)
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
              />
            </div>
          )}
        </section>
      );
    } else if (sectionData.type === "list") {
      return (
        <section key={sectionKey} className="mb-6 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-1"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            />
            {editingSection !== sectionKey && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    startEditing(
                      sectionKey,
                      sectionData.content
                        .map((item) =>
                          Array.isArray(item)
                            ? item.map((i) => i.value).join("\n")
                            : item
                        )
                        .join("\n"),
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
              {sectionKey === "<strong>Work Experience</strong>" ? (
                <div className="space-y-4">
                  {sectionData.content.map((item, index) => (
                    <div key={index} className="ml-4">
                      {item.map((field, idx) => (
                        <div key={idx}>
                          {field.type === "title" && (
                            <p
                              className="font-semibold text-gray-900"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                            />
                          )}
                          {field.type === "field" && (
                            <p
                              className="text-gray-900 font-bold"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                            />
                          )}
                          {field.type === "description" && (
                            <ul className="list-disc list-outside ml-6 mt-1 space-y-1">
                              {field.value.map((desc, descIdx) => (
                                <li
                                  key={descIdx}
                                  className="text-gray-900"
                                  dangerouslySetInnerHTML={{ __html: desc }}
                                />
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc list-outside ml-6 space-y-2">
                  {sectionData.content.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-900"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      );
    } else if (sectionData.type === "skills") {
      return (
        <section key={sectionKey} className="mb-6 relative group">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-1"
              dangerouslySetInnerHTML={{ __html: sectionData.title }}
            />
            {editingSection !== sectionKey && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    startEditing(
                      sectionKey,
                      sectionData.content
                        .map((category) =>
                          `${category.value}:\n${category.items.join("\n")}`
                        )
                        .join("\n\n"),
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
            <div className="mt-3 space-y-2">
              {sectionData.content.map((category, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800">{category.value}</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      );
    }
    return null;
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto" />
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
            The analysis ID may be invalid or the server endpoint is
            unavailable. Please verify the ID or contact support.
          </p>
        )}
        {error.includes("Invalid or missing") && (
          <p className="text-gray-600 mt-2">
            Check the URL or re-analyze your resume.
          </p>
        )}
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 py-20">
      {resumeData?.pages.map((page, pageIndex) => (
        currentPage === pageIndex && (
          <div
            key={pageIndex}
            id="resume-content"
            className="bg-white max-w-5xl w-full rounded-lg shadow-xl p-8"
          >
            <div className={`flex flex-col ${!isMobile ? "md:flex-row" : ""} gap-6`}>
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <section className="pb-4 mb-6">
                  {editingSection === "header" ? (
                    <div className="relative">
                      <div className="absolute -top-12 right-0">
                        <EditToolbar />
                      </div>
                      <textarea
                        id="editTextarea"
                        className="w-full h-32 p-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Contact info\nLinkedIn\nGitHub"
                      />
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => saveChanges("header")}
                          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center md:text-left">
                      {page.header.name && (
                        <h1
                          className="text-4xl font-bold text-white bg-blue-200 py-4 border-b-2 border-blue-300"
                          dangerouslySetInnerHTML={{ __html: page.header.name }}
                        />
                      )}
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {page.header.contact && (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: page.header.contact.replace("|", "<br>"),
                            }}
                          />
                        )}
                        {page.header.linkedin && (
                          <p>
                            <a
                              href={page.header.linkedin}
                              className="text-blue-800 underline hover:text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {page.header.linkedin}
                            </a>
                          </p>
                        )}
                        {page.header.github && (
                          <p>
                            <a
                              href={page.header.github}
                              className="text-blue-800 underline hover:text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {page.header.github}
                            </a>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          startEditing(
                            "header",
                            `${page.header.contact || ""}\n${page.header.linkedin || ""}\n${page.header.github || ""}`
                          )
                        }
                        className="mt-2 text-sm text-blue-800 underline hover:text-blue-900"
                      >
                        Edit Contact Details
                      </button>
                    </div>
                  )}
                </section>
 
                {[
                  "<strong>Certifications</strong>",
                  "<strong>Education</strong>",
                  "<strong>Skills</strong>",
                ].map((key) => page.sections[key] && renderSection(key, page.sections[key]))}
              </div>
 
              <div className="w-full md:w-2/3">
                {Object.keys(page.sections)
                  .filter(
                    (key) =>
                      ![
                        "<strong>Certifications</strong>",
                        "<strong>Education</strong>",
                        "<strong>Skills</strong>",
                      ].includes(key)
                  )
                  .map((key) => renderSection(key, page.sections[key]))}
              </div>
            </div>
          </div>
        )
      ))}
 
      <div className="mt-6 flex flex-wrap gap-4 justify-center p-4 bg-white rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add New Section
          </label>
          <div className="flex">
            <select
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
              value={selectedSectionType}
              onChange={(e) => setSelectedSectionType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="list">List</option>
              <option value="skills">Skills</option>
              <option value="education">Education</option>
              <option value="certifications">Certifications</option>
              <option value="hobbies">Hobbies</option>
              <option value="achievements">Achievements</option>
              <option value="languages">Languages</option>
            </select>
            <button
              onClick={addNewSection}
              className="ml-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
            >
              Add
            </button>
          </div>
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Control
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              {currentPage + 1} / {resumeData?.pages.length}
            </span>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(resumeData?.pages.length - 1, currentPage + 1)
                )
              }
              className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 ${
                currentPage === resumeData?.pages.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === resumeData?.pages.length - 1}
            >
              Next
            </button>
            <button
              onClick={addNewPage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Page
            </button>
          </div>
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actions
          </label>
          <div className="flex space-x-2">
            <button
              onClick={undoLastAction}
              className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 ${
                history.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={history.length === 0}
            >
              Undo
            </button>
            <button
              onClick={openPrintDialog}
              disabled={pdfGenerating}
              className={`px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center ${
                pdfGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Download className="mr-2 w-5 h-5" />
              {pdfGenerating ? "Preparing Download..." : "Download Resume"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default memo(ImproveResume3);