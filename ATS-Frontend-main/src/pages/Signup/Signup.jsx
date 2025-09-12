import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundVideo from '../../assets/video/vid.mp4';
 
const Signup = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
 
  // Google OAuth Config
  const googleClientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_APP_GOOGLE_REDIRECT_URI;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 
  const handleGoogleSignIn = () => {
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
 
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        throw new Error(data.message || t('signup_error_default'));
      }
 
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        window.dispatchEvent(new Event('authChange'));
      }
 
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('signup_error_default'));
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 1000);
 
      return () => clearTimeout(redirectTimer);
    }
  }, [success, navigate]);
 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
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
 
      <div className="w-full max-w-md mx-auto p-4 bg-black/10 rounded-xl shadow-lg z-20">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">{t('signup_heading')}</h1>
 
        {error && (
          <div className="mb-2 p-2 bg-red-900/80 text-white text-sm rounded-lg">
            {error}
          </div>
        )}
 
        {success && (
          <div className="mb-2 p-2 bg-green-900/80 text-white text-sm rounded-lg">
            {t('signup_success')}
          </div>
        )}
 
        {/* Google OAuth Button */}
        <div className="flex justify-center mb-3">
          <button
            className="bg-black/50 border border-gray-700 text-white flex items-center justify-center p-1.5 rounded-lg w-full hover:bg-black/70 transition-colors duration-300"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.4 33.7 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l6-6C34.2 5.4 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.3-7.7 20.3-21 0-1.2-.1-2.1-.3-3.5z"/>
            </svg>
            {t('signup_google')}
          </button>
        </div>
 
        {/* Divider */}
        <div className="relative flex items-center my-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-2 text-gray-300 text-sm">{t('signup_or')}</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="name" className="block text-white text-sm mb-1">
              {t('signup_name_label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              required
              placeholder={t('signup_name_placeholder')}
            />
          </div>
 
          <div>
            <label htmlFor="email" className="block text-white text-sm mb-1">
              {t('signup_email_label')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              required
              placeholder={t('signup_email_placeholder')}
            />
          </div>
 
          <div>
            <label htmlFor="password" className="block text-white text-sm mb-1">
              {t('signup_password_label')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
                minLength="8"
                required
                placeholder={t('signup_password_placeholder')}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                aria-label={showPassword ? t('signup_hide_password') : t('signup_show_password')}
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
            {isLoading ? t('signup_creating') : t('signup_create_btn')}
          </button>
        </form>
        <div className="mt-3 text-center">
          <p className="text-white text-sm">
            {t('signup_already_have_account')}{' '}
            <Link to="/login" className="text-red-500 hover:underline">{t('signup_signin')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Signup;
 



// import React, { useState, useEffect } from 'react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import backgroundVideo from '../../assets/video/vid.mp4';
 
// const Signup = () => {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     username: '',
//     name: '',
//     email: '',
//     password: ''
//   });
//   const [otp, setOtp] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const navigate = useNavigate();
 
//   // Google OAuth Config
//   const googleClientId =import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
//   const redirectUri = import.meta.env.VITE_APP_GOOGLE_REDIRECT_URI;
 
//   const handleChange = (e) => {
//     const { name
 
// , value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//   };
 
//   const handleGoogleSignIn = () => {
//     const params = new URLSearchParams({
//       client_id: googleClientId,
//       redirect_uri: redirectUri,
//       response_type: 'code',
//       scope: 'openid email profile',
//       access_type: 'offline',
//       prompt: 'consent'
//     });
//     window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
//   };

//   const startResendTimer = () => {
//     setResendTimer(60);
//     const timer = setInterval(() => {
//       setResendTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
 
//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
 
//       const data = await response.json();
 
//       if (!response.ok) {
//         throw new Error(data.message || t('signup_error_default'));
//       }
 
//       // OTP sent successfully
//       setOtpSent(true);
//       startResendTimer();
//       setError(null);
      
//     } catch (err) {
//       setError(err.message || t('signup_error_default'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpVerification = async (e) => {
//     e.preventDefault();
//     setIsVerifyingOtp(true);
//     setError(null);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/verify-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           otp: otp
//         }),
//       });

//       const data = await response.json();
 
//       if (!response.ok) {
//         throw new Error(data.message || t('otp_verification_error'));
//       }
//       if (data.token) {
//         localStorage.setItem('authToken', data.token);
//         window.dispatchEvent(new Event('authChange'));
//       }
 
//       setSuccess(true);
//     } catch (err) {
//       setError(err.message || t('otp_verification_error'));
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (resendTimer > 0) return;
    
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/resend-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: formData.email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || t('resend_otp_error'));
//       }

//       startResendTimer();
//       setError(null);
      
//     } catch (err) {
//       setError(err.message || t('resend_otp_error'));
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   useEffect(() => {
//     if (success) {
//       const redirectTimer = setTimeout(() => {
//         navigate('/');
//       }, 1000);
 
//       return () => clearTimeout(redirectTimer);
//     }
//   }, [success, navigate]);
 
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
 
//   return (
//     <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
//       {/* Background Video */}
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover z-0"
//       >
//         <source src={backgroundVideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
 
//       <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
 
//       <div className="w-full max-w-md mx-auto p-4 bg-black/10 rounded-xl shadow-lg z-20">
//         <h1 className="text-white text-2xl font-bold mb-6 text-center">
//           {otpSent ? t('verify_otp_heading') : t('signup_heading')}
//         </h1>
 
//         {error && (
//           <div className="mb-2 p-2 bg-red-900/80 text-white text-sm rounded-lg">
//             {error}
//           </div>
//         )}
 
//         {success && (
//           <div className="mb-2 p-2 bg-green-900/80 text-white text-sm rounded-lg">
//             {t('signup_success')}
//           </div>
//         )}

//         {!otpSent ? (
//           <>
//             {/* Google OAuth Button */}
//             <div className="flex justify-center mb-3">
//               <button
//                 className="bg-black/50 border border-gray-700 text-white flex items-center justify-center p-1.5 rounded-lg w-full hover:bg-black/70 transition-colors duration-300"
//                 onClick={handleGoogleSignIn}
//               >
//                 <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
//                   <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.4 33.7 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l6-6C34.2 5.4 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.3-7.7 20.3-21 0-1.2-.1-2.1-.3-3.5z"/>
//                 </svg>
//                 {t('signup_google')}
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="relative flex items-center my-8">
//               <div className="flex-grow border-t border-gray-400"></div>
//               <span className="flex-shrink mx-2 text-gray-300 text-sm">{t('signup_or')}</span>
//               <div className="flex-grow border-t border-gray-400"></div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-2">
//               <div>
//                 <label htmlFor="username" className="block text-white text-sm mb-1">
//                   {t('signup_username_label')} <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
//                   required
//                   placeholder={t('signup_username_placeholder')}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="name" className="block text-white text-sm mb-1">
//                   {t('signup_name_label')} <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
//                   required
//                   placeholder={t('signup_name_placeholder')}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-white text-sm mb-1">
//                   {t('signup_email_label')} <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
//                   required
//                   placeholder={t('signup_email_placeholder')}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-white text-sm mb-1">
//                   {t('signup_password_label')} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
//                     minLength="8"
//                     required
//                     placeholder={t('signup_password_placeholder')}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
//                     aria-label={showPassword ? t('signup_hide_password') : t('signup_show_password')}
//                   >
//                     {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-red-700 hover:bg-red-900 text-white py-2 rounded-lg transition-colors duration-300 shadow-lg mt-3"
//                 disabled={isLoading}
//               >
//                 {isLoading ? t('signup_sending_otp') : t('signup_send_otp')}
//               </button>
//             </form>
//           </>
//         ) : (
//           /* OTP Verification Form */
//           <form onSubmit={handleOtpVerification} className="space-y-4">
//             <div className="text-center mb-4">
//               <p className="text-white text-sm mb-2">
//                 {t('otp_sent_message')} <strong>{formData.email}</strong>
//               </p>
//               <p className="text-gray-300 text-xs">
//                 {t('otp_check_spam')}
//               </p>
//             </div>

//             <div>
//               <label htmlFor="otp" className="block text-white text-sm mb-1">
//                 {t('otp_label')} <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="otp"
//                 name="otp"
//                 value={otp}
//                 onChange={handleOtpChange}
//                 className="w-full bg-black/50 border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent text-center text-lg tracking-widest"
//                 required
//                 placeholder="000000"
//                 maxLength="6"
//                 pattern="[0-9]{6}"
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
//               >
//                 {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-red-700 hover:bg-red-900 text-white py-2 rounded-lg transition-colors duration-300 shadow-lg"
//               disabled={isVerifyingOtp || otp.length !== 6}
//             >
//               {isVerifyingOtp ? t('verifying_otp') : t('verify_otp')}
//             </button>

//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 className={`text-sm ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:underline'}`}
//                 disabled={resendTimer > 0 || isLoading}
//               >
//                 {resendTimer > 0 
//                   ? `${t('resend_otp_timer')} ${resendTimer}s` 
//                   : t('resend_otp')
//                 }
//               </button>
//             </div>

//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setOtpSent(false);
//                   setOtp('');
//                   setError(null);
//                 }}
//                 className="text-white text-sm hover:underline"
//               >
//                 {t('back_to_signup')}
//               </button>
//             </div>
//           </form>
//         )}

//         {!otpSent && (
//           <div className="mt-3 text-center">
//             <p className="text-white text-sm">
//               {t('signup_already_have_account')}{' '}
//               <Link to="/login" className="text-red-500 hover:underline">{t('signup_signin')}</Link>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
 
// export default Signup;
