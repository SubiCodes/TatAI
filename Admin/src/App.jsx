import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './Pages/LoginPages/Login.jsx'
import Dashboard from './Pages/MainPages/Dashboard.jsx';
import Users from './Pages/MainPages/Users.jsx';
import Guides from './Pages/MainPages/Guides.jsx';
import Settings from './Pages/MainPages/Settings/Settings.jsx';
import ForgotPassword from './Pages/MainPages/Settings/ForgotPassword.jsx';
import ViewAccount from './Pages/MainPages/ViewAccount.jsx';
import AddGuide from './Pages/MainPages/AddGuide.jsx';
import EditGuide from './Pages/MainPages/EditGuide.jsx';

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/view-account/:id" element={<ViewAccount />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/pending-guides" element={<Guides />} />
            <Route path="/add-guide" element={<AddGuide />} />
            <Route path="/edit-guide/:id" element={<EditGuide />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
       
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
