import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import menuService from '../services/menuService';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  FaStar, FaClock, FaFire,
  FaLeaf, FaArrowLeft, FaPlus, FaMinus
} from 'react-icons/fa';

const MenuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const data = await menuService.getMenuItemById(id);
      setItem(data);
    } catch (error) {
      toast.error('Item not found');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await cartService.addToCart(item.id, quantity);
      refreshCart();
      toast.success(`${item.name} added to cart! 🛒`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="loader"><div className="spinner"></div></div>
    </div>
  );

  if (!item) return null;

  const discountPercent = item.discountPrice
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : 0;

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      <div className="container py-5">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none',
            color: '#E23744', fontWeight: 600,
            cursor: 'pointer', marginBottom: '20px',
            display: 'flex', alignItems: 'center',
            gap: '8px', fontSize: '15px',
            fontFamily: 'Poppins, sans-serif',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <FaArrowLeft /> Back to Menu
        </button>

        <div className="row g-5">

          {/* Image */}
          <div className="col-md-6">
            <div style={{
              borderRadius: '24px', overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              position: 'relative',
            }}>
              <img
                src={item.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
                alt={item.name}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              {discountPercent > 0 && (
                <div style={{
                  position: 'absolute', top: '20px', left: '20px',
                  background: '#E23744', color: 'white',
                  padding: '6px 16px', borderRadius: '20px',
                  fontWeight: 700, fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(226,55,68,0.35)',
                }}>
                  {discountPercent}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="col-md-6">

            {/* Category & Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                color: '#E23744', fontWeight: 600,
                fontSize: '13px', textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {item.categoryName}
              </span>
              <span style={{
                padding: '2px 10px', borderRadius: '4px',
                fontSize: '12px', fontWeight: 700,
                color: item.foodType === 'VEG' ? '#28a745' : '#E23744',
                border: `2px solid ${item.foodType === 'VEG' ? '#28a745' : '#E23744'}`,
              }}>
                {item.foodType === 'VEG' ? '🟢 VEG' : '🔴 NON-VEG'}
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontWeight: 800, fontSize: '32px', marginBottom: '8px', color: '#1a1a1a' }}>
              {item.name}
            </h1>

            {/* Restaurant */}
            <p style={{ color: '#686B78', fontSize: '15px' }}>🏪 {item.restaurantName}</p>

            {/* Rating & Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaStar style={{ color: '#FFC107' }} />
                <span style={{ fontWeight: 600 }}>{item.avgRating || '4.0'}</span>
                <span style={{ color: '#686B78', fontSize: '13px' }}>
                  ({item.totalRatings || 0} reviews)
                </span>
              </div>
              {item.cookingTime && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#686B78' }}>
                  <FaClock />
                  <span>{item.cookingTime} mins</span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '16px' }}>
                {item.description}
              </p>
            )}

            {/* Ingredients */}
            {item.ingredients && (
              <div style={{
                background: '#FFF0F1',
                border: '1px solid #FFCDD2',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '16px',
              }}>
                <p style={{
                  fontWeight: 600, color: '#E23744',
                  marginBottom: '4px', fontSize: '13px',
                }}>
                  🥗 Ingredients
                </p>
                <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
                  {item.ingredients}
                </p>
              </div>
            )}

            {/* Nutritional Info */}
            {(item.calories || item.proteins) && (
              <div className="row g-2 mb-4">
                {[
                  { label: 'Calories', value: `${item.calories} kcal`, icon: <FaFire style={{ color: '#E23744' }} /> },
                  { label: 'Proteins', value: `${item.proteins}g`, icon: '💪' },
                  { label: 'Carbs', value: `${item.carbohydrates}g`, icon: '🌾' },
                  { label: 'Fats', value: `${item.fats}g`, icon: '🧈' },
                ].filter(n => n.value !== 'undefinedg' && n.value !== 'undefined kcal')
                .map((nut, i) => (
                  <div key={i} className="col-3">
                    <div style={{
                      background: '#F7F7F8', borderRadius: '12px',
                      padding: '10px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '18px' }}>{nut.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{nut.value}</div>
                      <div style={{ fontSize: '11px', color: '#686B78' }}>{nut.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a' }}>
                ₹{item.discountPrice || item.price}
              </span>
              {item.discountPrice && (
                <span style={{ fontSize: '20px', color: '#aaa', textDecoration: 'line-through' }}>
                  ₹{item.price}
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '2px solid #E9E9EB',
                borderRadius: '50px', overflow: 'hidden',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none', border: 'none',
                    padding: '8px 16px', cursor: 'pointer',
                    color: '#E23744', fontWeight: 700, fontSize: '18px',
                  }}>
                  <FaMinus size={12} />
                </button>
                <span style={{
                  padding: '0 16px', fontWeight: 700,
                  fontSize: '18px', minWidth: '50px', textAlign: 'center',
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    background: 'none', border: 'none',
                    padding: '8px 16px', cursor: 'pointer',
                    color: '#E23744', fontWeight: 700, fontSize: '18px',
                  }}>
                  <FaPlus size={12} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !item.isAvailable}
                style={{
                  flex: 1,
                  background: !item.isAvailable ? '#ccc' : '#E23744',
                  color: 'white', border: 'none',
                  padding: '14px 30px', borderRadius: '50px',
                  fontWeight: 800, fontSize: '16px',
                  cursor: !item.isAvailable ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: !item.isAvailable ? 'none' : '0 6px 20px rgba(226,55,68,0.35)',
                  transition: 'all 0.2s',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={e => {
                  if (item.isAvailable) {
                    e.target.style.background = '#c42d3a';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.background = !item.isAvailable ? '#ccc' : '#E23744';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {!item.isAvailable ? 'Out of Stock' : addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            </div>

            {/* Taste Info */}
            {item.tasteInfo && (
              <div style={{ marginTop: '16px' }}>
                <span style={{
                  background: '#FFF0F1', color: '#E23744',
                  padding: '4px 14px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: 600,
                }}>
                  😋 {item.tasteInfo.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuDetailPage;