import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import menuService from '../services/menuService';
import {
  FaSearch, FaStar, FaArrowRight,
  FaMotorcycle, FaShieldAlt, FaClock,
  FaTag, FaCheckCircle
} from 'react-icons/fa';

// ── Category Data ─────────────────────────────────
const CATEGORIES = [
  {
    name: 'Pizza',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'Burger',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'Biryani',
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'Chinese',
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'South Indian',
    img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'Desserts',
    img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'Pasta',
    img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=300&h=300&fit=crop&q=80',
  },
  {
    name: 'Beverages',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop&q=80',
  },
];

// ── Demo Menu Cards ───────────────────────────────
const DEMO_CARDS = [
  {
    id: 'd1', name: 'Margherita Pizza',
    restaurantName: 'Pizza Palace',
    price: 299, discountPrice: 249,
    avgRating: 4.5, cookingTime: 25,
    foodType: 'VEG', categoryName: 'Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd2', name: 'Classic Smash Burger',
    restaurantName: 'Burger Barn',
    price: 249, discountPrice: null,
    avgRating: 4.3, cookingTime: 20,
    foodType: 'NON_VEG', categoryName: 'Burger',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd3', name: 'Chicken Biryani',
    restaurantName: 'Biryani House',
    price: 349, discountPrice: 299,
    avgRating: 4.7, cookingTime: 35,
    foodType: 'NON_VEG', categoryName: 'Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd4', name: 'Masala Dosa',
    restaurantName: 'South Indian Kitchen',
    price: 149, discountPrice: null,
    avgRating: 4.4, cookingTime: 20,
    foodType: 'VEG', categoryName: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd5', name: 'Butter Chicken',
    restaurantName: 'Punjabi Dhaba',
    price: 320, discountPrice: 280,
    avgRating: 4.6, cookingTime: 30,
    foodType: 'NON_VEG', categoryName: 'North Indian',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd6', name: 'Veg Hakka Noodles',
    restaurantName: 'Wok Express',
    price: 179, discountPrice: null,
    avgRating: 4.1, cookingTime: 20,
    foodType: 'VEG', categoryName: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd7', name: 'Chocolate Lava Cake',
    restaurantName: 'Sweet Cravings',
    price: 199, discountPrice: 159,
    avgRating: 4.8, cookingTime: 15,
    foodType: 'VEG', categoryName: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=300&fit=crop&q=80',
  },
  {
    id: 'd8', name: 'Penne Arrabiata',
    restaurantName: 'Pasta Primo',
    price: 249, discountPrice: null,
    avgRating: 4.2, cookingTime: 25,
    foodType: 'VEG', categoryName: 'Pasta',
    imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&h=300&fit=crop&q=80',
  },
];

// ── Why Choose Us Data ────────────────────────────
const WHY_ITEMS = [
  {
    icon: <FaMotorcycle size={28} />,
    title: 'Lightning Fast Delivery',
    desc: 'We guarantee delivery within 30 minutes or your order is on us. Hot food, fast.',
    color: '#E23744',
    bg: '#FFF0F1',
  },
  {
    icon: <FaShieldAlt size={28} />,
    title: 'Safe & Hygienic',
    desc: 'Every restaurant is verified. All food is packed in tamper-proof, hygienic packaging.',
    color: '#FC8019',
    bg: '#FFF5EE',
  },
  {
    icon: <FaTag size={28} />,
    title: 'Best Prices & Offers',
    desc: 'Daily deals, exclusive coupons, and loyalty rewards that save you money every order.',
    color: '#60B246',
    bg: '#F0FAF0',
  },
  {
    icon: <FaClock size={28} />,
    title: 'Order Anytime',
    desc: 'Early breakfast to late night cravings — we\'re available 24/7, all year round.',
    color: '#7B61FF',
    bg: '#F3F0FF',
  },
];

