import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import api from '../services/api';
import {
  FaEye, FaEyeSlash, FaEnvelope,
  FaLock, FaUser, FaPhone, FaStar
} from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

const FlameLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
  </svg>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    gender: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#dc3545', '#ffc107', '#17a2b8', '#28a745'];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = 'Phone must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(getPasswordStrength(value));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await authService.register(submitData);
      toast.success('Account created successfully! Please login. 🎉');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '13px 14px 13px 40px',
    border: `1.5px solid ${errors[fieldName] ? '#E23744' : '#E9E9EB'}`,
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif',
    color: '#1a1a1a',
    background: errors[fieldName] ? '#FFF8F8' : '#fff',
    transition: 'border 0.2s, box-shadow 0.2s',
  });

  const iconStyle = {
    position: 'absolute', left: '14px',
    top: '50%', transform: 'translateY(-50%)',
    color: '#93959F', fontSize: '13px',
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
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=900&fit=crop&q=90"
          alt="Delicious Food"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 1,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.15) 100%)',
          zIndex: 2,
        }} />

        {/* Top Logo */}
        <div style={{
          position: 'absolute', top: '28px', left: '36px',
          zIndex: 3, display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            background: '#E23744', width: '38px', height: '38px',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(226,55,68,0.4)', flexShrink: 0,
          }}>
            <FlameLogo size={20} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            HotByte
          </span>
        </div>

        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: '28px', right: '36px', zIndex: 3,
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '50px', padding: '8px 18px',
        }}>
          <FaStar style={{ color: '#FC8019', fontSize: '14px' }} />
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
            4.8 • 10,000+ Happy Customers
          </span>
        </div>

        {/* Bottom content */}
        <div style={{ position: 'relative', zIndex: 3, padding: '52px', maxWidth: '500px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#FFF0F1', border: '1px solid #FFCDD2',
            borderRadius: '50px', padding: '8px 18px', marginBottom: '20px',
          }}>
            <span style={{
              width: '8px', height: '8px', background: '#E23744',
              borderRadius: '50%', display: 'inline-block',
            }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#E23744' }}>
              🎉 50% OFF on First Order — Use HOTBYTE50
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 3.5vw, 52px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.1, marginBottom: '16px',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Delicious food,
            <br />
            <span style={{ color: '#E23744' }}>
              delivered hot!
              <svg style={{ display: 'block', marginTop: '2px', width: '100%', height: '8px' }}
                viewBox="0 0 300 8" preserveAspectRatio="none">
                <path d="M0 6 Q75 0 150 4 Q225 8 300 2" fill="none"
                  stroke="#FC8019" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: 1.7, marginBottom: '36px' }}>
            Join thousands of food lovers and get fresh,
            hot food delivered right to your doorstep in minutes.
          </p>

          <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
            {[
              { num: '30 min', label: 'Avg Delivery' },
              { num: '500+', label: 'Restaurants' },
              { num: '4.5+', label: 'Rated' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#E23744', lineHeight: 1 }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div style={{
        width: '100%', maxWidth: '480px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 36px',
        background: '#fff', overflowY: 'auto',
        borderLeft: '1px solid #F0F0F0',
      }}>

        {/* Mobile Logo */}
        <div className="d-flex d-lg-none" style={{
          alignItems: 'center', gap: '8px', marginBottom: '28px',
        }}>
          <div style={{
            background: '#E23744', width: '36px', height: '36px',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FlameLogo size={18} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#E23744' }}>HotByte</span>
        </div>

        {/* Desktop Logo */}
        <Link to="/" className="d-none d-lg-flex" style={{
          textDecoration: 'none', alignItems: 'center',
          gap: '8px', marginBottom: '28px',
        }}>
          <div style={{
            background: '#E23744', width: '36px', height: '36px',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(226,55,68,0.3)', flexShrink: 0,
          }}>
            <FlameLogo size={18} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#E23744' }}>HotByte</span>
        </Link>

        {/* Heading */}
        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#1a1a1a', marginBottom: '4px' }}>
          Create account 🎉
        </h2>
        <p style={{ color: '#686B78', fontSize: '14px', marginBottom: '24px' }}>
          Join HotByte and start ordering today!
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <FaUser style={iconStyle} />
              <input type="text" name="name" placeholder="Enter your full name"
                value={formData.name} onChange={handleChange} style={inputStyle('name')}
                onFocus={e => { e.target.style.borderColor = '#E23744'; e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = errors.name ? '#E23744' : '#E9E9EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {errors.name && <div style={{ color: '#E23744', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>⚠️ {errors.name}</div>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={iconStyle} />
              <input type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} style={inputStyle('email')}
                onFocus={e => { e.target.style.borderColor = '#E23744'; e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? '#E23744' : '#E9E9EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {errors.email && <div style={{ color: '#E23744', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>⚠️ {errors.email}</div>}
          </div>

          {/* Phone & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', marginBottom: '6px' }}>
                Phone
              </label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{ ...iconStyle, fontSize: '11px' }} />
                <input type="tel" name="phone" placeholder="10 digit number"
                  value={formData.phone} onChange={handleChange} style={inputStyle('phone')}
                  onFocus={e => { e.target.style.borderColor = '#E23744'; e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.phone ? '#E23744' : '#E9E9EB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.phone && <div style={{ color: '#E23744', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>⚠️ {errors.phone}</div>}
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', marginBottom: '6px' }}>
                Gender
              </label>
              <select name="gender" value={formData.gender} onChange={handleChange}
                style={{
                  width: '100%', padding: '13px 14px',
                  border: '1.5px solid #E9E9EB', borderRadius: '10px',
                  fontSize: '14px', outline: 'none', background: '#fff',
                  fontFamily: 'Poppins, sans-serif', color: '#1a1a1a',
                  cursor: 'pointer',
                }}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={iconStyle} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" placeholder="Min 6 characters"
                value={formData.password} onChange={handleChange}
                style={{ ...inputStyle('password'), paddingRight: '40px' }}
                onFocus={e => { e.target.style.borderColor = '#E23744'; e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = errors.password ? '#E23744' : '#E9E9EB'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#686B78', cursor: 'pointer',
                }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Password Strength */}
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '4px', borderRadius: '2px',
                      background: i <= passwordStrength ? strengthColors[passwordStrength] : '#E9E9EB',
                      transition: 'all 0.3s',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: strengthColors[passwordStrength], fontWeight: 600 }}>
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
            )}
            {errors.password && <div style={{ color: '#E23744', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>⚠️ {errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', marginBottom: '6px' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={iconStyle} />
              <input type="password" name="confirmPassword" placeholder="Re-enter password"
                value={formData.confirmPassword} onChange={handleChange}
                style={inputStyle('confirmPassword')}
                onFocus={e => { e.target.style.borderColor = '#E23744'; e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = errors.confirmPassword ? '#E23744' : '#E9E9EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {errors.confirmPassword && <div style={{ color: '#E23744', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>⚠️ {errors.confirmPassword}</div>}
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#ccc' : '#E23744',
              color: '#fff', border: 'none',
              padding: '15px', borderRadius: '12px',
              fontWeight: 800, fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(226,55,68,0.3)',
              transition: 'all 0.2s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.background = '#c42d3a'; e.target.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { e.target.style.background = loading ? '#ccc' : '#E23744'; e.target.style.transform = 'translateY(0)'; }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin 0.7s linear infinite',
                }} />
                Creating Account...
              </span>
            ) : 'Create Account 🎉'}
          </button>

          {/* OR divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
            <span style={{ fontSize: '13px', color: '#93959F', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
          </div>

          {/* ── Google Login — FIXED ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const token = credentialResponse.credential;
                  const res = await api.post('/auth/google', { token });
                  const {
                    token: jwtToken,
                    userId,
                    name,
                    email,
                    role,
                  } = res.data.data;
                  localStorage.setItem('token', jwtToken);
                  localStorage.setItem('userId', userId);
                  localStorage.setItem('name', name);
                  localStorage.setItem('email', email);
                  localStorage.setItem('role', role);
                  toast.success('Welcome! Logged in with Google 🎉');
                  window.location.href = '/';
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                    'Google login failed. Please try again.'
                  );
                }
              }}
              onError={() =>
                toast.error('Google login failed. Please try again.')
              }
            />
          </div>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
          <span style={{ fontSize: '13px', color: '#93959F', fontWeight: 600 }}>Already a member?</span>
          <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
        </div>

        {/* Login link */}
        <Link to="/login" style={{
          display: 'block', width: '100%', textAlign: 'center',
          background: 'transparent', color: '#E23744',
          border: '2px solid #E23744', padding: '13px',
          borderRadius: '12px', fontWeight: 800, fontSize: '14px',
          textDecoration: 'none', fontFamily: 'Poppins, sans-serif',
          transition: 'all 0.2s', marginBottom: '16px',
        }}
        onMouseEnter={e => { e.target.style.background = '#E23744'; e.target.style.color = '#fff'; }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#E23744'; }}
        >
          Sign In Instead
        </Link>

        {/* Back to home */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{
            color: '#93959F', fontSize: '13px', fontWeight: 600,
            textDecoration: 'none', display: 'inline-flex',
            alignItems: 'center', gap: '4px',
          }}>
            ← Back to Home
          </Link>
        </div>

        {/* Trust tags */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: '20px', marginTop: '24px', flexWrap: 'wrap',
          padding: '16px', background: '#F7F7F8', borderRadius: '12px',
        }}>
          {[
            { icon: '⚡', text: '30 min delivery' },
            { icon: '🏪', text: '500+ Restaurants' },
            { icon: '⭐', text: '4.5+ Rated' },
          ].map((tag, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: '5px', fontSize: '12px',
              color: '#686B78', fontWeight: 600,
            }}>
              <span>{tag.icon}</span>{tag.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;