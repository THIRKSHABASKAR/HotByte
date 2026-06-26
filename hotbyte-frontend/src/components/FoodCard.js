import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items!');
      navigate('/login');
      return;
    }
    try {
      await cartService.addToCart(item.id, 1);
      refreshCart();
      toast.success(`${item.name} added! 🛒`);
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to add item');
    }
  };

  const discountPct = item.discountPrice
    ? Math.round(
        ((item.price - item.discountPrice)
          / item.price) * 100)
    : 0;

  const displayPrice = item.discountPrice
    || item.price;

  return (
    <div
      className="food-card"
      onClick={() => navigate(`/menu/${item.id}`)}
      style={{ cursor: 'pointer',
        borderRadius: '16px', overflow: 'hidden',
        background: 'white',
      }}>

      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={item.imageUrl
            || getPlaceholderImage(item.name)}
          alt={item.name}
          style={{
            width: '100%', height: '180px',
            objectFit: 'cover',
          }}
          onError={e => {
            e.target.src = getPlaceholderImage(item.name);
          }}
        />

        {/* Wishlist */}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '10px', right: '10px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}>
          <FaHeart style={{ color: '#E23744',
            fontSize: '13px' }} />
        </button>

        {/* Discount */}
        {discountPct > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '0', left: '0', right: '0',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            padding: '20px 10px 8px',
          }}>
            <span style={{
              background: '#60B246',
              color: 'white',
              padding: '2px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 800,
            }}>
              {discountPct}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '12px' }}>

        {/* Veg/NonVeg Indicator */}
        <div style={{
          marginBottom: '4px',
        }}>
          <span style={{
            display: 'inline-block',
            width: '14px', height: '14px',
            border: `2px solid ${
              item.foodType === 'VEG'
                ? '#60B246' : '#E23744'}`,
            borderRadius: '2px',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: item.foodType === 'VEG'
                ? '#60B246' : '#E23744',
            }} />
          </span>
        </div>

        {/* Name */}
        <h6 style={{
          fontWeight: 800, fontSize: '15px',
          marginBottom: '2px',
          color: '#1C1C1C',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.name}
        </h6>

        {/* Restaurant */}
        <p style={{
          fontSize: '12px', color: '#686B78',
          marginBottom: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.restaurantName}
        </p>

        {/* Rating & Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '10px',
        }}>
          <span style={{
            display: 'flex', alignItems: 'center',
            gap: '3px', fontSize: '13px',
            fontWeight: 700,
          }}>
            <FaStar style={{ color: '#60B246',
              fontSize: '12px' }} />
            {item.avgRating || '4.1'}
          </span>
          <span style={{
            color: '#686B78', fontSize: '12px',
          }}>
            •
          </span>
          <span style={{
            display: 'flex', alignItems: 'center',
            gap: '3px', fontSize: '12px',
            color: '#686B78',
          }}>
            <FaClock style={{ fontSize: '11px' }} />
            {item.cookingTime || 30}-
            {(item.cookingTime || 30) + 10} min
          </span>
        </div>

        {/* Price & Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px dashed #E9E9EB',
          paddingTop: '10px',
        }}>
          <div>
            <span style={{
              fontSize: '16px', fontWeight: 800,
              color: '#1C1C1C',
            }}>
              ₹{displayPrice}
            </span>
            {item.discountPrice && (
              <span style={{
                fontSize: '12px', color: '#93959F',
                textDecoration: 'line-through',
                marginLeft: '5px',
              }}>
                ₹{item.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              background: 'white',
              border: '1px solid #E23744',   
              color: '#E23744',  
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.background = '#E23744';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'white';
              e.target.style.color = '#E23744';
            }}>
            ADD +
          </button>
        </div>
      </div>
    </div>
  );
};

// Generate real Unsplash food images based on name
const getPlaceholderImage = (name) => {
  const n = (name || '').toLowerCase();
  const images = {
    pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    pasta: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop',
    sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    noodle: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    chicken: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&h=300&fit=crop',
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    soup: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop',
    wrap: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  };
  for (const [key, url] of Object.entries(images)) {
    if (n.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop';
};

export default FoodCard;