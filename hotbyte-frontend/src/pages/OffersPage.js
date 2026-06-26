import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaTag, FaCopy, FaCheck, FaStar, FaClock,
  FaFire, FaPercent, FaStore, FaChevronRight,
  FaGift, FaBolt, FaMotorcycle
} from 'react-icons/fa';

/* ─── tiny helpers ──────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const pct = (original, discounted) =>
  Math.round(((original - discounted) / original) * 100);

/* ─── colour tokens (match site palette) ───────────────────── */
const C = {
  red:    '#E23744',
  orange: '#FC8019',
  green:  '#3D9B35',
  dark:   '#1a1a1a',
  mid:    '#686B78',
  light:  '#93959F',
  border: '#E9E9EB',
  bg:     '#F4F4F5',
  white:  '#ffffff',
};

/* ─── Coupon Card ────────────────────────────────────────────── */
const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true);
      toast.success(`Code "${coupon.code}" copied!`);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  /* pick accent per coupon type */
  const accent =
    coupon.discountType === 'FLAT'    ? C.green  :
    coupon.discountType === 'PERCENT' ? C.red    : C.orange;

  return (
    <div style={{
      background: C.white,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      border: `1px solid ${C.border}`,
      display: 'flex',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
    }}
    >
      {/* LEFT accent strip */}
      <div style={{
        width: '6px',
        background: accent,
        flexShrink: 0,
      }} />

      {/* LEFT icon column */}
      <div style={{
        width: '80px',
        background: `${accent}12`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          width: '44px', height: '44px',
          background: accent,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '18px',
          boxShadow: `0 4px 12px ${accent}55`,
        }}>
          {coupon.discountType === 'FLAT' ? <FaGift /> : <FaPercent />}
        </div>
      </div>

      {/* dashed divider */}
      <div style={{
        width: '1px',
        background: `repeating-linear-gradient(to bottom, ${C.border} 0px, ${C.border} 6px, transparent 6px, transparent 12px)`,
        flexShrink: 0,
        margin: '12px 0',
      }} />

      {/* MIDDLE body */}
      <div style={{ flex: 1, padding: '18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            background: `${accent}18`,
            color: accent,
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '50px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            {coupon.discountType === 'FLAT'
              ? `₹${coupon.discountValue} OFF`
              : `${coupon.discountValue}% OFF`}
          </span>
          {coupon.isActive && (
            <span style={{
              background: '#EBF7EA',
              color: C.green,
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '50px',
            }}>● ACTIVE</span>
          )}
        </div>

        <div style={{ fontSize: '16px', fontWeight: 800, color: C.dark, marginBottom: '4px' }}>
          {coupon.description || `Use code ${coupon.code} to save`}
        </div>

        {coupon.minOrderAmount > 0 && (
          <div style={{ fontSize: '12px', color: C.mid }}>
            Min order: {fmt(coupon.minOrderAmount)}
            {coupon.maxDiscountAmount > 0 && ` • Max discount: ${fmt(coupon.maxDiscountAmount)}`}
          </div>
        )}

        {coupon.expiryDate && (
          <div style={{ fontSize: '11px', color: C.light, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaClock /> Expires {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* RIGHT copy zone */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 16px',
        gap: '8px',
        flexShrink: 0,
        minWidth: '110px',
      }}>
        <div style={{
          border: `2px dashed ${accent}`,
          borderRadius: '8px',
          padding: '6px 12px',
          fontWeight: 800,
          fontSize: '14px',
          letterSpacing: '1.5px',
          color: accent,
          textAlign: 'center',
        }}>
          {coupon.code}
        </div>
        <button
          onClick={copy}
          style={{
            background: copied ? C.green : accent,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'background 0.2s',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
        </button>
      </div>
    </div>
  );
};

/* ─── Deal Item Card (discounted menu items) ─────────────────── */
const DealCard = ({ item, onClick }) => {
  const discount = item.originalPrice
    ? pct(item.originalPrice, item.price)
    : item.discountPercent || 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: C.white,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: `1px solid ${C.border}`,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
      }}
    >
      {/* image */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #FFE0B2, #FFCCBC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
          }}>🍽️</div>
        )}

        {/* discount badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: C.green,
            color: '#fff',
            fontSize: '11px', fontWeight: 800,
            padding: '4px 8px', borderRadius: '6px',
            letterSpacing: '0.3px',
          }}>
            {discount}% OFF
          </div>
        )}

        {/* veg / non-veg indicator */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '20px', height: '20px',
          border: `2px solid ${item.isVeg ? C.green : C.red}`,
          borderRadius: '3px',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '10px', height: '10px',
            borderRadius: '50%',
            background: item.isVeg ? C.green : C.red,
          }} />
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '14px' }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: C.dark, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '12px', color: C.mid, marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.restaurantName || item.restaurant?.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '16px', fontWeight: 900, color: C.dark }}>
              {fmt(item.price)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span style={{ fontSize: '12px', color: C.light, textDecoration: 'line-through' }}>
                {fmt(item.originalPrice)}
              </span>
            )}
          </div>
          <button style={{
            background: '#fff',
            color: C.red,
            border: `1.5px solid ${C.red}`,
            borderRadius: '8px',
            padding: '5px 14px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.red; }}
          >
            ADD +
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Restaurant Deal Card ───────────────────────────────────── */
const RestaurantDealCard = ({ restaurant, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: C.white,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      border: `1px solid ${C.border}`,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
    }}
  >
    {/* cover image */}
    <div style={{ position: 'relative', height: '130px', overflow: 'hidden' }}>
      {restaurant.imageUrl ? (
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, ${C.red}22, ${C.orange}22)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px',
        }}>🏪</div>
      )}
      {/* deal ribbon */}
      <div style={{
        position: 'absolute', bottom: '0', left: '0', right: '0',
        background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
        padding: '18px 12px 8px',
        color: '#fff', fontSize: '12px', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        <FaBolt style={{ color: C.orange }} />
        Up to 30% off on selected items
      </div>
    </div>

    {/* body */}
    <div style={{ padding: '12px 14px' }}>
      <div style={{ fontSize: '15px', fontWeight: 800, color: C.dark, marginBottom: '4px' }}>
        {restaurant.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: C.mid, marginBottom: '10px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <FaStar style={{ color: C.orange, fontSize: '11px' }} />
          {restaurant.rating?.toFixed(1) || '4.1'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <FaClock style={{ fontSize: '11px' }} />
          {restaurant.deliveryTime || '25–35 min'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <FaMotorcycle style={{ fontSize: '11px' }} />
          {restaurant.deliveryFee ? fmt(restaurant.deliveryFee) : 'Free delivery'}
        </span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(restaurant.cuisines || restaurant.cuisineTypes || ['Multi-cuisine'])
            .slice(0, 2)
            .map((c, i) => (
              <span key={i} style={{
                background: C.bg,
                color: C.mid,
                fontSize: '11px', fontWeight: 600,
                padding: '3px 8px', borderRadius: '50px',
              }}>{c}</span>
            ))}
        </div>
        <span style={{
          color: C.red, fontSize: '12px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          View <FaChevronRight style={{ fontSize: '10px' }} />
        </span>
      </div>
    </div>
  </div>
);

/* ─── Section Header ─────────────────────────────────────────── */
const SectionHeader = ({ icon, title, subtitle, count }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
      <div style={{
        width: '36px', height: '36px',
        background: `${C.red}15`,
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.red, fontSize: '16px',
      }}>
        {icon}
      </div>
      <h2 style={{
        fontSize: '20px', fontWeight: 900,
        color: C.dark, margin: 0,
        fontFamily: 'Poppins, sans-serif',
      }}>
        {title}
        {count !== undefined && (
          <span style={{
            marginLeft: '8px',
            fontSize: '13px', fontWeight: 700,
            color: C.light,
          }}>({count})</span>
        )}
      </h2>
    </div>
    {subtitle && (
      <p style={{ margin: '0 0 0 46px', fontSize: '13px', color: C.mid }}>
        {subtitle}
      </p>
    )}
  </div>
);

/* ─── Skeleton loader ────────────────────────────────────────── */
const Skeleton = ({ height = 120, borderRadius = 16, count = 4 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
const OffersPage = () => {
  const navigate = useNavigate();

  const [coupons,      setCoupons]      = useState([]);
  const [dealItems,    setDealItems]    = useState([]);
  const [dealRestaurants, setDealRestaurants] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('all'); // all | coupons | deals | restaurants

  /* ── fetch all data ── */
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const [couponsRes, menuRes, restRes] = await Promise.allSettled([
        api.get('/coupons'),
        api.get('/menu/discounted'),          // menu items with discount
        api.get('/restaurants'),              // all restaurants (filter active deals)
      ]);

      if (couponsRes.status === 'fulfilled') {
        const data = couponsRes.value?.data?.data ?? couponsRes.value?.data ?? [];
        setCoupons(Array.isArray(data) ? data.filter(c => c.isActive !== false) : []);
      }

      if (menuRes.status === 'fulfilled') {
        const data = menuRes.value?.data?.data ?? menuRes.value?.data ?? [];
        setDealItems(Array.isArray(data) ? data : []);
      } else {
        // fallback: try the general menu endpoint and filter discounted items
        try {
          const res = await api.get('/menu');
          const all = res?.data?.data ?? res?.data ?? [];
          const discounted = Array.isArray(all)
            ? all.filter(i => i.originalPrice && i.originalPrice > i.price)
            : [];
          setDealItems(discounted);
        } catch (_) { /* silently ignore */ }
      }

      if (restRes.status === 'fulfilled') {
        const data = restRes.value?.data?.data ?? restRes.value?.data ?? [];
        // take all active/open restaurants as "deal" restaurants
        const active = Array.isArray(data)
          ? data.filter(r => r.isOpen !== false && r.isActive !== false)
          : [];
        setDealRestaurants(active);
      }
    } catch (err) {
      toast.error('Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  /* ── derived totals for tab badges ── */
  const total = coupons.length + dealItems.length + dealRestaurants.length;

  const tabs = [
    { key: 'all',         label: 'All Offers',       count: total },
    { key: 'coupons',     label: 'Coupon Codes',      count: coupons.length },
    { key: 'deals',       label: 'Discounted Items',  count: dealItems.length },
    { key: 'restaurants', label: 'Restaurant Deals',  count: dealRestaurants.length },
  ];

  const show = (section) =>
    activeTab === 'all' || activeTab === section;

  /* ────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div style={{
        background: `linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 50%, #3a1010 100%)`,
        padding: '48px 24px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative blobs */}
        {[
          { w: 300, h: 300, top: -100, right: -50,  color: `${C.red}25`    },
          { w: 200, h: 200, top:   40, right:  200, color: `${C.orange}18` },
          { w: 180, h: 180, top:  -60, left:    80, color: `${C.red}15`    },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.w, height: b.h,
            borderRadius: '50%',
            background: b.color,
            top: b.top, right: b.right, left: b.left,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${C.orange}22`,
            border: `1px solid ${C.orange}55`,
            borderRadius: '50px', padding: '6px 16px',
            marginBottom: '18px',
          }}>
            <FaFire style={{ color: C.orange, fontSize: '12px' }} />
            <span style={{ color: C.orange, fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
              HOT DEALS TODAY
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 12px',
            lineHeight: 1.15,
          }}>
            Save big on every order 🎉
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', margin: '0 0 28px', maxWidth: '500px' }}>
            Exclusive coupon codes, discounted menu items and restaurant deals — all in one place.
          </p>

          {/* stat pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { icon: <FaTag />,   label: `${coupons.length} Coupons`  },
              { icon: <FaPercent />, label: `${dealItems.length} Deals` },
              { icon: <FaStore />, label: `${dealRestaurants.length} Restaurants` },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px',
                padding: '8px 16px',
                color: '#fff', fontSize: '13px', fontWeight: 700,
              }}>
                <span style={{ color: C.orange }}>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', gap: '4px',
          padding: '0 24px',
          overflowX: 'auto',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none', border: 'none',
                padding: '16px 18px',
                fontSize: '14px', fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                color: activeTab === tab.key ? C.red : C.mid,
                borderBottom: `3px solid ${activeTab === tab.key ? C.red : 'transparent'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.key ? `${C.red}18` : C.bg,
                  color: activeTab === tab.key ? C.red : C.light,
                  fontSize: '11px', fontWeight: 800,
                  padding: '1px 7px', borderRadius: '50px',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* ── empty state (after load) ── */}
        {!loading && total === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: C.white, borderRadius: '20px',
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎁</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: C.dark, marginBottom: '8px' }}>
              No offers right now
            </h3>
            <p style={{ color: C.mid, fontSize: '14px', marginBottom: '24px' }}>
              Check back soon — new deals are added every day!
            </p>
            <button
              onClick={() => navigate('/menu')}
              style={{
                background: C.red, color: '#fff',
                border: 'none', borderRadius: '10px',
                padding: '12px 28px', fontWeight: 800,
                fontSize: '14px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Browse Menu
            </button>
          </div>
        )}

        {/* ════ COUPON CODES ════ */}
        {show('coupons') && (loading || coupons.length > 0) && (
          <section style={{ marginBottom: '48px' }}>
            <SectionHeader
              icon={<FaTag />}
              title="Coupon Codes"
              subtitle="Copy a code and apply it at checkout to save instantly"
              count={!loading ? coupons.length : undefined}
            />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    height: 90, borderRadius: 16,
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {coupons.map(c => <CouponCard key={c.id} coupon={c} />)}
              </div>
            )}
          </section>
        )}

        {/* ════ DISCOUNTED MENU ITEMS ════ */}
        {show('deals') && (loading || dealItems.length > 0) && (
          <section style={{ marginBottom: '48px' }}>
            <SectionHeader
              icon={<FaPercent />}
              title="Discounted Items"
              subtitle="Handpicked dishes at special prices — today only"
              count={!loading ? dealItems.length : undefined}
            />
            {loading ? (
              <Skeleton height={240} count={5} />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {dealItems.map(item => (
                  <DealCard
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/menu/${item.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ════ RESTAURANT DEALS ════ */}
        {show('restaurants') && (loading || dealRestaurants.length > 0) && (
          <section style={{ marginBottom: '48px' }}>
            <SectionHeader
              icon={<FaStore />}
              title="Restaurant Deals"
              subtitle="These restaurants are running special offers right now"
              count={!loading ? dealRestaurants.length : undefined}
            />
            {loading ? (
              <Skeleton height={230} count={4} />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
              }}>
                {dealRestaurants.map(r => (
                  <RestaurantDealCard
                    key={r.id}
                    restaurant={r}
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── shimmer keyframe injected via style tag ── */}
        <style>{`
          @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.5; }
          }
        `}</style>

      </div>

      <Footer />
    </div>
  );
};

export default OffersPage;