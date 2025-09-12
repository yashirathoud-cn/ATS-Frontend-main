import resumeSvg from "../../../assets/resume.svg";
import Threads from "../background/Threads"; // Import the Threads component
import { useTranslation, Trans } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full min-h-[100vh] bg-black">
      {/* Threads background */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <Threads amplitude={2} distance={0.5} enableMouseInteraction={true} />
      </div>

      {/* Header content */}
      <div className="relative flex flex-col md:flex-row items-center justify-evenly gap-8 p-8 md:p-12 w-full min-h-[100vh] z-10">
        <div className="text-center md:text-left max-w-lg">
          <p className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            <Trans i18nKey="resumebuild_header_title">
              Craft a <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Resume</span> That Shines!
            </Trans>
          </p>
          <p className="text-4xl md:text-5xl font-bold text-white leading-tight">
            <Trans i18nKey="resumebuild_header_subtitle">
              Your Dream Job Starts Here. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">completely free!</span>
            </Trans>
          </p>
        </div>
        <div>
          <img
            src={resumeSvg}
            alt={t("resumebuild_header_resume_alt")}
            className="w-64 md:w-96"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
