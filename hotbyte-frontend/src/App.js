import React from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// User Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import CategoriesPage from './pages/CategoriesPage';
import MenuDetailPage from './pages/MenuDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import RestaurantMenu from './pages/restaurant/RestaurantMenu';
import RestaurantOrders from './pages/restaurant/RestaurantOrders';
import AddMenuItem from './pages/restaurant/AddMenuItem';
import RestaurantCategories from './pages/restaurant/RestaurantCategories';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

import OffersPage from './pages/OffersPage';


// ── Loader ──────────────────────────────────────
const Loader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#fff',
  }}>
    <div>
      <div style={{
        width: '50px', height: '50px',
        border: '4px solid #f0f0f0',
        borderTopColor: '#E23744',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px',
      }} />
      <div style={{
        fontSize: '14px',
        color: '#686B78',
        fontWeight: 600,
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
      }}>
        Loading...
      </div>
    </div>
  </div>
);

// ── Protected Route ─────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user
    ? children
    : <Navigate to="/login" replace />;
};

// ── Role Protected Route ────────────────────────
const RoleRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

// ── App ─────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public Routes ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* /menu → all food items (Restaurants tab) */}
        <Route path="/menu" element={<MenuPage />} />

        {/* /categories → category browse page */}
        <Route path="/categories" element={<CategoriesPage />} />

        <Route path="/menu/:id" element={<MenuDetailPage />} />

        {/* ── User Protected Routes ── */}
        <Route path="/cart" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />
        <Route path="/order-success/:id" element={
          <ProtectedRoute><OrderSuccessPage /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute><WalletPage /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><NotificationsPage /></ProtectedRoute>
        } />

        {/* ── Restaurant Routes ── */}
        <Route path="/restaurant" element={
          <RoleRoute role="RESTAURANT"><RestaurantDashboard /></RoleRoute>
        } />
        <Route path="/restaurant/categories" element={
          <RoleRoute role="RESTAURANT"><RestaurantCategories /></RoleRoute>
        } />
        <Route path="/restaurant/menu" element={
          <RoleRoute role="RESTAURANT"><RestaurantMenu /></RoleRoute>
        } />
        <Route path="/restaurant/menu/add" element={
          <RoleRoute role="RESTAURANT"><AddMenuItem /></RoleRoute>
        } />
        <Route path="/restaurant/menu/edit/:id" element={
          <RoleRoute role="RESTAURANT"><AddMenuItem /></RoleRoute>
        } />
        <Route path="/restaurant/orders" element={
          <RoleRoute role="RESTAURANT"><RestaurantOrders /></RoleRoute>
        } />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={
          <RoleRoute role="ADMIN"><AdminDashboard /></RoleRoute>
        } />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/offers" element={<OffersPage />} />

      </Routes>
    </Router>
  );
}

export default App;