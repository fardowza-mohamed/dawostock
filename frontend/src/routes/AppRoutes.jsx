import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Services from '../pages/public/Services';
import Contact from '../pages/public/Contact';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Medicines from '../pages/Medicines';
import MedicineForm from '../pages/MedicineForm';
import Suppliers from '../pages/Suppliers';
import Sales from '../pages/Sales';
import Reports from '../pages/Reports';
import Inventory from '../pages/Inventory';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Users from '../pages/Users';

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Staff / Admin Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected Dashboard & Management Portal */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route
          path="/medicines/new"
          element={
            <ProtectedRoute roles={['admin', 'pharmacist']}>
              <MedicineForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicines/:id/edit"
          element={
            <ProtectedRoute roles={['admin', 'pharmacist']}>
              <MedicineForm />
            </ProtectedRoute>
          }
        />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/sales" element={<Sales />} />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute roles={['admin', 'pharmacist']}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={['admin', 'pharmacist']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
