import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Premium.module.css";
import PremiumCard from "../Premium/PremiumCard";
import Particles from "./particles"; // Adjust path as needed

// Import images
import temp from "../../../assets/premium/template.png";
import writer from "../../../assets/premium/writer.png";
import checker from "../../../assets/premium/checker.png";
import ios from "../../../assets/premium/ios.png";
import design from "../../../assets/premium/design.png";

const Premium = () => {
  const { t } = useTranslation();

  // Premium features data (use translation keys)
  const premiumFeatures = [
    {
      image: temp,
      title: t("premium_feature_templates_title"),
      description: t("premium_feature_templates_desc"),
    },
    {
      image: writer,
      title: t("premium_feature_writer_title"),
      description: t("premium_feature_writer_desc"),
    },
    {
      image: checker,
      title: t("premium_feature_checker_title"),
      description: t("premium_feature_checker_desc"),
    },
    {
      image: ios,
      title: t("premium_feature_ios_title"),
      description: t("premium_feature_ios_desc"),
    },
    {
      image: design,
      title: t("premium_feature_design_title"),
      description: t("premium_feature_design_desc"),
    },
  ];

  return (
    <div className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={500}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={125}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 py-10 px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold inline-block px-4 md:px-6 py-2">
            {t("premium_why_go_premium")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-4">
            {t("premium_upgrade_trusted")}
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-20 px-4 sm:px-6 md:px-8">
          {premiumFeatures.map((feature, index) => (
            <PremiumCard
              key={index}
              image={feature.image}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;


// import React from "react";
// import PremiumCard from "../Premium/PremiumCard";
// import Particles from './particles';

// // Import images
// import temp from "../../../assets/premium/template.png";
// import writer from "../../../assets/premium/writer.png";
// import checker from "../../../assets/premium/checker.png";
// import ios from "../../../assets/premium/ios.png";
// import design from "../../../assets/premium/design.png";

// // Premium features data
// const premiumFeatures = [
//   {
//     image: temp,
//     title: "20+ Customizable Resume Templates",
//     description:
//       "Access 20+ stunning premium templates designed by expert typographers and graphic designers, beyond the free basic resume options.",
//   },
//   {
//     image: writer,
//     title: "AI Resume Writer",
//     description:
//       "Let AI write your resume for you. You can use AI to write your entire resume, analyze your job skills, and tailor the content to the job you're applying for.",
//   },
//   {
//     image: checker,
//     title: "AI Resume Checker",
//     description:
//       "Improve your resume with the AI Resume Checker tool. It will analyze your resume and give you personalized tips on how to improve it.",
//   },
//   {
//     image: ios,
//     title: "CV Resume for iOS & Android",
//     description:
//       "All premium features are available on the CV Resume app for iOS and Android. Download the app to get started on your resume anytime, anywhere.",
//   },
//   {
//     image: design,
//     title: "1,000 Possible Design Combinations",
//     description:
//       "Every template comes with its own set of alternate color schemes, fonts, and formatting options. Customize your resume in one million different ways and make it truly yours.",
//   },
// ];

// const Premium = () => {
//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Hyperspeed background */}
//       <div className="absolute inset-0 -z-10 bg-black">

// <div style={{ width: '100%', height: '600px', position: 'relative' }}>
//   <Particles
//     particleColors={['#ffffff', '#ffffff']}
//     particleCount={200}
//     particleSpread={10}
//     speed={0.1}
//     particleBaseSize={100}
//     moveParticlesOnHover={true}
//     alphaParticles={false}
//     disableRotation={false}
//   />
// </div>
//       </div>

//       {/* Premium content */}
//       <div className="text-white py-10 px-4">
//         {/* Header Section */}
//         <div className="text-center mb-8 md:mb-12 px-4">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold inline-block px-4 md:px-6 py-2 bg-black bg-opacity-70 rounded">
//             WHY GO PREMIUM?
//           </h1>
//           <p className="text-base sm:text-lg md:text-xl mt-4 bg-black bg-opacity-50 p-2 rounded">
//             Join 1000+ happy customers.
//           </p>
//         </div>

//         {/* Premium Features Grid */}
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-20 px-4 sm:px-6 md:px-8">
//           {premiumFeatures.map((feature, index) => (
//             <PremiumCard
//               key={index}
//               image={feature.image}
//               title={feature.title}
//               description={feature.description}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Premium;
