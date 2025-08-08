// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;