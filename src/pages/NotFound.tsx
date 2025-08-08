// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <Link to="/home" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;