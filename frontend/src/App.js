import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Resources from './pages/Resources';
import AppointmentsPage from './pages/AppointmentsPage';
import { AuthContext } from './contexts/AuthContext';

function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="center">Loading…</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'therapist' ? '/therapist-dashboard' : '/client-dashboard'} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/client-dashboard" element={<PrivateRoute role="client"><ClientDashboard/></PrivateRoute>} />
          <Route path="/therapist-dashboard" element={<PrivateRoute role="therapist"><TherapistDashboard/></PrivateRoute>} />

          <Route path="/mood" element={<PrivateRoute><MoodTracker/></PrivateRoute>} />
          <Route path="/journal" element={<PrivateRoute><Journal/></PrivateRoute>} />
          <Route path="/resources" element={<PrivateRoute><Resources/></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><AppointmentsPage/></PrivateRoute>} />

          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
