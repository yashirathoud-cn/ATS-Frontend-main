
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/home/Home";
import ResumeBuilder from "../pages/Resume_builder/ResumeBuilder";
import Pricing from "../pages/pricing/Pricing";
import AtsScorePage from "../pages/AtsScorePage/AtsScorePage";
import JobRecommendation from "../pages/JobRecommendation/JobRecommendation";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";
import UnderConstruction from "../pages/construction/UnderConstruction";
import Resumebuild from "../pages/resumebuild/Resumebuild";
import ResumeTemplates from "../pages/ResumeTemplate/ResumeTemplates";
import ImproveResume from "../pages/Template/ImproveResume";
import ImproveResume2 from "../pages/Template/ImproveResume2";
import ImproveResume3 from "../pages/Template/ImproveResume3";
import ImproveResume4 from "../pages/Template/ImproveResume4";
import ImproveResume5 from "../pages/Template/ImproveResume5";
import ImproveResume6 from "../pages/Template/ImproveResume6";
import ScrollToTop from "../layouts/ScrollToTop"; // Import the ScrollToTop component
import ProtectedRoute from "./ProtectedRoute";
// import Logout from "../pages/Logout/Logout";

const AppRoutes = () => {
  return (
    <Router>
        <ScrollToTop />
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="ats-score" element={<AtsScorePage />} />
          <Route path="job_recommendations" element={
            <ProtectedRoute>
              <JobRecommendation />
            </ProtectedRoute>
          } />
          <Route path="under_construction" element={<UnderConstruction />} />
          <Route path="resume_writer" element={<Resumebuild />} />
          <Route path="resume_template" element={
            <ProtectedRoute>
              <ResumeTemplates />
             </ProtectedRoute>
          } />
          <Route path="improve_resume/:analysisId/:templateId" element={<ImproveResume />} />
          <Route path="improve_resume2/:analysisId/:templateId" element={<ImproveResume2 />} />
          <Route path="improve_resume3/:analysisId/:templateId" element={<ImproveResume3 />} />
          <Route path="improve_resume4/:analysisId/:templateId" element={<ImproveResume4 />} />
          <Route path="improve_resume5/:analysisId/:templateId" element={<ImproveResume5 />} />
          <Route path="improve_resume6/:analysisId/:templateId" element={<ImproveResume6 />} />
        </Route>
         
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        {/* <Route path="logout" element={
            <Logout />
        } /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
