import { Link } from "react-router-dom";
import logo from "../../assets/images/logo2.png";
import "./Footer.css";
import { useTranslation } from 'react-i18next';
 
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col space-y-4 gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Cloud Nexus Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-sm">
              {t('footer_slogan')}
            </p>
            <p className="text-sm">
              {t('footer_address')}
            </p>
          </div>
 
          {/* Features Links */}
          <div className="flex flex-col space-x-4">
            <h3 className="text-lg font-semibold uppercase mb-4">{t('header_features')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/resume-builder"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  {t('header_resume_builder')}
                </Link>
              </li>
 
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  {t('header_ats_score_checker')}
                </Link>
              </li>
 
              <li>
                <Link
                  to="/job_recommendations"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  {t('header_job_recommendation')}
                </Link>
              </li>
 
              {/* <li>
                <Link
                  to="/services/job-apply"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  Job Apply
                </Link>
              </li> */}
 
 
            </ul>
          </div>
 
          {/* Resume Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold uppercase mb-4">{t('header_resume')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/resume_writer"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  {t('header_resume_writer')}
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/services/resume-checker"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  Resume Checker
                </Link>
              </li> */}
              <li>
                <Link
                  to="/resume_template"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  {t('header_resume_templates')}
                </Link>
              </li>
            </ul>
          </div>
 
          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold uppercase mb-4">
              {t('footer_contact_header')}
            </h3>
            <ul className="space-y-2">
              <li className="text-sm">+91 8793830447</li>
              <li className="text-sm">
                <a
                  href="mailto:support@cn.com"
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  work@cloudnexus.in                </a>
              </li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://twitter.comh/eqegeq"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cloudnexus.in?igsh=dHZzczFiMjByMXU3"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 0H8C3.6 0 0 3.6 0 8v8c0 4.4 3.6 8 8 8h8c4.4 0 8-3.6 8-8V8c0-4.4-3.6-8-8-8zm0 2c3.3 0 6 2.7 6 6v8c0 3.3-2.7 6-6 6H8c-3.3 0-6-2.7-6-6V8c0-3.3 2.7-6 6-6h8zM12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm4-9.5c0 .8-.7 1.5-1.5 1.5S13 7.3 13 6.5 13.7 5 14.5 5 16 5.7 16 6.5z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/cloudnexusorg/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
 
export default Footer;