import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import Navbar from '../components/Navbar';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <div style={{
          maxWidth: '500px', margin: '0 auto',
          textAlign: 'center',
        }}>

          {/* Success Animation */}
          <div style={{
            width: '120px', height: '120px',
            background: 'linear-gradient(135deg,#E23744,#c62839)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '50px',
            boxShadow:
              '0 10px 40px rgba(255,82,0,0.3)',
            animation:
              'pulse 2s ease-in-out infinite',
          }}>
            🎉
          </div>

          <h2 style={{
            fontWeight: 800, fontSize: '32px',
            color: '#1a1a1a', marginBottom: '10px',
          }}>
            Order Placed Successfully!
          </h2>

          <p style={{
            color: '#888', fontSize: '16px',
            marginBottom: '30px',
          }}>
            Your delicious food is being prepared.
            Estimated delivery: <strong>45 minutes</strong>
          </p>

          {order && (
            <div style={{
              background: '#FFF9F5',
              border: '1px solid #FFE4D6',
              borderRadius: '16px', padding: '20px',
              marginBottom: '30px',
              textAlign: 'left',
            }}>
              <div className="d-flex
                justify-content-between mb-2">
                <span style={{ color: '#888' }}>
                  Order ID
                </span>
                <span style={{ fontWeight: 700 }}>
                  #{order.orderId}
                </span>
              </div>
              <div className="d-flex
                justify-content-between mb-2">
                <span style={{ color: '#888' }}>
                  Restaurant
                </span>
                <span style={{ fontWeight: 600 }}>
                  {order.restaurantName}
                </span>
              </div>
              <div className="d-flex
                justify-content-between mb-2">
                <span style={{ color: '#888' }}>
                  Total Amount
                </span>
                <span style={{
                  fontWeight: 700,
                  color: '#E23744', fontSize: '18px',
                }}>
                  ₹{order.totalAmount}
                </span>
              </div>
              <div className="d-flex
                justify-content-between">
                <span style={{ color: '#888' }}>
                  Payment
                </span>
                <span style={{ fontWeight: 600 }}>
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          )}

          <div className="d-flex gap-3
            justify-content-center">
            <button
              onClick={() => navigate('/orders')}
              style={{
                background: 'linear-gradient(135deg,#E23744,#c62839)',
                color: 'white', border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700, cursor: 'pointer',
              }}>
              Track Order 📦
            </button>
            <button
              onClick={() => navigate('/menu')}
              style={{
                background: 'white',
                border: '2px solid #eee',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700, cursor: 'pointer',
              }}>
              Order More 🍔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;