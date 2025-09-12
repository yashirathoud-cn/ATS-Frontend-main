 
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundVideo from '../../assets/video/vid.mp4';
 
const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  // Redirect to the originating page or homepage
  const redirectTo = location.state?.from?.pathname || '/';
 
  // Google OAuth Config
  const googleClientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_APP_GOOGLE_REDIRECT_URI;
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
 
  const handleGoogleSignIn = () => {
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: encodeURIComponent(redirectTo), // Pass redirectTo as state
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        throw new Error(data.message || t('login_error_default'));
      }
 
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        window.dispatchEvent(new Event('authChange'));
      }
 
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('login_error_default'));
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [success, navigate, redirectTo]);
 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="w-full max-w-md mx-auto p-6 bg-black/10 rounded-xl shadow-lg z-20">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">{t('login_heading')}</h1>
        {error && (
          <div className="mb-2 p-2 bg-red-900/80 text-white text-sm rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-2 p-2 bg-green-900/80 text-white text-sm rounded-lg">
            {t('login_success')}
          </div>
        )}
        <div className="flex justify-center mb-3">
          <button
            className="bg-black/50 border border-gray-700 text-white flex items-center justify-center p-1.5 rounded-lg w-full hover:bg-black/70 transition-colors duration-300"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.4 33.7 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l6-6C34.2 5.4 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.3-7.7 20.3-21 0-1.2-.1-2.1-.3-3.5z"/>
            </svg>
            {t('login_google')}
          </button>
        </div>
        <div className="relative flex items-center my-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-2 text-gray-300 text-sm">{t('login_or')}</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="email" className="block text-white text-sm mb-1">
              {t('login_email_label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              required
              placeholder={t('login_email_placeholder')}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white text-sm mb-1">
              {t('login_password_label')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
                required
                placeholder={t('login_password_placeholder')}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                aria-label={showPassword ? t('login_hide_password') : t('login_show_password')}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-900 text-white py-2 rounded-lg transition-colors duration-300 shadow-lg mt-3"
            disabled={isLoading}
          >
            {isLoading ? t('login_signing_in') : t('login_signin_btn')}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-white">
            {t('login_not_registered')}{' '}
            <Link to="/signup" className="text-red-500 hover:underline">{t('login_create_account')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Login;

//  import React, { useState, useEffect, useMemo } from 'react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import backgroundVideo from '../../assets/video/vid.mp4';

// // ---- PKCE helpers ----
// const base64url = (buf) =>
//   btoa(String.fromCharCode(...new Uint8Array(buf)))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');

// async function makePkce() {
//   const array = new Uint8Array(32);
//   crypto.getRandomValues(array);
//   const verifier = base64url(array);
//   const enc = new TextEncoder().encode(verifier);
//   const digest = await crypto.subtle.digest('SHA-256', enc);
//   const challenge = base64url(new Uint8Array(digest));
//   return { verifier, challenge };
// }

// // ---- Redirect safety: only allow same-origin paths ----
// function safeRedirectPath(path) {
//   if (typeof path !== 'string') return '/';
//   // Must be a relative path starting with "/"
//   if (!path.startsWith('/')) return '/';
//   // Prevent protocol-relative or double slashes like //evil.com
//   if (path.startsWith('//')) return '/';
//   return path;
// }

// const Login = () => {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const redirectToRaw = location.state?.from?.pathname || '/';
//   const redirectTo = useMemo(() => safeRedirectPath(redirectToRaw), [redirectToRaw]);

//   // Google OAuth config (from Vite env)
//   const googleClientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
//   const redirectUri = import.meta.env.VITE_APP_GOOGLE_REDIRECT_URI; // e.g. https://yourapp.com/auth/google/callback
//   const googleReady = Boolean(googleClientId && redirectUri);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const togglePasswordVisibility = () => setShowPassword((s) => !s);

//   const handleGoogleSignIn = async () => {
//     if (!googleReady || isLoading) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const { verifier, challenge } = await makePkce();
//       sessionStorage.setItem('pkce_verifier', verifier);

//       const nonce = crypto.randomUUID();
//       sessionStorage.setItem('oauth_state_nonce', nonce);

//       // Put both nonce (for CSRF) and intended redirect path in state
//       const stateObj = { n: nonce, r: redirectTo };
//       const state = encodeURIComponent(JSON.stringify(stateObj));

//       const params = new URLSearchParams({
//         client_id: googleClientId,
//         redirect_uri: redirectUri,
//         response_type: 'code',
//         scope: 'openid email profile',
//         access_type: 'offline',
//         prompt: 'consent',
//         state,
//         code_challenge: challenge,
//         code_challenge_method: 'S256',
//       });

//       window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
//     } catch (e) {
//       console.error(e);
//       setError(t('login_error_default'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isLoading) return;
//     setIsLoading(true);
//     setError(null);

//     try {
//       const resp = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         // If your backend sets httpOnly cookies, include credentials:
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });

//       let data = null;
//       try {
//         data = await resp.json();
//       } catch {
//         // some backends send plain text on error
//       }

//       if (!resp.ok) {
//         throw new Error(data?.message || t('login_error_default'));
//       }

//       // If you *also* return a token (SPA fallback), store it:
//       if (data?.token) {
//         localStorage.setItem('authToken', data.token);
//         window.dispatchEvent(new Event('authChange'));
//       }

//       setSuccess(true);
//     } catch (err) {
//       setError(err?.message || t('login_error_default'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (success) {
//       const redirectTimer = setTimeout(() => {
//         navigate(redirectTo, { replace: true });
//       }, 1200);
//       return () => clearTimeout(redirectTimer);
//     }
//   }, [success, navigate, redirectTo]);

//   return (
//     <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         preload="none"
//         className="absolute inset-0 w-full h-full object-cover z-0"
//       >
//         <source src={backgroundVideo} type="video/mp4" />
//         {/* Fallback text */}
//         Your browser does not support the video tag.
//       </video>

//       <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

//       <div className="w-full max-w-md mx-auto p-6 bg-black/10 rounded-xl shadow-lg z-20">
//         <h1 className="text-white text-2xl font-bold mb-6 text-center">
//           {t('login_heading')}
//         </h1>

//         {error && (
//           <div className="mb-2 p-2 bg-red-900/80 text-white text-sm rounded-lg" aria-live="polite">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-2 p-2 bg-green-900/80 text-white text-sm rounded-lg" aria-live="polite">
//             {t('login_success')}
//           </div>
//         )}

//         <div className="flex justify-center mb-3">
//           <button
//             type="button"
//             disabled={!googleReady || isLoading}
//             className="bg-black/50 border border-gray-700 text-white flex items-center justify-center p-1.5 rounded-lg w-full hover:bg-black/70 transition-colors duration-300 disabled:opacity-60"
//             onClick={handleGoogleSignIn}
//             aria-disabled={!googleReady || isLoading}
//           >
//             <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
//               <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.4 33.7 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l6-6C34.2 5.4 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.3-7.7 20.3-21 0-1.2-.1-2.1-.3-3.5z"/>
//             </svg>
//             {t('login_google')}
//           </button>
//         </div>

//         <div className="relative flex items-center my-8">
//           <div className="flex-grow border-t border-gray-400"></div>
//           <span className="flex-shrink mx-2 text-gray-300 text-sm">{t('login_or')}</span>
//           <div className="flex-grow border-t border-gray-400"></div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-2" aria-busy={isLoading}>
//           <div>
//             <label htmlFor="email" className="block text-white text-sm mb-1">
//               {t('login_email_label')} <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
//               required
//               autoComplete="email"
//               placeholder={t('login_email_placeholder')}
//               inputMode="email"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-white text-sm mb-1">
//               {t('login_password_label')} <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
//                 required
//                 autoComplete="current-password"
//                 placeholder={t('login_password_placeholder')}
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
//                 aria-label={showPassword ? t('login_hide_password') : t('login_show_password')}
//               >
//                 {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-red-700 hover:bg-red-900 text-white py-2 rounded-lg transition-colors duration-300 shadow-lg mt-3 disabled:opacity-60"
//             disabled={isLoading}
//           >
//             {isLoading ? t('login_signing_in') : t('login_signin_btn')}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-white">
//             {t('login_not_registered')}{' '}
//             <Link to="/signup" className="text-red-500 hover:underline">
//               {t('login_create_account')}
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
