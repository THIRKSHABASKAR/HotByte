import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  FaUser, FaEnvelope, FaPhone,
  FaWallet, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', gender: '',
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data.data);
      setFormData({
        name: res.data.data.name || '',
        phone: res.data.data.phone || '',
        gender: res.data.data.gender || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', formData);
      setProfile(res.data.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="loader"><div className="spinner"></div></div>
    </div>
  );

  return (
    <div style={{
      background: '#F7F7F8',
      minHeight: '100vh',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <Navbar />

      <div className="container py-5">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 5px 30px rgba(0,0,0,0.1)',
          }}>

            {/* Header */}
            <div style={{
              background: '#E23744',
              padding: '40px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '90px', height: '90px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                border: '3px solid rgba(255,255,255,0.5)',
              }}>
                <FaUser style={{ color: '#fff', fontSize: '34px' }} />
              </div>
              <h3 style={{
                color: 'white', fontWeight: 800, marginBottom: '4px',
              }}>
                {profile?.name}
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px',
              }}>
                {profile?.email}
              </p>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '12px', fontWeight: 700,
                display: 'inline-block',
                marginTop: '10px',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                {profile?.role}
              </span>
            </div>

            {/* Wallet Balance */}
            <div style={{
              background: '#FFF0F1',
              padding: '16px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaWallet style={{ color: '#E23744' }} />
                <span style={{ fontWeight: 600 }}>Wallet Balance</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '22px', color: '#E23744' }}>
                {profile?.walletBalance || 0}
              </span>
            </div>

            {/* Profile Fields */}
            <div style={{ padding: '30px' }}>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}>
                <h5 style={{ fontWeight: 800, margin: 0, fontSize: '18px' }}>
                  Personal Information
                </h5>

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      background: '#FFF0F1',
                      border: 'none',
                      color: '#E23744',
                      borderRadius: '20px',
                      padding: '7px 18px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center', gap: '6px',
                      fontSize: '13px',
                      fontFamily: 'Poppins, sans-serif',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#E23744';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#FFF0F1';
                      e.currentTarget.style.color = '#E23744';
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditing(false)}
                      style={{
                        background: '#f8f8f8', border: 'none',
                        borderRadius: '20px', padding: '7px 16px',
                        cursor: 'pointer', color: '#686B78',
                        fontWeight: 600, fontSize: '13px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontFamily: 'Poppins, sans-serif',
                      }}>
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        background: saving ? '#ccc' : '#E23744',
                        border: 'none', color: 'white',
                        borderRadius: '20px', padding: '7px 18px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontWeight: 700, fontSize: '13px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontFamily: 'Poppins, sans-serif',
                        boxShadow: saving ? 'none' : '0 4px 12px rgba(226,55,68,0.3)',
                        transition: 'all 0.2s',
                      }}>
                      <FaSave />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {[
                {
                  label: 'Full Name',
                  icon: <FaUser style={{ color: '#E23744' }} />,
                  field: 'name', type: 'text',
                  value: editing ? formData.name : profile?.name,
                },
                {
                  label: 'Email Address',
                  icon: <FaEnvelope style={{ color: '#E23744' }} />,
                  field: 'email', type: 'email',
                  value: profile?.email,
                  readOnly: true,
                },
                {
                  label: 'Phone Number',
                  icon: <FaPhone style={{ color: '#E23744' }} />,
                  field: 'phone', type: 'tel',
                  value: editing ? formData.phone : profile?.phone,
                },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <label style={{
                    fontWeight: 600, fontSize: '13px',
                    color: '#686B78', marginBottom: '8px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    {field.icon} {field.label}
                  </label>
                  {editing && !field.readOnly ? (
                    <input
                      type={field.type}
                      value={formData[field.field] || ''}
                      onChange={e => setFormData(prev =>
                        ({ ...prev, [field.field]: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 14px',
                        border: '1.5px solid #E9E9EB',
                        borderRadius: '10px', fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#1a1a1a',
                        transition: 'border 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#E23744';
                        e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#E9E9EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: '12px 14px',
                      background: '#F7F7F8',
                      borderRadius: '10px', fontSize: '14px',
                      color: field.readOnly ? '#93959F' : '#1a1a1a',
                    }}>
                      {field.value || '—'}
                    </div>
                  )}
                </div>
              ))}

              {/* Gender */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{
                  fontWeight: 600, fontSize: '13px',
                  color: '#686B78', marginBottom: '8px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <FaUser style={{ color: '#E23744' }} /> Gender
                </label>
                {editing ? (
                  <select
                    value={formData.gender}
                    onChange={e => setFormData(prev =>
                      ({ ...prev, gender: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #E9E9EB',
                      borderRadius: '10px', fontSize: '14px',
                      outline: 'none', background: 'white',
                      fontFamily: 'Poppins, sans-serif',
                      color: '#1a1a1a', cursor: 'pointer',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#E23744';
                      e.target.style.boxShadow = '0 0 0 3px rgba(226,55,68,0.08)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#E9E9EB';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <div style={{
                    padding: '12px 14px',
                    background: '#F7F7F8',
                    borderRadius: '10px',
                    fontSize: '14px', color: '#1a1a1a',
                  }}>
                    {profile?.gender || '—'}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;