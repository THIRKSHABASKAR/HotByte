import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartBar, FaUtensils, FaClipboardList,
  FaPlusCircle, FaSignOutAlt, FaHome,
  FaTags
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { FaFire } from 'react-icons/fa';

const RestaurantSidebar = ({ restaurant }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      path: '/restaurant',
      icon: <FaChartBar />,
      label: 'Dashboard',
      exact: true,
    },
    {
      path: '/restaurant/categories',
      icon: <FaTags />,
      label: 'Categories',
    },
    {
      path: '/restaurant/menu',
      icon: <FaUtensils />,
      label: 'My Menu',
    },
    {
      path: '/restaurant/menu/add',
      icon: <FaPlusCircle />,
      label: 'Add Item',
    },
    {
      path: '/restaurant/orders',
      icon: <FaClipboardList />,
      label: 'Orders',
    },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      width: '260px',
      minHeight: '100vh',
      background: '#1a1a1a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #2d2d2d',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <div style={{
            background: '#E23744',
            width: '40px', height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            <FaFire color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 900,
             
            }}>
             <span style={{ color: '#fff' }}>Hot</span>
             <span style={{ color: '#E23744' }}>Byte</span>
            </div>
            <div style={{
              fontSize: '10px',
              color: '#686B78',
              fontWeight: 600,
            }}>
              Restaurant Panel
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        {restaurant && (
          <div style={{
            background: '#2d2d2d',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: '#ffffff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              🏪
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>
                {restaurant.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: restaurant.isActive ? '#60B246' : '#E23744'
              }}>
                {restaurant.isActive ? 'Open' : 'Closed'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px' }}>
        {navItems.map((item, i) => {
          const active = isActive(item.path, item.exact);

          return (
            <Link key={i} to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: active ? '#fff' : '#aaa',
                background: active ? '#E23744' : 'transparent',
                marginBottom: '6px',
              }}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        marginTop: 'auto',
        padding: '12px',
        borderTop: '1px solid #2d2d2d',
      }}>
        <Link to="/" style={{ color: '#aaa', display: 'block', marginBottom: '10px' }}>
          <FaHome /> View Website
        </Link>

        <button onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: '#E23744',
            cursor: 'pointer',
          }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default RestaurantSidebar;