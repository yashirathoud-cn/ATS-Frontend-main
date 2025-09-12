import React, { useRef, useState } from "react";
import { ArrowDown } from "react-feather";
import Editor from "../Editor/Editor";
import Resume from "../Resume/Resume";
import { useTranslation } from "react-i18next";

const BodyComponent = () => {
  const { t } = useTranslation();
  const colors = ["#239ce2", "#48bb78", "#0bc5ea", "#a0aec0", "#ed8936"];
  const sections = {
    basicInfo: t("resumebuild_section_basic_info"),
    workExp: t("resumebuild_section_work_exp"),
    project: t("resumebuild_section_project"),
    education: t("resumebuild_section_education"),
    achievement: t("resumebuild_section_achievement"),
    summary: t("resumebuild_section_summary"),
    other: t("resumebuild_section_other"),
  };
  const resumeRef = useRef();

  const [activeColor, setActiveColor] = useState(colors[0]);
  const [resumeInformation, setResumeInformation] = useState({
    [sections.basicInfo]: {
      id: sections.basicInfo,
      sectionTitle: sections.basicInfo,
      detail: {},
    },
    [sections.workExp]: {
      id: sections.workExp,
      sectionTitle: sections.workExp,
      details: [],
    },
    [sections.project]: {
      id: sections.project,
      sectionTitle: sections.project,
      details: [],
    },
    [sections.education]: {
      id: sections.education,
      sectionTitle: sections.education,
      details: [],
    },
    [sections.achievement]: {
      id: sections.achievement,
      sectionTitle: sections.achievement,
      points: [],
    },
    [sections.summary]: {
      id: sections.summary,
      sectionTitle: sections.summary,
      detail: "",
    },
    [sections.other]: {
      id: sections.other,
      sectionTitle: sections.other,
      detail: "",
    },
  });

  const handleDownload = () => {
    const resumeElement = resumeRef.current;
    if (!resumeElement) return;

    // Create a temporary iframe to render the resume in isolation
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    document.body.appendChild(iframe);

    // Get the original styles
    const originalStyles = window.getComputedStyle(resumeElement);
    
    // Once iframe is loaded, populate it with resume content
    iframe.onload = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Add styles to iframe document
      const styleElement = iframeDoc.createElement('style');
      styleElement.textContent = `
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .pdf-container {
          width: 210mm;
          min-height: 297mm;
          background: white;
          position: relative;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        /* Import resume styles */
        ${Array.from(document.styleSheets)
          .filter(sheet => {
            try {
              // Filter out non-CSS stylesheets and cross-origin sheets
              return sheet.cssRules && sheet.cssRules.length > 0;
            } catch (e) {
              return false;
            }
          })
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n')}
        
        /* Override specific styles for PDF rendering */
        .container {
          box-shadow: none !important;
          width: 210mm !important;
          height: auto !important;
          min-height: 297mm !important;
          padding: 15mm !important;
          margin: 0 !important;
          background-color: white !important;
        }
        
        .header, .main, .col1, .col2, .section, .content, .item {
          display: flex !important;
        }
        
        .header {
          flex-direction: column !important;
        }
        
        .main {
          flex-direction: row !important;
          gap: 30px !important;
        }
        
        .col1, .col2 {
          flex-direction: column !important;
        }
        
        .col1 {
          flex: 1.3 !important;
        }
        
        .col2 {
          flex: 1 !important;
        }
        
        .content {
          flex-direction: column !important;
        }
        
        .item {
          flex-direction: column !important;
          page-break-inside: avoid !important;
        }
        
        /* Fix for links and dates */
        .link, .date {
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
        }
        
        /* Ensure text sizes are consistent */
        .heading {
          font-size: 2.7rem !important;
        }
        
        .subHeading {
          font-size: 1.1rem !important;
        }
        
        .sectionTitle {
          font-size: 1.4rem !important;
        }
        
        .title, .subTitle {
          font-size: 1rem !important;
        }
        
        .overview, .points, .numbered {
          font-size: 0.875rem !important;
        }
      `;
      iframeDoc.head.appendChild(styleElement);
      
      // Create body content with resume
      const container = iframeDoc.createElement('div');
      container.className = 'pdf-container';
      container.appendChild(resumeElement.cloneNode(true));
      iframeDoc.body.appendChild(container);
      
      // Ensure custom color variable is applied
      const allElements = iframeDoc.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.classList && el.classList.contains('container')) {
          el.style.setProperty('--color', activeColor);
        }
      });
      
      // Generate PDF once content is ready
      setTimeout(() => {
        import('html2canvas').then((html2canvasModule) => {
          const html2canvas = html2canvasModule.default;
          
          html2canvas(iframeDoc.body.firstChild, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageRendering: 'high',
            windowWidth: 794, // A4 width in pixels at 96 DPI
            windowHeight: 1123, // A4 height
            scrollY: -window.scrollY,
            scrollX: 0,
          }).then((canvas) => {
            import('jspdf').then((jsPDFModule) => {
              const { jsPDF } = jsPDFModule;
              
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
              });
              
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              
              const canvasWidth = canvas.width;
              const canvasHeight = canvas.height;
              
              const imgWidth = pdfWidth;
              let imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
              
              if (imgHeight > pdfHeight) {
                imgHeight = pdfHeight;
              }
              
              const imgData = canvas.toDataURL('image/jpeg', 1.0);
              pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
              
              pdf.save('resume.pdf');
              
              // Clean up
              document.body.removeChild(iframe);
            });
          });
        }).catch(error => {
          console.error("Error generating PDF:", error);
          alert("Failed to generate PDF. Please try again or check console for errors.");
          document.body.removeChild(iframe);
        });
      }, 1000); // Give time for all resources to load
    };
    
    // Set iframe source to blank page to trigger onload
    iframe.src = 'about:blank';
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 pt-0 bg-black min-h-screen">
      <p className="text-3xl md:text-4xl font-medium text-white">{t("resumebuild_builder_title")}</p>
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
        <div className="flex gap-4 flex-wrap justify-center">
          {colors.map((item) => (
            <span
              key={item}
              style={{ backgroundColor: item }}
              className={`h-9 w-9 rounded-full cursor-pointer ${activeColor === item ? 'ring-2 ring-red-100' : ''}`}
              onClick={() => setActiveColor(item)}
            />
          ))}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md font-medium text-base hover:bg-blue-600 transition"
        >
          {t("resumebuild_download_btn")} <ArrowDown className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <Editor
          sections={sections}
          information={resumeInformation}
          setInformation={setResumeInformation}
        />
        <Resume
          ref={resumeRef}
          sections={sections}
          information={resumeInformation}
          activeColor={activeColor}
        />
      </div>
    </div>
  );
};

export default BodyComponent;