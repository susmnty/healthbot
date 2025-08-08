import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Import the new Layout component
import Layout from './components/Layout'; 
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound'; // Import the new NotFound page

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          {/* The Routes component now controls the entire page view */}
          <Routes>
            {/* Routes outside the main layout (like a dedicated landing page) */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes that share the main layout (with Navbar) */}
            <Route element={<Layout />}>
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              {/* You can add more routes that use the Navbar here */}
              {/* e.g., <Route path="/profile" element={<Profile />} /> */}
            </Route>

            {/* Catch-all 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;