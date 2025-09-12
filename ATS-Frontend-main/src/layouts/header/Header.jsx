import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Adjust path as needed
import logo from "../../assets/images/logo2.png"; // Adjust path as needed
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from 'react-i18next';
 
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false); // State for Features submenu
  const [isResumeOpen, setIsResumeOpen] = useState(false); // State for Resume submenu
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const {logout} = useAuth();
  const { t, i18n } = useTranslation();
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const mobileLangRef = useRef();
 
  // Check if user is logged in on component mount AND when storage changes
  useEffect(() => {
    // Check if user has an auth token in localStorage or sessionStorage
    const checkAuthStatus = () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
 
    // Initial check
    checkAuthStatus();
 
    // Add event listener for storage changes
    window.addEventListener("storage", checkAuthStatus);
 
    // Custom event listener for auth changes
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener("authChange", handleAuthChange);
 
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);
 
  // Close mobile language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target)) {
        setIsMobileLangOpen(false);
      }
    }
    if (isMobileLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileLangOpen]);
 
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Reset submenus when closing the mobile menu
    if (isMobileMenuOpen) {
      setIsFeaturesOpen(false);
      setIsResumeOpen(false);
    }
  };
 
  const toggleFeatures = () => {
    setIsFeaturesOpen(!isFeaturesOpen);
  };
 
  const toggleResume = () => {
    setIsResumeOpen(!isResumeOpen);
  };
 
  const handleLogout = () => {
    logout();
    navigate("/");
  };
 
  // Add this function to handle language change
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };
 
  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md xl:px-8 --font-primary">
      <div className="max-lg:px-8 px-2 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="site-logo">
          <Link to="/" className="flex items-center">
            <img
              className="h-9 w-auto transition-transform"
              src={logo}
              alt="logo"
            />
          </Link>
        </div>
 
        {/* Desktop Menu */}
        <nav className="hidden custom-desktop:flex items-center space-x-8">
          <ul className="flex space-x-6 items-center">
            {/* Features Dropdown */}
            <li className="relative group">
              <div className="flex items-center text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gray-300 cursor-pointer">
                <span className="text-lg">{t('header_features')}</span>
                <svg
                  className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul className="submenu absolute left-0 top-full mt-2 w-48 bg-white text-black shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transform scale-95 group-hover:scale-100 transition-all duration-300">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('header_ats_score_checker')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume-builder"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('header_resume_builder')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/job_recommendations"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('header_job_recommendation')}
                  </Link>
                </li>
              </ul>
            </li>
 
            {/* Resume Dropdown */}
            <li className="relative group">
              <div className="flex items-center text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gray-300 cursor-pointer">
                <span className="text-lg">{t('header_resume')}</span>
                <svg
                  className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul className="submenu absolute left-0 top-full mt-2 w-48 bg-white text-black shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transform scale-95 group-hover:scale-100 transition-all duration-300">
                <li>
                  <Link
                    to="/resume_writer"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('header_resume_writer')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume_template"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('header_resume_templates')}
                  </Link>
                </li>
              </ul>
            </li>
 
            {/* Pricing */}
            <li>
              <Link
                to="/pricing"
                className="text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gray-300"
              >
                <span className="text-lg">{t('header_pricing')}</span>
              </Link>
            </li>
          </ul>
 
          {/* Auth Buttons - Show either Login/Signup or Logout */}
          <div className="flex space-x-4 items-center">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center px-2 py-1 rounded hover:bg-gray-700 transition-colors" aria-label="Change language">
                {/* New Globe Icon (Heroicons/FontAwesome) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9z" />
                </svg>
                <span className="uppercase text-sm">
                  {i18n.language === 'hi' ? 'हिंदी' : i18n.language === 'fr' ? 'FR' : i18n.language === 'es' ? 'ES' : 'EN'}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-28 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 z-50">
                <button onClick={() => handleLanguageChange('en')} className="block w-full px-4 py-2 text-left hover:bg-gray-200">English</button>
                <button onClick={() => handleLanguageChange('hi')} className="block w-full px-4 py-2 text-left hover:bg-gray-200">हिंदी</button>
                <button onClick={() => handleLanguageChange('fr')} className="block w-full px-4 py-2 text-left hover:bg-gray-200">Français</button>
                <button onClick={() => handleLanguageChange('es')} className="block w-full px-4 py-2 text-left hover:bg-gray-200">Español</button>
              </div>
            </div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium uppercase bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
              >
                {t('logout')}
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium uppercase border border-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium uppercase border border-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </nav>
 
        {/* Mobile Hamburger */}
        <div className="custom-desktop:hidden">
          <button
            className="focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
 
      {/* Mobile Menu (Custom Toggle) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } custom-desktop:hidden z-50`}
      >
        <div className="flex justify-between items-center p-4">
          <h5 className="text-lg font-medium uppercase">{t('header_menu')}</h5>
          <button
            className="focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Close mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {/* Mobile Language Switcher with Dropdown */}
          <div className="mb-4" ref={mobileLangRef}>
            <button
              className="flex items-center w-full px-2 py-2 rounded hover:bg-gray-800 transition-colors focus:outline-none"
              onClick={() => setIsMobileLangOpen((open) => !open)}
              aria-label="Change language"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0c2.21 0 4 4.03 4 9s-1.79 9-4 9-4-4.03-4-9 1.79-9 4-9z" />
              </svg>
              <span className="uppercase text-sm font-semibold flex-1 text-left">
                {i18n.language === 'hi' ? 'हिंदी' : i18n.language === 'fr' ? 'FR' : i18n.language === 'es' ? 'ES' : 'EN'}
              </span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${isMobileLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isMobileLangOpen && (
              <div className="mt-2 bg-black border border-gray-700 rounded shadow-lg flex flex-col">
                <button onClick={() => { handleLanguageChange('en'); setIsMobileLangOpen(false); }} className="block w-full px-4 py-2 text-left rounded hover:bg-gray-800">English</button>
                <button onClick={() => { handleLanguageChange('hi'); setIsMobileLangOpen(false); }} className="block w-full px-4 py-2 text-left rounded hover:bg-gray-800">हिंदी</button>
                <button onClick={() => { handleLanguageChange('fr'); setIsMobileLangOpen(false); }} className="block w-full px-4 py-2 text-left rounded hover:bg-gray-800">Français</button>
                <button onClick={() => { handleLanguageChange('es'); setIsMobileLangOpen(false); }} className="block w-full px-4 py-2 text-left rounded hover:bg-gray-800">Español</button>
              </div>
            )}
          </div>
          <ul className="space-y-4">
            {/* Features with Submenu */}
            <li>
              <div
                className="flex items-center justify-between text-lg font-medium uppercase hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                onClick={toggleFeatures}
              >
                Features
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isFeaturesOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {isFeaturesOpen && (
                <ul className="mt-2 space-y-2 pl-2">
                  <li>
                    <Link
                      to="/resume-builder"
                      className="block text-sm hover:text-gray-300 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {t('header_resume_builder')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="block text-sm hover:text-gray-300 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {t('header_ats_score_checker')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/job-recommendation"
                      className="block text-sm hover:text-gray-300 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {t('header_job_recommendation')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
 
            {/* Resume with Submenu */}
            <li>
              <div
                className="flex items-center justify-between text-lg font-medium uppercase hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                onClick={toggleResume}
              >
                Resume
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isResumeOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {isResumeOpen && (
                <ul className="mt-2 space-y-2 pl-2">
                  <li>
                    <Link
                      to="/resume_writer"
                      className="block text-sm hover:text-gray-300 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {t('header_resume_writer')}
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="/services/resume-checker"
                      className="block text-sm hover:text-gray-300 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      Resume Checker
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="/resume_template"
                      className="block text-sm hover:text-gray-300 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                    >
                      {t('header_resume_templates')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
 
            {/* Pricing */}
            <li>
              <Link
                to="/pricing"
                className="text-lg font-medium uppercase hover:text-gray-300 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                {t('header_pricing')}
              </Link>
            </li>
 
            {/* Auth Links - Show either Login/Signup or Logout */}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="text-lg font-medium uppercase text-red-500 hover:text-red-400 transition-colors duration-200"
                >
                  {t('logout')}
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-lg font-medium uppercase hover:text-gray-300 transition-colors duration-200"
                    onClick={toggleMobileMenu}
                  >
                    {t('login')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-lg font-medium uppercase hover:text-gray-300 transition-colors duration-200"
                    onClick={toggleMobileMenu}
                  >
                    {t('signup')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
 
      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 custom-desktop:hidden z-40"
          onClick={toggleMobileMenu}
        />
      )}
    </header>
  );
}
export default Header;
 