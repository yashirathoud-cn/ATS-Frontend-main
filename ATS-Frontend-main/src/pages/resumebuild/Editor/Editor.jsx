import React, { useEffect, useState } from "react";
import { X } from "react-feather";
import InputControl from "../InputControl/InputControl";
import { useTranslation } from "react-i18next";

const Editor = (props) => {
  const { t } = useTranslation();
  const { sections, information, setInformation } = props;

  const [activeSectionKey, setActiveSectionKey] = useState(Object.keys(sections)[0]);
  const [activeInformation, setActiveInformation] = useState(
    information[sections[Object.keys(sections)[0]]]
  );
  const [activeDetailIndex, setActiveDetailIndex] = useState(0);
  const [sectionTitle, setSectionTitle] = useState(sections[Object.keys(sections)[0]]);
  const [values, setValues] = useState({
    name: "",
    title: "",
    linkedin: "",
    github: "",
    phone: "",
    email: "",
    points: [],
    companyName: "",
    certificationLink: "",
    location: "",
    startDate: "",
    endDate: "",
    overview: "",
    college: "",
    summary: "",
    other: "",
  });

  const handlePointUpdate = (value, index) => {
    const tempValues = { ...values };
    if (!Array.isArray(tempValues.points)) tempValues.points = [];
    tempValues.points[index] = value;
    setValues(tempValues);
  };

  const workExpBody = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_title')}
          placeholder={t('resumebuild_editor_placeholder_title')}
          value={values.title}
          onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
        />
        <InputControl
          label={t('resumebuild_editor_label_company_name')}
          placeholder={t('resumebuild_editor_placeholder_company_name')}
          value={values.companyName}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, companyName: event.target.value }))
          }
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_certificate_link')}
          placeholder={t('resumebuild_editor_placeholder_certificate_link')}
          value={values.certificationLink}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, certificationLink: event.target.value }))
          }
        />
        <InputControl
          label={t('resumebuild_editor_label_location')}
          placeholder={t('resumebuild_editor_placeholder_location')}
          value={values.location}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, location: event.target.value }))
          }
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_start_date')}
          type="date"
          placeholder={t('resumebuild_editor_placeholder_start_date')}
          value={values.startDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, startDate: event.target.value }))
          }
        />
        <InputControl
          label={t('resumebuild_editor_label_end_date')}
          type="date"
          placeholder={t('resumebuild_editor_placeholder_end_date')}
          value={values.endDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, endDate: event.target.value }))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">{t('resumebuild_editor_label_work_desc')}</label>
        {[0, 1, 2].map((i) => (
          <InputControl
            key={i}
            placeholder={t('resumebuild_editor_placeholder_line', { num: i + 1 })}
            value={values.points[i] || ""}
            onChange={(event) => handlePointUpdate(event.target.value, i)}
          />
        ))}
      </div>
    </div>
  );

  const projectBody = (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_title')}
          value={values.title}
          placeholder={t('resumebuild_editor_placeholder_title')}
          onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>
      <InputControl
        label={t('resumebuild_editor_label_overview')}
        value={values.overview}
        placeholder={t('resumebuild_editor_placeholder_overview')}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, overview: event.target.value }))
        }
      />
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_deployed_link')}
          value={values.link}
          placeholder={t('resumebuild_editor_placeholder_deployed_link')}
          onChange={(event) => setValues((prev) => ({ ...prev, link: event.target.value }))}
        />
        <InputControl
          label={t('resumebuild_editor_label_github_link')}
          value={values.github}
          placeholder={t('resumebuild_editor_placeholder_github_link')}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, github: event.target.value }))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">{t('resumebuild_editor_label_project_desc')}</label>
        {[0, 1, 2, 3].map((i) => (
          <InputControl
            key={i}
            placeholder={t('resumebuild_editor_placeholder_line', { num: i + 1 })}
            value={values.points[i] || ""}
            onChange={(event) => handlePointUpdate(event.target.value, i)}
          />
        ))}
      </div>
    </div>
  );

  const educationBody = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_title')}
          value={values.title}
          placeholder={t('resumebuild_editor_placeholder_title')}
          onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>
      <InputControl
        label={t('resumebuild_editor_label_college_school_name')}
        value={values.college}
        placeholder={t('resumebuild_editor_placeholder_college_school_name')}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, college: event.target.value }))
        }
      />
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_start_date')}
          type="date"
          placeholder={t('resumebuild_editor_placeholder_start_date')}
          value={values.startDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, startDate: event.target.value }))
          }
        />
        <InputControl
          label={t('resumebuild_editor_label_end_date')}
          type="date"
          placeholder={t('resumebuild_editor_placeholder_end_date')}
          value={values.endDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, endDate: event.target.value }))
          }
        />
      </div>
    </div>
  );

  const basicInfoBody = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_name')}
          placeholder={t('resumebuild_editor_placeholder_name')}
          value={values.name}
          onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
        />
        <InputControl
          label={t('resumebuild_editor_label_title')}
          value={values.title}
          placeholder={t('resumebuild_editor_placeholder_title')}
          onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_linkedin_link')}
          value={values.linkedin}
          placeholder={t('resumebuild_editor_placeholder_linkedin_link')}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, linkedin: event.target.value }))
          }
        />
        <InputControl
          label={t('resumebuild_editor_label_github_link')}
          value={values.github}
          placeholder={t('resumebuild_editor_placeholder_github_link')}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, github: event.target.value }))
          }
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <InputControl
          label={t('resumebuild_editor_label_email')}
          value={values.email}
          placeholder={t('resumebuild_editor_placeholder_email')}
          onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
        />
        <InputControl
          label={t('resumebuild_editor_label_phone')}
          value={values.phone}
          placeholder={t('resumebuild_editor_placeholder_phone')}
          onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
        />
      </div>
    </div>
  );

  const achievementsBody = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium">{t('resumebuild_editor_label_achievements')}</label>
        {[0, 1, 2, 3].map((i) => (
          <InputControl
            key={i}
            placeholder={t('resumebuild_editor_placeholder_line', { num: i + 1 })}
            value={values.points[i] || ""}
            onChange={(event) => handlePointUpdate(event.target.value, i)}
          />
        ))}
      </div>
    </div>
  );

  const summaryBody = (
    <div className="flex flex-col gap-4">
      <InputControl
        label={t('resumebuild_editor_label_summary')}
        value={values.summary}
        placeholder={t('resumebuild_editor_placeholder_summary')}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, summary: event.target.value }))
        }
      />
    </div>
  );

  const otherBody = (
    <div className="flex flex-col gap-4">
      <InputControl
        label={t('resumebuild_editor_label_other')}
        value={values.other}
        placeholder={t('resumebuild_editor_placeholder_other')}
        onChange={(event) => setValues((prev) => ({ ...prev, other: event.target.value }))}
      />
    </div>
  );

  const generateBody = () => {
    switch (sections[activeSectionKey]) {
      case sections.basicInfo:
        return basicInfoBody;
      case sections.workExp:
        return workExpBody;
      case sections.project:
        return projectBody;
      case sections.education:
        return educationBody;
      case sections.achievement:
        return achievementsBody;
      case sections.summary:
        return summaryBody;
      case sections.other:
        return otherBody;
      default:
        return null;
    }
  };

  const handleSubmission = () => {
    switch (sections[activeSectionKey]) {
      case sections.basicInfo: {
        const tempDetail = {
          name: values.name,
          title: values.title,
          linkedin: values.linkedin,
          github: values.github,
          email: values.email,
          phone: values.phone,
        };
        setInformation((prev) => ({
          ...prev,
          [sections.basicInfo]: {
            ...prev[sections.basicInfo],
            detail: tempDetail,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.workExp: {
        const tempDetail = {
          certificationLink: values.certificationLink,
          title: values.title,
          startDate: values.startDate,
          endDate: values.endDate,
          companyName: values.companyName,
          location: values.location,
          points: values.points.filter((point) => point),
        };
        const tempDetails = [...(information[sections.workExp]?.details || [])];
        tempDetails[activeDetailIndex] = tempDetail;
        setInformation((prev) => ({
          ...prev,
          [sections.workExp]: {
            ...prev[sections.workExp],
            details: tempDetails,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.project: {
        const tempDetail = {
          link: values.link,
          title: values.title,
          overview: values.overview,
          github: values.github,
          points: values.points.filter((point) => point),
        };
        const tempDetails = [...(information[sections.project]?.details || [])];
        tempDetails[activeDetailIndex] = tempDetail;
        setInformation((prev) => ({
          ...prev,
          [sections.project]: {
            ...prev[sections.project],
            details: tempDetails,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.education: {
        const tempDetail = {
          title: values.title,
          college: values.college,
          startDate: values.startDate,
          endDate: values.endDate,
        };
        const tempDetails = [...(information[sections.education]?.details || [])];
        tempDetails[activeDetailIndex] = tempDetail;
        setInformation((prev) => ({
          ...prev,
          [sections.education]: {
            ...prev[sections.education],
            details: tempDetails,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.achievement: {
        const tempPoints = values.points.filter((point) => point);
        setInformation((prev) => ({
          ...prev,
          [sections.achievement]: {
            ...prev[sections.achievement],
            points: tempPoints,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.summary: {
        const tempDetail = values.summary;
        setInformation((prev) => ({
          ...prev,
          [sections.summary]: {
            ...prev[sections.summary],
            detail: tempDetail,
            sectionTitle,
          },
        }));
        break;
      }
      case sections.other: {
        const tempDetail = values.other;
        setInformation((prev) => ({
          ...prev,
          [sections.other]: {
            ...prev[sections.other],
            detail: tempDetail,
            sectionTitle,
          },
        }));
        break;
      }
      default:
        break;
    }
  };

  const handleAddNew = () => {
    const details = activeInformation?.details || [];
    const lastDetail = details.slice(-1)[0];
    if (lastDetail && !Object.keys(lastDetail).length) return;
    const newDetail = {};
    setInformation((prev) => ({
      ...prev,
      [sections[activeSectionKey]]: {
        ...prev[sections[activeSectionKey]],
        details: [...details, newDetail],
      },
    }));
    setActiveDetailIndex(details.length);
  };

  const handleDeleteDetail = (index) => {
    const details = [...(activeInformation?.details || [])];
    if (!details.length) return;
    details.splice(index, 1);
    setInformation((prev) => ({
      ...prev,
      [sections[activeSectionKey]]: {
        ...prev[sections[activeSectionKey]],
        details,
      },
    }));
    setActiveDetailIndex((prev) => Math.max(0, prev === index ? prev - 1 : prev));
  };

  useEffect(() => {
    const activeInfo = information[sections[activeSectionKey]];
    setActiveInformation(activeInfo);
    setSectionTitle(sections[activeSectionKey]);
    setActiveDetailIndex(0);
    setValues({
      name: activeInfo?.detail?.name || "",
      title: activeInfo?.details?.[0]?.title || activeInfo?.detail?.title || "",
      linkedin: activeInfo?.detail?.linkedin || "",
      github: activeInfo?.details?.[0]?.github || activeInfo?.detail?.github || "",
      phone: activeInfo?.detail?.phone || "",
      email: activeInfo?.detail?.email || "",
      points: activeInfo?.details?.[0]?.points
        ? [...activeInfo.details[0].points]
        : activeInfo?.points
        ? [...activeInfo.points]
        : [],
      companyName: activeInfo?.details?.[0]?.companyName || "",
      certificationLink: activeInfo?.details?.[0]?.certificationLink || "",
      location: activeInfo?.details?.[0]?.location || "",
      startDate: activeInfo?.details?.[0]?.startDate || "",
      endDate: activeInfo?.details?.[0]?.endDate || "",
      overview: activeInfo?.details?.[0]?.overview || "",
      college: activeInfo?.details?.[0]?.college || "",
      summary: typeof activeInfo?.detail !== "object" ? activeInfo?.detail || "" : "",
      other: typeof activeInfo?.detail !== "object" ? activeInfo?.detail || "" : "",
    });
  }, [activeSectionKey, information, sections]);

  useEffect(() => {
    setActiveInformation(information[sections[activeSectionKey]]);
  }, [information, sections, activeSectionKey]);

  useEffect(() => {
    const activeInfo = information[sections[activeSectionKey]];
    if (!activeInfo?.details || !activeInfo.details[activeDetailIndex]) return;
    setValues((prev) => ({
      ...prev,
      overview: activeInfo.details[activeDetailIndex]?.overview || "",
      link: activeInfo.details[activeDetailIndex]?.link || "",
      certificationLink: activeInfo.details[activeDetailIndex]?.certificationLink || "",
      companyName: activeInfo.details[activeDetailIndex]?.companyName || "",
      location: activeInfo.details[activeDetailIndex]?.location || "",
      startDate: activeInfo.details[activeDetailIndex]?.startDate || "",
      endDate: activeInfo.details[activeDetailIndex]?.endDate || "",
      points: activeInfo.details[activeDetailIndex]?.points
        ? [...activeInfo.details[activeDetailIndex].points]
        : [],
      title: activeInfo.details[activeDetailIndex]?.title || "",
      github: activeInfo.details[activeDetailIndex]?.github || "",
      college: activeInfo.details[activeDetailIndex]?.college || "",
    }));
  }, [activeDetailIndex, information, sections, activeSectionKey]);

  return (
    <div className="  w-full max-w-3xl mx-auto bg-white shadow-xl  flex flex-col gap-6 p-4 md:p-6 min-h-[450px]">
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        {Object.keys(sections).map((key) => (
          <div
            className={`px-4 py-2 text-base font-medium cursor-pointer whitespace-nowrap ${activeSectionKey === key ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            key={key}
            onClick={() => setActiveSectionKey(key)}
          >
            {sections[key]}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <InputControl
          label={t('resumebuild_editor_label_section_title')}
          placeholder={t('resumebuild_editor_placeholder_section_title')}
          value={sectionTitle}
          onChange={(event) => setSectionTitle(event.target.value)}
        />
        <div className="flex flex-wrap gap-4 items-center">
          {activeInformation?.details?.map((item, index) => (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-white font-medium cursor-pointer ${activeDetailIndex === index ? 'bg-blue-500' : 'bg-gray-500'}`}
              key={`${sections[activeSectionKey]}-${index}`}
              onClick={() => setActiveDetailIndex(index)}
            >
              <p>{`${sections[activeSectionKey]} ${index + 1}`}</p>
              <X
                className="h-4 w-4"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteDetail(index);
                }}
              />
            </div>
          ))}
          {activeInformation?.details?.length > 0 && (
            <div
              className="text-blue-500 font-bold cursor-pointer"
              onClick={handleAddNew}
            >
              {t('resumebuild_editor_button_add_new')}
            </div>
          )}
        </div>
        {generateBody()}
        <button
          onClick={handleSubmission}
          className="self-start px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-transform active:translate-y-0.5"
        >
          {t('resumebuild_editor_btn_save')}
        </button>
      </div>
    </div>
  );
}

export default Editor;