

 
 
import React, { createContext, useContext, useState, useEffect } from 'react';
 
const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user data from token or API
    }
    setLoading(false);
  }, []);
 
  // Listen for authChange events (e.g., from Google login)
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
 
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);
 
  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
 
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setUser(data.user);
      window.dispatchEvent(new Event('authChange'));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
 
  const logout = () => {
    setLoading(true);
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
 
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="text-white text-lg font-semibold"></div>
      </div>
    );
  }
 
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 
export default AuthContext;
 
 

 
 
 
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
 
// const AuthContext = createContext(null);
 
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
 
 
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       setIsAuthenticated(true);
//       // Optionally fetch user data from token or API
//     }
//     setLoading(false);
//   }, []);
 
//   // Listen for authChange events (e.g., from Google login)
//   useEffect(() => {
//     const handleAuthChange = () => {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     };
 
//     window.addEventListener('authChange', handleAuthChange);
//     return () => window.removeEventListener('authChange', handleAuthChange);
//   }, []);
 
//   const login = async (email, password) => {
//     try {
//       const response = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
 
//       const data = await response.json();
 
//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }
 
//       localStorage.setItem('authToken', data.token);
//       setIsAuthenticated(true);
//       setUser(data.user);
//       window.dispatchEvent(new Event('authChange'));
//       return true;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };
 
//   const logout = () => {
//     localStorage.removeItem('authToken');
//     setIsAuthenticated(false);
//     setUser(null);
//     window.dispatchEvent(new Event('authChange'));
 
//   };
 
//   if (loading) {
//     return <div>Loading...</div>;
//   }
 
//   return (
//     <AuthContext.Provider value={{
//       isAuthenticated,
//       user,
//       login,
//       logout,
//       loading,setLoading
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
 
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
 
// export default AuthContext;
 
 
 