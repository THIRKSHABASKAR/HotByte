import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaBell } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] =
    useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const getNotifIcon = (type) => {
    const icons = {
      ORDER_PLACED: '🎉',
      ORDER_CONFIRMED: '✅',
      ORDER_DISPATCHED: '🛵',
      ORDER_DELIVERED: '📦',
      ORDER_CANCELLED: '❌',
      COUPON_APPLIED: '🏷️',
      WALLET_CREDIT: '💰',
      WALLET_DEBIT: '💸',
      GENERAL: '🔔',
    };
    return icons[type] || '🔔';
  };

  const getNotifColor = (type) => {
    if (type?.includes('CANCELLED'))
      return { bg: '#FFF0F1', border: '#FFCDD2' };
    if (type?.includes('DELIVERED'))
      return { bg: '#F0FAF0', border: '#C8E6C9' };
    if (type?.includes('DISPATCHED'))
      return { bg: '#E8F5E9', border: '#A5D6A7' };
    if (type?.includes('WALLET'))
      return { bg: '#F3F0FF', border: '#D1C4E9' };
    return { bg: '#FFF5EE', border: '#FFCCBC' };
  };

  return (
    <div style={{
      fontFamily: 'Poppins, sans-serif',
      background: '#F5F5F6',
      minHeight: '100vh',
    }}>
      <Navbar />

      <div className="container py-5">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}>
          <div>
            <h2 style={{
              fontWeight: 900,
              fontSize: '28px',
              color: '#1a1a1a',
              marginBottom: '4px',
            }}>
              🔔 Notifications
            </h2>
            <p style={{
              color: '#686B78',
              margin: 0,
              fontSize: '14px',
            }}>
              {notifications.filter(
                n => !n.isRead).length} unread
            </p>
          </div>

          {notifications.some(n => !n.isRead) && (
            <button
              onClick={async () => {
                const unread = notifications
                  .filter(n => !n.isRead);
                for (const n of unread) {
                  await markAsRead(n.id);
                }
                toast.success('All marked as read');
              }}
              style={{
                background: '#fff',
                border: '1.5px solid #E9E9EB',
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                color: '#686B78',
                fontFamily: 'Poppins, sans-serif',
              }}>
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '80px 40px',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
          }}>
            <FaBell size={60}
              style={{ color: '#E9E9EB' }} />
            <h4 style={{
              fontWeight: 800,
              marginTop: '20px',
              color: '#1a1a1a',
            }}>
              No notifications yet
            </h4>
            <p style={{ color: '#686B78' }}>
              We'll notify you about your orders
              and offers here
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {notifications.map((notif, i) => {
              const colors =
                getNotifColor(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead)
                      markAsRead(notif.id);
                  }}
                  style={{
                    background: notif.isRead
                      ? '#fff' : colors.bg,
                    border: `1px solid ${
                      notif.isRead
                        ? '#F0F0F0'
                        : colors.border}`,
                    borderRadius: '16px',
                    padding: '18px 20px',
                    cursor: notif.isRead
                      ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    transition: 'all 0.2s',
                  }}>

                  {/* Icon */}
                  <div style={{
                    width: '44px', height: '44px',
                    background: '#fff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                    boxShadow:
                      '0 2px 8px rgba(0,0,0,0.08)',
                  }}>
                    {getNotifIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '15px',
                        color: '#1a1a1a',
                        marginBottom: '4px',
                      }}>
                        {notif.title}
                      </div>
                      {!notif.isRead && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: '#E23744',
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginTop: '4px',
                        }} />
                      )}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#686B78',
                      marginBottom: '8px',
                      lineHeight: 1.5,
                    }}>
                      {notif.message}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#93959F',
                      fontWeight: 600,
                    }}>
                      {notif.createdAt
                        ? new Date(notif.createdAt)
                          .toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;