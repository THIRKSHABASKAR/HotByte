import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import { FaClipboardList } from 'react-icons/fa';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm(
      'Are you sure you want to cancel this order?'))
      return;
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message
        || 'Cannot cancel this order');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      PLACED: { bg: '#fff3cd', color: '#856404' },
      CONFIRMED: { bg: '#d1ecf1', color: '#0c5460' },
      PROCESSING: { bg: '#d4edda', color: '#155724' },
      DISPATCHED: { bg: '#d4edda', color: '#155724' },
      DELIVERED: { bg: '#28a745', color: 'white' },
      CANCELLED: { bg: '#f8d7da', color: '#721c24' },
    };
    return styles[status]
      || { bg: '#eee', color: '#333' };
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      PLACED: '🟡', CONFIRMED: '🔵',
      PROCESSING: '👨‍🍳', DISPATCHED: '🚴',
      DELIVERED: '✅', CANCELLED: '❌',
    };
    return emojis[status] || '📦';
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="loader">
        <div className="spinner"></div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div className="container py-5">
        <h2 style={{
          fontWeight: 700, marginBottom: '30px'
        }}>
          📦 My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <FaClipboardList size={80}
              style={{ color: '#eee' }} />
            <h4 className="mt-4" style={{
              color: '#888'
            }}>
              No orders yet
            </h4>
            <p style={{ color: '#aaa' }}>
              Start ordering delicious food!
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary-custom mt-3">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="d-flex
            flex-column gap-4">
            {orders.map(order => {
              const statusStyle =
                getStatusStyle(order.status);
              return (
                <div key={order.orderId}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow:
                      '0 2px 15px rgba(0,0,0,0.08)',
                  }}>

                  {/* Header */}
                  <div className="d-flex
                    justify-content-between
                    align-items-start mb-3
                    flex-wrap gap-2">
                    <div>
                      <h6 style={{
                        fontWeight: 700,
                        marginBottom: '4px',
                      }}>
                        {order.restaurantName
                          || 'Restaurant'}
                      </h6>
                      <p style={{
                        color: '#888', fontSize: '13px',
                        margin: 0,
                      }}>
                        Order #{order.orderId} •{' '}
                        {new Date(order.placedAt)
                          .toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </p>
                    </div>
                    <span style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}>
                      {getStatusEmoji(order.status)}{' '}
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{
                    background: '#f8f8f8',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                  }}>
                    {order.items?.map((item, i) => (
                      <div key={i}
                        className="d-flex
                          justify-content-between"
                        style={{
                          fontSize: '14px',
                          paddingBottom:
                            i < order.items.length - 1
                              ? '8px' : '0',
                          marginBottom:
                            i < order.items.length - 1
                              ? '8px' : '0',
                          borderBottom:
                            i < order.items.length - 1
                              ? '1px solid #eee' : 'none',
                        }}>
                        <span style={{ color: '#555' }}>
                          {item.itemName}{' '}
                          <span style={{ color: '#888' }}>
                            x{item.quantity}
                          </span>
                        </span>
                        <span style={{
                          fontWeight: 600
                        }}>
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Tracking Steps */}
                  {order.status !== 'CANCELLED' && (
                    <div className="d-flex
                      align-items-center
                      justify-content-between
                      mb-4 px-2">
                      {['PLACED', 'CONFIRMED',
                        'PROCESSING', 'DISPATCHED',
                        'DELIVERED'].map((step, i) => {
                        const steps = ['PLACED',
                          'CONFIRMED', 'PROCESSING',
                          'DISPATCHED', 'DELIVERED'];
                        const currentIndex =
                          steps.indexOf(order.status);
                        const stepIndex = i;
                        const isCompleted =
                          stepIndex <= currentIndex;
                        const isCurrent =
                          stepIndex === currentIndex;

                        return (
                          <React.Fragment key={step}>
                            <div style={{
                              textAlign: 'center',
                            }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isCompleted
                                  ? '#E23744' : '#eee',
                                color: isCompleted
                                  ? 'white' : '#888',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '12px',
                                margin: '0 auto 4px',
                                boxShadow: isCurrent
                                  ? '0 0 0 4px rgba(255,82,0,0.2)'
                                  : 'none',
                              }}>
                                {isCompleted ? '✓' : i+1}
                              </div>
                              <div style={{
                                fontSize: '9px',
                                color: isCompleted
                                  ? '#E23744' : '#888',
                                fontWeight: isCompleted
                                  ? 600 : 400,
                              }}>
                                {step}
                              </div>
                            </div>
                            {i < 4 && (
                              <div style={{
                                flex: 1, height: '2px',
                                background: stepIndex < currentIndex
                                  ? '#E23744' : '#eee',
                                marginBottom: '18px',
                              }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="d-flex
                    justify-content-between
                    align-items-center">
                    <div>
                      <span style={{
                        fontWeight: 800,
                        fontSize: '20px',
                        color: '#E23744',
                      }}>
                        ₹{order.totalAmount}
                      </span>
                      <span style={{
                        color: '#888', fontSize: '13px',
                        marginLeft: '8px',
                      }}>
                        {order.paymentMethod}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      {order.status === 'PLACED' && (
                        <button
                          onClick={() =>
                            handleCancel(order.orderId)}
                          style={{
                            background: 'none',
                            border: '1px solid #dc3545',
                            color: '#dc3545',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}>
                          Cancel
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() =>
                            navigate('/menu')}
                          style={{
                           background: 'linear-gradient(135deg,#E23744,#c62839)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '6px 16px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}>
                          Reorder 🔄
                        </button>
                      )}
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

export default OrderHistoryPage;