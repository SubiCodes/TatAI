// components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'; // Your sidebar component

import { useState } from 'react';

const Layout = () => {
    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen flex-row">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;