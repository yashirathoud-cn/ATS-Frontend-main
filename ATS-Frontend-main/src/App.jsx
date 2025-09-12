// filepath: c:\Users\Manav Gupta\Downloads\atsfrontend\ATS-Frontend\src\App.jsx
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;