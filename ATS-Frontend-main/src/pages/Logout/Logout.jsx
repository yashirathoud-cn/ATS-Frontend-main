import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
 
const Logout = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg">{t('logout_logging_out')}</p>
    </div>
  );
};

export default Logout;

