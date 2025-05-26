import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import { UserRole } from './types';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentGroupsPage from './pages/StudentGroupsPage';
import StudentGroupDetailPage from './pages/StudentGroupDetailPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminGroupsPage from './pages/AdminGroupsPage';
import AdminGroupDetailPage from './pages/AdminGroupDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Root Route - Redirects based on role */}
          <Route path="/" element={<RoleBasedRoute><div /></RoleBasedRoute>} />
          
          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole={UserRole.STUDENT}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole={UserRole.STUDENT}>
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute requiredRole={UserRole.STUDENT}>
                <StudentGroupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <ProtectedRoute requiredRole={UserRole.STUDENT}>
                <StudentGroupDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/groups"
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <AdminGroupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/groups/:groupId"
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <AdminGroupDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;