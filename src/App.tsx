import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthenticatedApp from './components/auth/AuthenticatedApp';
import UnauthenticatedApp from './components/auth/UnauthenticatedApp';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/Toaster';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      <Toaster />
    </>
  );
}

export default App;