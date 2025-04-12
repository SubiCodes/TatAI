import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './Pages/LoginPages/Login.jsx'
import Dashboard from './Pages/MainPages/Dashboard.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