// ── Main Component ────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState(null);

  useEffect(() => {
    menuService.getAllMenuItems()
      .then(data => setMenuItems(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/menu?search=${searchQuery}`);
    else navigate('/menu');
  };

  const displayItems = menuItems.length > 0
    ? menuItems : DEMO_CARDS;

  return (
    <div style={{ background: '#fff' }}>
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section style={{
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '55%', height: '100%',
          background: '#FFF5F5',
          clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)',
          zIndex: 0,
        }} />

        <div className="container"
          style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center"
            style={{ minHeight: '520px' }}>

            {/* ── LEFT TEXT ── */}
            <div className="col-lg-6"
              style={{ padding: '70px 0' }}>

              {/* Badge */}
              <div
                className="animate-fadeup delay-1"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FFF0F1',
                  border: '1px solid #FFCDD2',
                  borderRadius: '50px',
                  padding: '8px 18px',
                  marginBottom: '24px',
                }}>
                <span style={{
                  width: '8px', height: '8px',
                  background: '#E23744',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#E23744',
                }}>
                  🎉 50% OFF on First Order — Use HOTBYTE50
                </span>
              </div>

              {/* Headline */}
              <h1
                className="animate-fadeup delay-2"
                style={{
                  fontSize: 'clamp(38px, 5vw, 64px)',
                  fontWeight: 900,
                  color: '#1a1a1a',
                  lineHeight: 1.05,
                  marginBottom: '20px',
                  fontFamily: 'Poppins, sans-serif',
                }}>
                Delicious food,
                <br />
                <span style={{
                  color: '#E23744',
                  position: 'relative',
                }}>
                  delivered hot!
                  <svg style={{
                    position: 'absolute',
                    bottom: '-6px', left: 0,
                    width: '100%', height: '8px',
                  }} viewBox="0 0 300 8">
                    <path
                      d="M0 6 Q75 0 150 4 Q225 8 300 2"
                      fill="none"
                      stroke="#FC8019"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtext */}
              <p
                className="animate-fadeup delay-3"
                style={{
                  fontSize: '18px',
                  color: '#686B78',
                  marginBottom: '36px',
                  lineHeight: 1.7,
                  maxWidth: '460px',
                }}>
                Order from hundreds of restaurants
                and get fresh, hot food delivered
                right to your doorstep in minutes.
              </p>

              {/* Search Bar */}
              <form
                className="animate-fadeup delay-4"
                onSubmit={handleSearch}>
                <div style={{
                  display: 'flex',
                  background: '#fff',
                  border: '2px solid #E9E9EB',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  maxWidth: '520px',
                  boxShadow:
                    '0 8px 30px rgba(0,0,0,0.1)',
                  transition: 'border 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor
                    = '#E23744';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor
                    = '#E9E9EB';
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 18px',
                    gap: '12px',
                    flex: 1,
                  }}>
                    <FaSearch style={{
                      color: '#93959F',
                      fontSize: '16px',
                      flexShrink: 0,
                    }} />
                    <input
                      type="text"
                      placeholder=
                        "Search for restaurants or dishes..."
                      value={searchQuery}
                      onChange={e =>
                        setSearchQuery(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        flex: 1, width: '100%',
                        padding: '18px 0',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#1a1a1a',
                        background: 'transparent',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: '#E23744',
                      color: '#fff',
                      border: 'none',
                      padding: '18px 32px',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      flexShrink: 0,
                      transition: 'background 0.2s',
                      letterSpacing: '0.3px',
                    }}
                    onMouseEnter={e =>
                      e.target.style.background = '#c42d3a'}
                    onMouseLeave={e =>
                      e.target.style.background = '#E23744'}>
                    Search
                  </button>
                </div>
              </form>

              {/* Trust Tags */}
              <div
                className="animate-fadeup delay-5"
                style={{
                  display: 'flex',
                  gap: '24px',
                  marginTop: '32px',
                  flexWrap: 'wrap',
                }}>
                {[
                  { icon: '⚡', text: '30 min delivery' },
                  { icon: '🏪', text: '500+ Restaurants' },
                  { icon: '⭐', text: '4.5+ Rated' },
                ].map((tag, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    color: '#686B78',
                    fontWeight: 600,
                  }}>
                    <span>{tag.icon}</span>
                    {tag.text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT IMAGE ── */}
            <div className="col-lg-6
              d-none d-lg-flex
              justify-content-center
              align-items-center"
              style={{
                height: '520px',
                position: 'relative',
              }}>

              {/* Main Food Image */}
              <div style={{
                width: '460px', height: '400px',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow:
                  '0 30px 80px rgba(226,55,68,0.2)',
                position: 'relative',
                zIndex: 2,
              }}>
                <img
                  src="/images/pizza.png"
                  alt="Delicious Food"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '50%',
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                }} />
              </div>

              {/* Floating Card 1 — Rating */}
              <div style={{
                position: 'absolute',
                top: '60px', right: '10px',
                background: '#fff',
                borderRadius: '16px',
                padding: '14px 18px',
                boxShadow:
                  '0 10px 40px rgba(0,0,0,0.12)',
                zIndex: 3,
                animation: 'float 3s ease-in-out infinite',
                minWidth: '150px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}>
                  <div style={{
                    background: '#60B246',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <FaStar size={11} /> 4.8
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#686B78',
                    fontWeight: 600,
                  }}>
                    Top Rated
                  </span>
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                }}>
                  🍕 Margherita Pizza
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#686B78',
                }}>
                  Pizza Palace • ₹249
                </div>
              </div>

              {/* Floating Card 2 — Delivery */}
              <div style={{
                position: 'absolute',
                bottom: '80px', left: '0',
                background: '#fff',
                borderRadius: '16px',
                padding: '14px 18px',
                boxShadow:
                  '0 10px 40px rgba(0,0,0,0.12)',
                zIndex: 3,
                animation:
                  'float 3.5s ease-in-out infinite',
                animationDelay: '0.5s',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{
                    background: '#FFF0F1',
                    borderRadius: '10px',
                    padding: '8px',
                    fontSize: '20px',
                  }}>
                    🛵
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '14px',
                      color: '#1a1a1a',
                    }}>
                      On the way!
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#60B246',
                      fontWeight: 600,
                    }}>
                      Arriving in 12 min
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 3 — Offer */}
              <div style={{
                position: 'absolute',
                top: '70%', right: '-10px',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(135deg,#E23744,#c0202d)',
                borderRadius: '16px',
                padding: '14px 18px',
                boxShadow: '0 10px 30px rgba(192,32,45,0.4)',
                zIndex: 3,
                color: '#fff',
                animation:
                  'float 4s ease-in-out infinite',
                animationDelay: '1s',
                minWidth: '130px',
              }}>
                <div style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  lineHeight: 1,
                }}>
                  50% OFF
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.9,
                  marginTop: '2px',
                  fontWeight: 600,
                }}>
                  First order
                </div>
                <div style={{
                  background:
                    'rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginTop: '6px',
                  letterSpacing: '0.5px',
                }}>
                  HOTBYTE50
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES SECTION
      ═══════════════════════════════════════ */}
      <section style={{
        padding: '60px 0',
        background: '#fff',
        borderTop: '1px solid #F5F5F6',
        borderBottom: '1px solid #F5F5F6',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '36px',
          }}>
            <div>
              <h2 className="sec-title">
                What's on your mind?
              </h2>
              <p className="sec-sub"
                style={{ marginBottom: 0 }}>
                Choose from our wide variety of cuisines
              </p>
            </div>
            <Link to="/categories"
              style={{
                color: '#E23744',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center', gap: '4px',
              }}>
              See all <FaArrowRight size={12} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(8, 1fr)',
            gap: '20px',
          }}>
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="cat-item"
                onClick={() => {
                  setActiveCategory(cat.name);
                  navigate(
                    `/menu?search=${cat.name}`);
                }}>
                <div className="cat-img-wrap"
                  style={{
                    border: activeCategory === cat.name
                      ? '3px solid #E23744'
                      : undefined,
                  }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                  />
                </div>
                <span className="cat-label">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          POPULAR NEAR YOU
      ═══════════════════════════════════════ */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
          }}>
            <div>
              <h2 className="sec-title">
                Popular Near You
              </h2>
              <p className="sec-sub"
                style={{ marginBottom: 0 }}>
                Handpicked favorites from top restaurants
              </p>
            </div>
            <Link to="/menu"
              style={{
                color: '#E23744', fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center', gap: '4px',
              }}>
              View all <FaArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="loader">
              <div className="spinner" />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}>
              {displayItems.slice(0, 8).map(item => (
                menuItems.length > 0
                  ? <FoodCard key={item.id}
                      item={item} />
                  : <DemoFoodCard
                      key={item.id}
                      item={item}
                      navigate={navigate}
                    />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
    OFFER BANNERS — REDESIGNED
═══════════════════════════════════════ */}
<section style={{
  padding: '70px 0',
  background: 'linear-gradient(180deg, #fff 0%, #FFF5F5 100%)',
}}>
  <div className="container">

    {/* Section Header */}
    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
      <span style={{
        background: '#FFF0F1',
        color: '#E23744',
        fontWeight: 700,
        fontSize: '13px',
        padding: '6px 16px',
        borderRadius: '50px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        🔥 Hot Deals
      </span>
      <h2 style={{
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: 900,
        color: '#1a1a1a',
        marginTop: '14px',
        marginBottom: '10px',
        fontFamily: 'Poppins, sans-serif',
      }}>
        Exclusive Offers Just For You
      </h2>
      <p style={{ color: '#686B78', fontSize: '16px' }}>
        Grab these deals before they're gone!
      </p>
    </div>

    {/* Cards Grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
    }}
    className="offers-grid">

      {/* Card 1 — 50% OFF */}
      <div style={{
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: '0 20px 60px rgba(226,55,68,0.25)',
        cursor: 'pointer',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        {/* BG Image */}
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=85"
          alt="50% Off"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(226,55,68,0.95) 0%, rgba(226,55,68,0.4) 50%, transparent 100%)',
        }} />
        {/* Badge */}
        <div style={{
          position: 'absolute',
          top: '20px', left: '20px',
          background: '#fff',
          color: '#E23744',
          fontWeight: 800,
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '50px',
          letterSpacing: '0.5px',
        }}>
          🎉 FIRST ORDER
        </div>
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '28px' }}>
          <div style={{
            fontSize: '52px', fontWeight: 900,
            color: '#fff', lineHeight: 1,
            fontFamily: 'Poppins, sans-serif',
          }}>
            50% OFF
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '14px', marginTop: '6px',
            marginBottom: '16px',
          }}>
            On orders above ₹199
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: '10px',
            padding: '10px 16px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <span style={{
              color: '#fff', fontWeight: 800,
              fontSize: '15px', letterSpacing: '2px',
            }}>
              HOTBYTE50
            </span>
            <span style={{
              background: '#fff',
              color: '#E23744',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
            }}>
              COPY
            </span>
          </div>
        </div>
      </div>

      {/* Card 2 — Free Delivery */}
      <div style={{
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <img
          src="https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=400&fit=crop&q=85"
          alt="Free Delivery"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.3) 55%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '20px', left: '20px',
          background: '#E23744',
          color: '#fff',
          fontWeight: 800,
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '50px',
        }}>
          🛵 FREE DELIVERY
        </div>
        <div style={{ position: 'relative', zIndex: 2, padding: '28px' }}>
          <div style={{
            fontSize: '32px', fontWeight: 900,
            color: '#fff', lineHeight: 1.1,
            fontFamily: 'Poppins, sans-serif',
            marginBottom: '8px',
          }}>
            Zero Delivery<br />Charges!
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px', marginBottom: '18px',
          }}>
            On all orders above ₹199
          </div>
          <button
            onClick={() => navigate('/menu')}
            style={{
              background: '#E23744',
              color: '#fff', border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontWeight: 800, fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.3px',
            }}>
            Order Now →
          </button>
        </div>
      </div>

      {/* Card 3 — Refer & Earn */}
      <div style={{
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: '0 20px 60px rgba(123,97,255,0.25)',
        cursor: 'pointer',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <img
          src="https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&h=400&fit=crop&q=85"
          alt="Refer & Earn"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(98,71,209,0.97) 0%, rgba(98,71,209,0.5) 55%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '20px', left: '20px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '12px',
          padding: '6px 14px',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          🎁 REFER & EARN
        </div>
        <div style={{ position: 'relative', zIndex: 2, padding: '28px' }}>
          <div style={{
            fontSize: '32px', fontWeight: 900,
            color: '#fff', lineHeight: 1.1,
            fontFamily: 'Poppins, sans-serif',
            marginBottom: '8px',
          }}>
            Earn ₹100<br />Per Referral!
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '14px', marginBottom: '18px',
          }}>
            Invite friends & earn instantly
          </div>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '10px',
              padding: '12px 24px',
              fontWeight: 800, fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}>
            Invite Friends →
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════ */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center',
            marginBottom: '48px' }}>
            <h2 className="sec-title">
              Why Choose HotByte?
            </h2>
            <p className="sec-sub"
              style={{ marginBottom: 0 }}>
              We go above and beyond to make sure
              you're always satisfied
            </p>
          </div>

          <div className="row g-4">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="col-md-6
                col-lg-3">
                <div style={{
                  background: '#fff',
                  border: '1px solid #F0F0F0',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  height: '100%',
                  transition:
                    'transform 0.25s, box-shadow 0.25s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform
                    = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow
                    = '0 16px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform
                    = 'translateY(0)';
                  e.currentTarget.style.boxShadow
                    = 'none';
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '60px', height: '60px',
                    background: item.bg,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    marginBottom: '20px',
                  }}>
                    {item.icon}
                  </div>
                  <h5 style={{
                    fontWeight: 800,
                    fontSize: '18px',
                    marginBottom: '10px',
                    color: '#1a1a1a',
                  }}>
                    {item.title}
                  </h5>
                  <p style={{
                    color: '#686B78',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section style={{
        padding: '60px 0',
        background: '#FFF5F5',
      }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            <h2 className="sec-title">
              How It Works
            </h2>
            <p className="sec-sub"
              style={{ marginBottom: 0 }}>
              Order your favorite food in 3 simple steps
            </p>
          </div>

          <div className="row g-4
            align-items-center">
            {[
              {
                step: '01',
                emoji: '🔍',
                title: 'Browse & Choose',
                desc: 'Explore hundreds of restaurants and thousands of dishes. Filter by cuisine, rating, and more.',
              },
              {
                step: '02',
                emoji: '🛒',
                title: 'Add to Cart',
                desc: 'Pick your favorite items, customize your order, and apply discount coupons.',
              },
              {
                step: '03',
                emoji: '🚀',
                title: 'Fast Delivery',
                desc: 'Sit back and relax! Your hot, fresh food will arrive at your door in 30 minutes.',
              },
            ].map((step, i) => (
              <div key={i}
                className="col-md-4"
                style={{ textAlign: 'center' }}>
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: '20px',
                }}>
                  {/* Step number */}
                  <div style={{
                    width: '90px', height: '90px',
                    background: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    margin: '0 auto',
                    boxShadow:
                      '0 8px 30px rgba(226,55,68,0.15)',
                    border: '3px solid #FFCDD2',
                  }}>
                    {step.emoji}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '-6px', right: '-6px',
                    background: '#E23744',
                    color: '#fff',
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    border: '2px solid #fff',
                  }}>
                    {step.step}
                  </div>
                </div>

                <h5 style={{
                  fontWeight: 800, fontSize: '18px',
                  marginBottom: '10px',
                  color: '#1a1a1a',
                }}>
                  {step.title}
                </h5>
                <p style={{
                  color: '#686B78',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  maxWidth: '260px',
                  margin: '0 auto',
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section style={{
        padding: '80px 0',
        background: '#1a1a1a',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px', left: '-100px',
          width: '400px', height: '400px',
          background:
            'radial-gradient(circle, rgba(226,55,68,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px', right: '-100px',
          width: '400px', height: '400px',
          background:
            'radial-gradient(circle, rgba(252,128,25,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="container"
          style={{ position: 'relative' }}>
          <div style={{
            fontSize: '48px', marginBottom: '16px'
          }}>
            
          </div>
          <h2 style={{
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 900,
            marginBottom: '16px',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Ready to order? 🍔
          </h2>
          <p style={{
            fontSize: '18px', color: '#aaa',
            marginBottom: '36px',
            maxWidth: '500px', margin: '0 auto 36px',
            lineHeight: 1.6,
          }}>
            Join 10,000+ happy customers who order
            with HotByte every day. Sign up now and
            get 50% off your first order!
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link to="/register"
              className="btn-red"
              style={{ fontSize: '17px',
                padding: '16px 40px' }}>
              Get Started Free 🚀
            </Link>
            <Link to="/menu"
              className="btn-outline-red"
              style={{
                fontSize: '17px',
                padding: '16px 40px',
                borderColor: '#555',
                color: '#fff',
              }}>
              Browse Menu
            </Link>
          </div>

          {/* Checkmarks */}
          <div style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}>
            {[
              'No hidden charges',
              'Cancel anytime',
              'Free first delivery',
            ].map((text, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#aaa',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                <FaCheckCircle
                  style={{ color: '#60B246' }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ── Demo Food Card (when no real data) ────────────
const DemoFoodCard = ({ item, navigate }) => {
  const discountPct = item.discountPrice
    ? Math.round(
        ((item.price - item.discountPrice)
          / item.price) * 100)
    : 0;

  return (
    <div
      className="food-card"
      onClick={() => navigate('/menu')}
      style={{ cursor: 'pointer' }}>

      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: '100%', height: '200px',
            objectFit: 'cover',
          }}
        />

        {/* Discount Badge */}
        {discountPct > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '10px', left: '10px',
            background: '#60B246',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '12px', fontWeight: 800,
          }}>
            {discountPct}% OFF
          </div>
        )}

        {/* Wishlist */}
        <div style={{
          position: 'absolute',
          top: '10px', right: '10px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '50%',
          width: '34px', height: '34px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 2px 8px rgba(0,0,0,0.15)',
          color: '#E23744', fontSize: '14px',
          cursor: 'pointer',
        }}>
          ♥
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px' }}>

        {/* Veg/NonVeg Dot Indicator */}
        <div style={{ marginBottom: '6px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px', height: '16px',
            border: `2px solid ${
              item.foodType === 'VEG'
                ? '#60B246' : '#E23744'}`,
            borderRadius: '3px',
          }}>
            <span style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: item.foodType === 'VEG'
                ? '#60B246' : '#E23744',
              display: 'block',
            }} />
          </span>
        </div>

        {/* Name */}
        <h6 style={{
          fontWeight: 800, fontSize: '15px',
          color: '#1a1a1a', marginBottom: '3px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.name}
        </h6>

        {/* Restaurant */}
        <p style={{
          fontSize: '13px', color: '#686B78',
          marginBottom: '10px',
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
          gap: '10px',
          marginBottom: '12px',
          fontSize: '13px',
        }}>
          <span style={{
            display: 'flex', alignItems: 'center',
            gap: '3px', fontWeight: 700,
            color: '#1a1a1a',
          }}>
            <FaStar style={{
              color: '#60B246', fontSize: '11px'
            }} />
            {item.avgRating}
          </span>
          <span style={{ color: '#D4D5D9' }}>•</span>
          <span style={{ color: '#686B78' }}>
            {item.cookingTime}-
            {item.cookingTime + 10} mins
          </span>
        </div>

        {/* Price Row */}
        <div style={{
          borderTop: '1px dashed #E9E9EB',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{
              fontWeight: 800, fontSize: '17px',
              color: '#1a1a1a',
            }}>
              ₹{item.discountPrice || item.price}
            </span>
            {item.discountPrice && (
              <span style={{
                fontSize: '13px', color: '#aaa',
                textDecoration: 'line-through',
                marginLeft: '6px',
              }}>
                ₹{item.price}
              </span>
            )}
          </div>

          <button
            style={{
              background: '#fff',
              border: '1.5px solid #E23744',
              color: '#E23744',
              padding: '7px 18px',
              borderRadius: '8px',
              fontSize: '13px', fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.background = '#E23744';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.target.style.background = '#fff';
              e.target.style.color = '#E23744';
            }}>
            ADD +
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;