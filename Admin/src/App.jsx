import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './Pages/LoginPages/Login.jsx'
import Dashboard from './Pages/MainPages/Dashboard.jsx';
import Users from './Pages/MainPages/Users.jsx';
import PendingGuides from './Pages/MainPages/PendingGuides.jsx';

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/pending-guides" element={<PendingGuides />} />
          </Route>
        </Route>
        
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
