import React, { useState, useEffect } from 'react';
import RestaurantSidebar from
  '../../components/RestaurantSidebar';
import restaurantService from
  '../../services/restaurantService';
import toast from 'react-hot-toast';
import { FaHistory } from 'react-icons/fa';

const STATUS_FLOW = [
  'PLACED', 'CONFIRMED',
  'PROCESSING', 'DISPATCHED', 'DELIVERED'
];

const NEXT_STATUS = {
  PLACED: 'CONFIRMED',
  CONFIRMED: 'PROCESSING',
  PROCESSING: 'DISPATCHED',
  DISPATCHED: 'DELIVERED',
};

const STATUS_COLORS = {
  PLACED: { bg: '#FFF3E0', color: '#E65100' },
  CONFIRMED: { bg: '#E3F2FD', color: '#1565C0' },
  PROCESSING: { bg: '#F3E5F5', color: '#6A1B9A' },
  DISPATCHED: { bg: '#E8F5E9', color: '#2E7D32' },
  DELIVERED: { bg: '#60B246', color: '#fff' },
  CANCELLED: { bg: '#FFEBEE', color: '#B71C1C' },
};

const RestaurantOrders = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [active, hist, rest] = await Promise.all([
        restaurantService.getActiveOrders(),
        restaurantService.getOrderHistory(),
        restaurantService.getProfile(),
      ]);
      setActiveOrders(active || []);
      setHistory(hist || []);
      setRestaurant(rest);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await restaurantService.updateOrderStatus(
        orderId, newStatus);
      toast.success(`Order marked as ${newStatus}!`);
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const OrderCard = ({ order }) => {
    const statusStyle =
      STATUS_COLORS[order.status]
      || STATUS_COLORS.PLACED;
    const nextStatus = NEXT_STATUS[order.status];

    return (
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid #F0F0F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>

        {/* Order Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <div>
            <div style={{
              fontWeight: 800, fontSize: '16px',
              color: '#1a1a1a',
            }}>
              Order #{order.orderId}
            </div>
            <div style={{
              fontSize: '13px', color: '#686B78',
              marginTop: '2px',
            }}>
              {order.placedAt
                ? new Date(order.placedAt)
                  .toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </div>
          </div>
          <span style={{
            background: statusStyle.bg,
            color: statusStyle.color,
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '13px',
          }}>
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div style={{
          background: '#F5F5F6',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '14px',
        }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              paddingBottom:
                i < order.items.length - 1
                  ? '8px' : '0',
              marginBottom:
                i < order.items.length - 1
                  ? '8px' : '0',
              borderBottom:
                i < order.items.length - 1
                  ? '1px solid #E9E9EB' : 'none',
            }}>
              <span style={{ color: '#1a1a1a',
                fontWeight: 600 }}>
                {item.itemName}
                <span style={{
                  color: '#686B78',
                  fontWeight: 500,
                }}>
                  {' '}× {item.quantity}
                </span>
              </span>
              <span style={{ fontWeight: 700 }}>
                ₹{item.totalPrice}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <div style={{
              fontSize: '13px', color: '#686B78',
              marginBottom: '2px',
            }}>
              📍 {order.deliveryAddress?.slice(0, 40)}
              {order.deliveryAddress?.length > 40
                ? '...' : ''}
            </div>
            <div style={{
              fontWeight: 800, fontSize: '18px',
              color: '#1a1a1a',
            }}>
              ₹{order.totalAmount}
              <span style={{
                fontSize: '12px', color: '#686B78',
                fontWeight: 500,
                marginLeft: '8px',
              }}>
                {order.paymentMethod}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {nextStatus && tab === 'active' && (
            <button
              onClick={() =>
                handleUpdateStatus(
                  order.orderId, nextStatus)}
              disabled={updating === order.orderId}
              style={{
                background:
                  updating === order.orderId
                    ? '#ccc'
                    : '#E23744',
                color: '#fff', border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: 700, fontSize: '14px',
                cursor: updating === order.orderId
                  ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
              {updating === order.orderId
                ? 'Updating...'
                : `Mark as ${nextStatus}`}
            </button>
          )}

          {order.status === 'PLACED'
            && tab === 'active' && (
            <button
              onClick={() =>
                handleUpdateStatus(
                  order.orderId, 'CANCELLED')}
              disabled={updating === order.orderId}
              style={{
                background: '#FFF0F1',
                color: '#E23744', border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                fontWeight: 700, fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  const displayOrders =
    tab === 'active' ? activeOrders : history;

  return (
    <div style={{ display: 'flex',
      minHeight: '100vh',
      background: '#F5F5F6' }}>
      <RestaurantSidebar restaurant={restaurant} />

      <div style={{
        marginLeft: '260px', flex: 1,
        padding: '32px',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: 900,
              color: '#1a1a1a', marginBottom: '4px',
            }}>
              Orders 📦
            </h1>
            <p style={{
              color: '#686B78', margin: 0,
              fontSize: '14px',
            }}>
              Auto-refreshes every 30 seconds
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '4px',
            display: 'flex',
            border: '1px solid #F0F0F0',
          }}>
            {[
              { key: 'active',
                label: `Active (${activeOrders.length})` },
              { key: 'history',
                label: `History (${history.length})` },
            ].map(t => (
              <button key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: tab === t.key
                    ? '#E23744' : 'transparent',
                  color: tab === t.key
                    ? '#fff' : '#686B78',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.2s',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : displayOrders.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
          }}>
            <FaHistory size={50}
              style={{ color: '#E9E9EB' }} />
            <h4 style={{
              marginTop: '16px', fontWeight: 800
            }}>
              {tab === 'active'
                ? 'No active orders'
                : 'No order history yet'}
            </h4>
            <p style={{ color: '#686B78' }}>
              {tab === 'active'
                ? 'New orders will appear here'
                : 'Completed orders will appear here'}
            </p>
          </div>
        ) : (
          <div>
            {displayOrders.map(order => (
              <OrderCard
                key={order.orderId}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrders;