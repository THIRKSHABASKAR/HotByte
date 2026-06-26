import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaShoppingCart, FaBars, FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// ── Custom Dropdown ───────────────────────────────
const UserMenu = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: '1.5px solid #E9E9EB',
          borderRadius: '50px',
          padding: '7px 16px',
          fontWeight: 700,
          fontSize: '14px',
          color: '#1a1a1a',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Poppins, sans-serif',
          transition: 'all 0.2s',
        }}>
        {/* Avatar Circle */}
        <div style={{
          width: '28px', height: '28px',
          background: '#E23744',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 800,
          flexShrink: 0,
        }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <span style={{
          maxWidth: '80px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {user.name?.split(' ')[0]}
        </span>
        <span style={{ fontSize: '9px', color: '#686B78', marginLeft: '-2px' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          right: 0,
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          minWidth: '210px',
          padding: '8px',
          zIndex: 9999,
          border: '1px solid #F0F0F0',
          animation: 'fadeIn 0.15s ease',
        }}>

          {/* User Info Header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid #F0F0F0',
            marginBottom: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: '#E23744',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{
                  fontWeight: 800, fontSize: '14px', color: '#1a1a1a',
                  maxWidth: '140px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '11px', color: '#686B78',
                  maxWidth: '140px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          {[
            { to: '/profile',       emoji: '👤', label: 'My Profile'     },
            { to: '/orders',        emoji: '📦', label: 'My Orders'      },
            { to: '/wallet',        emoji: '💰', label: 'My Wallet'      },
            { to: '/notifications', emoji: '🔔', label: 'Notifications'  },
            { to: '/cart',          emoji: '🛒', label: 'My Cart'        },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px',
                textDecoration: 'none', color: '#1a1a1a',
                fontSize: '14px', fontWeight: 600,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F5F5F6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: '16px' }}>{item.emoji}</span>
              {item.label}
            </Link>
          ))}

          <div style={{ height: '1px', background: '#F0F0F0', margin: '6px 10px' }} />

          {/* Sign Out */}
          <button
            onClick={() => { setOpen(false); logout(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px',
              border: 'none', background: 'none',
              color: '#E23744', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', width: '100%',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF0F1'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <span style={{ fontSize: '16px' }}>🚪</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Navbar ───────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#E23744' : '#1a1a1a',
    fontWeight: 700,
    fontSize: '15px',
    padding: '8px 4px',
    borderBottom: location.pathname === path
      ? '2px solid #E23744' : '2px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <nav
      className="main-navbar"
      style={{
        boxShadow: scrolled
          ? '0 4px 20px rgba(0,0,0,0.1)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s',
      }}>
      <div className="container">
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 0',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="10" fill="url(#flameGrad)"/>
                <path
                  d="M18 6C18 6 22 11 22 15C22 15 23.5 13 23 11C23 11 27 14 27 19C27 23.5 23 27 18 27C13 27 9 23.5 9 19C9 14.5 13 11 13 11C13 11 13 14 15 15C15 15 14 10 18 6Z"
                  fill="white" opacity="0.95"
                />
                <path
                  d="M18 17C18 17 20 19.5 20 21.5C20 22.8 19.1 24 18 24C16.9 24 16 22.8 16 21.5C16 19.5 18 17 18 17Z"
                  fill="url(#innerFlame)"
                />
                <defs>
                  <linearGradient id="flameGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E23744"/>
                    <stop offset="100%" stopColor="#c0202d"/>
                  </linearGradient>
                  <linearGradient id="innerFlame" x1="18" y1="17" x2="18" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ff6b6b"/>
                    <stop offset="100%" stopColor="#E23744"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <div style={{
                  fontSize: '22px', fontWeight: 700, lineHeight: 1,
                  fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.3px',
                }}>
                  <span style={{ color: '#1a1a1a' }}>Hot</span>
                  <span style={{ color: '#E23744' }}>Byte</span>
                </div>
                <div style={{
                  fontSize: '10px', color: '#686B78',
                  fontWeight: 500, letterSpacing: '0.2px',
                }}>
                  Hot food. On time. Every time.
                </div>
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '28px' }}
            className="d-none d-lg-flex">

            {/* Restaurants */}
            <Link to="/menu" style={navLinkStyle('/menu')}>
              Restaurants
            </Link>

            {/* ✅ FIXED: Offers now links to /offers */}
            <Link to="/offers" style={navLinkStyle('/offers')}>
              Offers
            </Link>

            {user ? (
              <>
                <Link to="/cart" style={{
                  textDecoration: 'none', color: '#1a1a1a',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontWeight: 700, fontSize: '15px', padding: '8px 4px',
                }}>
                  <div style={{ position: 'relative' }}>
                    <FaShoppingCart style={{ fontSize: '18px' }} />
                    {cartCount > 0 && (
                      <span style={{
                        position: 'absolute', top: '-9px', right: '-9px',
                        background: '#E23744', color: '#fff',
                        borderRadius: '50%', width: '18px', height: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 800, border: '2px solid #fff',
                      }}>
                        {cartCount}
                      </span>
                    )}
                  </div>
                  Cart
                </Link>
                <UserMenu user={user} logout={logout} />
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/login" className="btn-outline-red">Login</Link>
                <Link to="/register" className="btn-red">Sign Up Free</Link>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="d-lg-none"
            style={{
              background: 'none', border: 'none',
              fontSize: '22px', cursor: 'pointer',
              color: '#1a1a1a', padding: '4px',
            }}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid #E9E9EB', padding: '16px 0 20px' }}>

            {/* ✅ FIXED: Offers now links to /offers in mobile menu too */}
            {[
              { to: '/menu',   label: '🍽️ Restaurants' },
              { to: '/offers', label: '🏷️ Offers'      },
            ].map((item, i) => (
              <Link key={i} to={item.to} onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '12px 0',
                  textDecoration: 'none',
                  color: location.pathname === item.to ? '#E23744' : '#1a1a1a',
                  fontWeight: 700, fontSize: '15px',
                  borderBottom: '1px solid #F5F5F6',
                }}>
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                {/* Mobile user info */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 0', borderBottom: '1px solid #F5F5F6',
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: '#E23744',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '16px',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#686B78' }}>{user.email}</div>
                  </div>
                </div>

                {[
                  { to: '/cart',    label: `🛒 Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
                  { to: '/orders',  label: '📦 My Orders'  },
                  { to: '/profile', label: '👤 My Profile' },
                ].map((item, i) => (
                  <Link key={i} to={item.to} onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '12px 0',
                      textDecoration: 'none', color: '#1a1a1a',
                      fontWeight: 700, fontSize: '15px',
                      borderBottom: '1px solid #F5F5F6',
                    }}>
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  style={{
                    marginTop: '12px', background: '#E23744',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    padding: '12px 28px', fontWeight: 700, fontSize: '15px',
                    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-outline-red">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-red">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;