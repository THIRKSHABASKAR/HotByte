import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaStar, FaMotorcycle, FaShieldAlt, FaTag } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())
      e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Invalid email format';
    if (!form.password)
      e.password = 'Password is required';
    else if (form.password.length < 6)
      e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}! 👋`);
      if (res.data.role === 'ADMIN') navigate('/admin');
      else if (res.data.role === 'RESTAURANT') navigate('/restaurant');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED Google Login handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Use api.post (axios) instead of raw fetch
      const res = await api.post('/auth/google', { token });

      const {
        token: jwtToken,
        userId,
        name,
        email,
        role,
      } = res.data.data;

      // Save to localStorage so session persists on reload
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);

      // Update AuthContext state
      login(res.data.data);

      toast.success(`Welcome back, ${name}! 🎉`);

      // Role-based redirect — same as normal login
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'RESTAURANT') navigate('/restaurant');
      else navigate('/');

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Google login failed. Please try again.'
      );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Poppins, sans-serif',
      background: '#fff',
    }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="d-none d-lg-flex"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#FFF5F5',
          zIndex: 0,
        }} />

        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '100%', height: '100%',
          background: '#FFF5F5',
          zIndex: 0,
        }} />

        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=900&fit=crop&q=90"
          alt="Delicious Food"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.15) 100%)',
          zIndex: 2,
        }} />

        {/* Top Logo */}
        <div style={{
          position: 'absolute',
          top: '28px', left: '36px',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            background: '#E23744',
            width: '38px', height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(226,55,68,0.4)',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
          </div>
          <span style={{
            fontSize: '22px',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.5px',
          }}>
            HotByte
          </span>
        </div>

        {/* Floating Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '28px', right: '36px',
          zIndex: 3,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '50px',
          padding: '8px 18px',
        }}>
          <FaStar style={{ color: '#FC8019', fontSize: '14px' }} />
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
            4.8 • 10,000+ Happy Customers
          </span>
        </div>

        {/* Bottom Content */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          padding: '52px',
          maxWidth: '500px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFF0F1',
            border: '1px solid #FFCDD2',
            borderRadius: '50px',
            padding: '8px 18px',
            marginBottom: '20px',
          }}>
            <span style={{
              width: '8px', height: '8px',
              background: '#E23744',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
            }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#E23744' }}>
              🎉 50% OFF on First Order — Use HOTBYTE50
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 3.5vw, 52px)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '16px',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Delicious food,
            <br />
            <span style={{ color: '#E23744' }}>
              delivered hot!
              <svg style={{
                display: 'block',
                marginTop: '2px',
                width: '100%', height: '8px',
              }} viewBox="0 0 300 8" preserveAspectRatio="none">
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

          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '16px',
            lineHeight: 1.7,
            marginBottom: '36px',
          }}>
            Order from hundreds of restaurants and get fresh,
            hot food delivered right to your doorstep in minutes.
          </p>

          <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
            {[
              { icon: <FaMotorcycle />, num: '30 min', label: 'Avg Delivery' },
              { icon: '🏪', num: '500+', label: 'Restaurants' },
              { icon: <FaStar style={{ color: '#FC8019' }} />, num: '4.5+', label: 'Rated' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#E23744',
                  lineHeight: 1,
                }}>
                  {stat.num}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 40px',
        background: '#fff',
        overflowY: 'auto',
        borderLeft: '1px solid #F0F0F0',
      }}>

        {/* Mobile Logo */}
        <div
          className="d-flex d-lg-none"
          style={{
            alignItems: 'center',
            gap: '8px',
            marginBottom: '36px',
          }}
        >
          <div style={{
            background: '#E23744',
            width: '36px', height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#E23744' }}>
            HotByte
          </span>
        </div>

        {/* Desktop Logo */}
        <Link
          to="/"
          className="d-none d-lg-flex"
          style={{
            textDecoration: 'none',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
          }}
        >
          <div style={{
            background: '#E23744',
            width: '36px', height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(226,55,68,0.3)',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#E23744' }}>
            HotByte
          </span>
        </Link>

        {/* Heading */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#1a1a1a',
          marginBottom: '4px',
          lineHeight: 1.2,
        }}>
          Welcome back 👋
        </h2>
        <p style={{
          color: '#686B78',
          fontSize: '15px',
          marginBottom: '32px',
        }}>
          Sign in to continue ordering
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: 700,
              fontSize: '14px',
              color: '#1a1a1a',
              marginBottom: '8px',
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => {
                setForm(p => ({ ...p, email: e.target.value }));
                setErrors(p => ({ ...p, email: '' }));
              }}
              style={{
                width: '100%',
                padding: '13px 16px',
                border: `1.5px solid ${errors.email ? '#E23744' : '#E9E9EB'}`,
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none',
                fontFamily: 'Poppins, sans-serif',
                color: '#1a1a1a',
                background: errors.email ? '#FFF8F8' : '#fff',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#E23744';
                e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.email ? '#E23744' : '#E9E9EB';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <div style={{
                color: '#E23744', fontSize: '12px',
                marginTop: '5px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                ⚠️ {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontWeight: 700,
              fontSize: '14px',
              color: '#1a1a1a',
              marginBottom: '8px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => {
                  setForm(p => ({ ...p, password: e.target.value }));
                  setErrors(p => ({ ...p, password: '' }));
                }}
                style={{
                  width: '100%',
                  padding: '13px 50px 13px 16px',
                  border: `1.5px solid ${errors.password ? '#E23744' : '#E9E9EB'}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#1a1a1a',
                  background: errors.password ? '#FFF8F8' : '#fff',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#E23744';
                  e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = errors.password ? '#E23744' : '#E9E9EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute',
                  right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#686B78',
                  fontSize: '16px', padding: '4px',
                  display: 'flex', alignItems: 'center',
                }}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <div style={{
                color: '#E23744', fontSize: '12px',
                marginTop: '5px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                ⚠️ {errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'right', marginBottom: '28px' }}>
            <span style={{
              color: '#E23744', fontSize: '13px',
              fontWeight: 700, cursor: 'pointer',
            }}>
              Forgot password?
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#ccc' : '#E23744',
              color: '#fff',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.3px',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(226,55,68,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.target.style.background = '#c42d3a';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 25px rgba(226,55,68,0.4)';
              }
            }}
            onMouseLeave={e => {
              e.target.style.background = loading ? '#ccc' : '#E23744';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(226,55,68,0.3)';
            }}
          >
            {loading ? (
              <span style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px',
              }}>
                <span style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

        </form>

        {/* OR Divider */}
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          color: '#93959F',
          fontSize: '13px',
          fontWeight: 600,
        }}>
          OR
        </div>

        {/* ✅ Google Login Button — FIXED */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error('Google login failed. Please try again.')}
          />
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', margin: '8px 0 20px',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
          <span style={{ color: '#93959F', fontSize: '13px', fontWeight: 600 }}>
            New here?
          </span>
          <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
        </div>

        {/* Create Account */}
        <Link
          to="/register"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            background: 'transparent',
            color: '#E23744',
            border: '2px solid #E23744',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '15px',
            textDecoration: 'none',
            fontFamily: 'Poppins, sans-serif',
            transition: 'all 0.2s',
            marginBottom: '20px',
          }}
          onMouseEnter={e => {
            e.target.style.background = '#E23744';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#E23744';
          }}
        >
          Create Account
        </Link>

        {/* Back to Home */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{
            color: '#93959F', fontSize: '13px',
            fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
            gap: '4px', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#E23744'}
          onMouseLeave={e => e.target.style.color = '#93959F'}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Trust Tags */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '32px',
          flexWrap: 'wrap',
          padding: '20px',
          background: '#F7F7F8',
          borderRadius: '12px',
        }}>
          {[
            { icon: '⚡', text: '30 min delivery' },
            { icon: '🏪', text: '500+ Restaurants' },
            { icon: '⭐', text: '4.5+ Rated' },
          ].map((tag, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: '5px', fontSize: '13px',
              color: '#686B78', fontWeight: 600,
            }}>
              <span>{tag.icon}</span>
              {tag.text}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;