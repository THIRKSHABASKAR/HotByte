import React, { useState, useEffect } from 'react';
import RestaurantSidebar from
  '../../components/RestaurantSidebar';
import restaurantService from
  '../../services/restaurantService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaUtensils, FaClipboardList,
  FaCheckCircle, FaClock,
  FaRupeeSign, FaArrowRight,
  FaFire, FaTags
} from 'react-icons/fa';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dash, rest] = await Promise.all([
        restaurantService.getDashboard(),
        restaurantService.getProfile(),
      ]);
      setDashboard(dash);
      setRestaurant(rest);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboard ? [
    {
      label: 'Total Menu Items',
      value: dashboard.totalMenuItems,
      icon: <FaUtensils />,
      color: '#E23744',
      bg: '#FFF0F1',
      path: '/restaurant/menu',
    },
    {
      label: 'Pending Orders',
      value: dashboard.pendingOrders,
      icon: <FaClock />,
      color: '#E23744',
      bg: '#FFF5EE',
      path: '/restaurant/orders',
    },
    {
      label: 'Completed Orders',
      value: dashboard.completedOrders,
      icon: <FaCheckCircle />,
      color: '#60B246',
      bg: '#F0FAF0',
      path: '/restaurant/orders',
    },
    {
      label: 'Total Revenue',
      value: `₹${dashboard.totalRevenue?.toFixed(0) || 0}`,
      icon: <FaRupeeSign />,
      color: '#7B61FF',
      bg: '#F3F0FF',
      path: '/restaurant/orders',
    },
  ] : [];

  return (
    <div style={{ display: 'flex',
      minHeight: '100vh',
      background: '#F5F5F6' }}>
      <RestaurantSidebar restaurant={restaurant} />

      {/* Main Content */}
      <div style={{
        marginLeft: '260px', flex: 1,
        padding: '32px',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: 900,
              color: '#1a1a1a', marginBottom: '4px',
            }}>
              Welcome back! 👋
            </h1>
            <p style={{
              color: '#686B78', fontSize: '15px',
              margin: 0,
            }}>
              {restaurant?.name || 'Your Restaurant'}
              {' '}— Here's your overview
            </p>
          </div>

          <button
            onClick={() =>
              navigate('/restaurant/menu/add')}
            style={{
              background:
               'linear-gradient(135deg,#E23744,#c62839)',
              color: '#fff', border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontWeight: 700, fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center', gap: '8px',
            }}>
            + Add Menu Item
          </button>
        </div>

        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}>
              {stats.map((stat, i) => (
                <div key={i}
                  onClick={() =>
                    navigate(stat.path)}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    border: '1px solid #F0F0F0',
                    transition:
                      'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform
                      = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow
                      = '0 12px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform
                      = 'translateY(0)';
                    e.currentTarget.style.boxShadow
                      = 'none';
                  }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: stat.bg,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    fontSize: '20px',
                    marginBottom: '16px',
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{
                    fontSize: '32px', fontWeight: 900,
                    color: '#1a1a1a',
                    marginBottom: '4px',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '14px', color: '#686B78',
                    fontWeight: 600,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Today Revenue Banner */}
            <div style={{
              background:
                '#E23744',
              borderRadius: '20px',
              padding: '28px 32px',
              color: '#fff',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: '14px', opacity: 0.85,
                  marginBottom: '6px', fontWeight: 600,
                }}>
                  Today's Revenue
                </div>
                <div style={{
                  fontSize: '42px', fontWeight: 900,
                  lineHeight: 1,
                }}>
                  ₹{dashboard?.todayRevenue
                    ?.toFixed(0) || 0}
                </div>
                <div style={{
                  fontSize: '13px',
                  opacity: 0.8, marginTop: '6px',
                }}>
                  Total: ₹{dashboard?.totalRevenue
                    ?.toFixed(0) || 0} all time
                </div>
              </div>
              <div style={{ fontSize: '60px' }}>
                💰
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #F0F0F0',
            }}>
              <h5 style={{
                fontWeight: 800, fontSize: '18px',
                marginBottom: '20px', color: '#1a1a1a',
              }}>
                Quick Actions
              </h5>
              <div style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
              }}>
                {[
                  {
                    label: 'Add Menu Item',
                    icon: '🍽️',
                    path: '/restaurant/menu/add',
                    color: '#E23744',
                  },
                  {
                    label: 'View My Menu',
                    icon: '📋',
                    path: '/restaurant/menu',
                    color: '#E23744',
                  },
                  {
                    label: 'View Orders',
                    icon: '📦',
                    path: '/restaurant/orders',
                    color: '#60B246',
                  },
                ].map((action, i) => (
                  <button key={i}
                    onClick={() =>
                      navigate(action.path)}
                    style={{
                      background: '#F5F5F6',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      fontFamily:
                        'Poppins, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#1a1a1a',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background
                        = action.color;
                      e.currentTarget.style.color
                        = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background
                        = '#F5F5F6';
                      e.currentTarget.style.color
                        = '#1a1a1a';
                    }}>
                    <span style={{ fontSize: '20px' }}>
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;