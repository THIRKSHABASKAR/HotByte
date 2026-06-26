import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaUsers, FaStore, FaClipboardList,
  FaTrash, FaPlus, FaSignOutAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] =
    useState(false);
  const [createForm, setCreateForm] = useState({
    ownerName: '', ownerEmail: '',
    ownerPassword: '', ownerPhone: '',
    restaurantName: '', description: '',
    location: '', city: '', phone: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [u, r, o] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/restaurants'),
        api.get('/admin/orders'),
      ]);
      setUsers(u.data.data || []);
      setRestaurants(r.data.data || []);
      setOrders(o.data.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"?`))
      return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev =>
        prev.filter(u => u.id !== userId));
      toast.success('User deleted');
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to delete');
    }
  };

  const handleDeleteRestaurant = async (
    restId, name) => {
    if (!window.confirm(
      `Delete restaurant "${name}"? This will delete all its menu items too!`))
      return;
    try {
      await api.delete(
        `/admin/restaurants/${restId}`);
      setRestaurants(prev =>
        prev.filter(r => r.id !== restId));
      toast.success('Restaurant deleted');
    } catch (err) {
      toast.error('Failed to delete restaurant');
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post(
        '/admin/restaurants/create', createForm);
      toast.success(
        'Restaurant created successfully! 🎉');
      setShowCreateModal(false);
      setCreateForm({
        ownerName: '', ownerEmail: '',
        ownerPassword: '', ownerPhone: '',
        restaurantName: '', description: '',
        location: '', city: '', phone: '',
      });
      fetchAll();
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to create restaurant');
    } finally {
      setCreating(false);
    }
  };

  const stats = [
    {
      label: 'Total Users',
      value: users.filter(
        u => u.role === 'USER').length,
      icon: <FaUsers />, color: '#E23744',
      bg: '#FFF0F1',
    },
    {
      label: 'Restaurants',
      value: restaurants.length,
      icon: <FaStore />, color: '#E23744',
      bg: '#FFF5EE',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: <FaClipboardList />, color: '#60B246',
      bg: '#F0FAF0',
    },
  ];

  return (
    <div style={{ minHeight: '100vh',
      background: '#F5F5F6' }}>

      {/* Admin Topbar */}
      <div style={{
        background: '#1a1a1a',
        padding: '14px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '24px' }}>🔥</span>
          <span style={{
            fontSize: '20px', fontWeight: 900,
            color: '#E23744',
          }}>
            HotByte
          </span>
          <span style={{
            background: '#E23744',
            color: '#fff', fontSize: '11px',
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: '20px',
            marginLeft: '4px',
          }}>
            ADMIN
          </span>
        </div>
        <button
          onClick={logout}
          style={{
            background: '#E23744', color: '#fff',
            border: 'none', borderRadius: '8px',
            padding: '8px 20px', fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            display: 'flex', alignItems: 'center',
            gap: '6px', fontSize: '14px',
          }}>
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      <div style={{ padding: '32px' }}>

        {/* Title */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 900,
            color: '#1a1a1a', marginBottom: '4px',
          }}>
            Admin Dashboard 👑
          </h1>
          <p style={{
            color: '#686B78', margin: 0,
            fontSize: '14px',
          }}>
            Full control of HotByte platform
          </p>
        </div>

        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(200px,1fr))',
              gap: '20px', marginBottom: '28px',
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <div style={{
                    width: '52px', height: '52px',
                    background: s.bg,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color, fontSize: '22px',
                    flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: 900,
                      color: '#1a1a1a',
                      lineHeight: 1,
                    }}>
                      {s.value}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#686B78',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: '4px',
              marginBottom: '20px',
              background: '#fff',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid #F0F0F0',
              width: 'fit-content',
            }}>
              {[
                { key: 'users', label: '👤 Users' },
                { key: 'restaurants',
                  label: '🏪 Restaurants' },
                { key: 'orders',
                  label: '📦 Orders' },
              ].map(t => (
                <button key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
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

            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #F0F0F0',
              }}>
                <div style={{
                  padding: '16px 20px',
                  background: '#F5F5F6',
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr 100px 120px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#686B78',
                  textTransform: 'uppercase',
                }}>
                  <div>Name / Email</div>
                  <div>Phone</div>
                  <div>Role</div>
                  <div>Action</div>
                </div>
                {users.map((user, i) => (
                  <div key={user.id} style={{
                    padding: '14px 20px',
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr 100px 120px',
                    alignItems: 'center',
                    borderBottom:
                      i < users.length - 1
                        ? '1px solid #F5F5F6' : 'none',
                  }}>
                    <div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '14px',
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#686B78',
                      }}>
                        {user.email}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#686B78',
                    }}>
                      {user.phone || '—'}
                    </div>
                    <div>
                      <span style={{
                        background:
                          user.role === 'ADMIN'
                            ? '#FFF0F1'
                            : user.role === 'RESTAURANT'
                              ? '#FFF5EE' : '#F0FAF0',
                        color:
                          user.role === 'ADMIN'
                            ? '#E23744'
                            : user.role === 'RESTAURANT'
                              ? '#E23744' : '#60B246',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}>
                        {user.role}
                      </span>
                    </div>
                    <div>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() =>
                            handleDeleteUser(
                              user.id, user.name)}
                          style={{
                            background: '#FFF0F1',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            color: '#E23744',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily:
                              'Poppins, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                          <FaTrash /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── RESTAURANTS TAB ── */}
            {tab === 'restaurants' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '16px',
                }}>
                  <button
                    onClick={() =>
                      setShowCreateModal(true)}
                    style={{
                     background: 'linear-gradient(135deg,#E23744,#c62839)',
                      color: '#fff', border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontFamily: 'Poppins,sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                    <FaPlus /> Add Restaurant
                  </button>
                </div>

                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{
                    padding: '16px 20px',
                    background: '#F5F5F6',
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr 100px 120px',
                    fontSize: '12px', fontWeight: 700,
                    color: '#686B78',
                    textTransform: 'uppercase',
                  }}>
                    <div>Restaurant</div>
                    <div>Location</div>
                    <div>Status</div>
                    <div>Action</div>
                  </div>

                  {restaurants.length === 0 ? (
                    <div style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#686B78',
                    }}>
                      No restaurants yet.
                      Add your first one!
                    </div>
                  ) : (
                    restaurants.map((rest, i) => (
                      <div key={rest.id} style={{
                        padding: '14px 20px',
                        display: 'grid',
                        gridTemplateColumns:
                          '1fr 1fr 100px 120px',
                        alignItems: 'center',
                        borderBottom:
                          i < restaurants.length - 1
                            ? '1px solid #F5F5F6'
                            : 'none',
                      }}>
                        <div>
                          <div style={{
                            fontWeight: 700,
                            fontSize: '14px',
                          }}>
                            {rest.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#686B78',
                          }}>
                            ID: {rest.id}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#686B78',
                        }}>
                          {rest.city || rest.location
                            || '—'}
                        </div>
                        <div>
                          <span style={{
                            background: rest.isActive
                              ? '#F0FAF0' : '#FFF0F1',
                            color: rest.isActive
                              ? '#60B246' : '#E23744',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}>
                            {rest.isActive
                              ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              handleDeleteRestaurant(
                                rest.id, rest.name)}
                            style={{
                              background: '#FFF0F1',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 14px',
                              color: '#E23744',
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontFamily:
                                'Poppins,sans-serif',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #F0F0F0',
              }}>
                <div style={{
                  padding: '16px 20px',
                  background: '#F5F5F6',
                  display: 'grid',
                  gridTemplateColumns:
                    '80px 1fr 1fr 120px 100px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#686B78',
                  textTransform: 'uppercase',
                }}>
                  <div>Order ID</div>
                  <div>Restaurant</div>
                  <div>Address</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                {orders.length === 0 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#686B78',
                  }}>
                    No orders yet
                  </div>
                ) : (
                  orders.slice(0, 50).map((order, i) => (
                    <div key={order.orderId} style={{
                      padding: '12px 20px',
                      display: 'grid',
                      gridTemplateColumns:
                        '80px 1fr 1fr 120px 100px',
                      alignItems: 'center',
                      borderBottom:
                        i < orders.length - 1
                          ? '1px solid #F5F5F6' : 'none',
                      fontSize: '13px',
                    }}>
                      <div style={{
                        fontWeight: 700,
                        color: '#E23744',
                      }}>
                        #{order.orderId}
                      </div>
                      <div style={{ color: '#1a1a1a',
                        fontWeight: 600 }}>
                        {order.restaurantName}
                      </div>
                      <div style={{
                        color: '#686B78',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {order.deliveryAddress
                          ?.slice(0, 30)}...
                      </div>
                      <div style={{
                        fontWeight: 800,
                        color: '#1a1a1a',
                      }}>
                        ₹{order.totalAmount}
                      </div>
                      <div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background:
                            order.status === 'DELIVERED'
                              ? '#60B246'
                              : order.status ===
                                'CANCELLED'
                                ? '#FFEBEE'
                                : '#FFF3E0',
                          color:
                            order.status === 'DELIVERED'
                              ? '#fff'
                              : order.status ===
                                'CANCELLED'
                                ? '#B71C1C'
                                : '#E65100',
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Create Restaurant Modal ── */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            width: '100%', maxWidth: '600px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h4 style={{
              fontWeight: 900, marginBottom: '24px',
              color: '#1a1a1a',
            }}>
              🏪 Add New Restaurant
            </h4>

            <form onSubmit={handleCreateRestaurant}>
              <div style={{
                fontSize: '13px', fontWeight: 700,
                color: '#E23744',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}>
                Owner Account
              </div>
              <div className="row g-3 mb-4">
                {[
                  { field: 'ownerName',
                    label: 'Owner Name *',
                    type: 'text' },
                  { field: 'ownerEmail',
                    label: 'Owner Email *',
                    type: 'email' },
                  { field: 'ownerPassword',
                    label: 'Password *',
                    type: 'password' },
                  { field: 'ownerPhone',
                    label: 'Owner Phone',
                    type: 'tel' },
                ].map(f => (
                  <div key={f.field}
                    className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '13px',
                      marginBottom: '6px',
                    }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      required={f.label.includes('*')}
                      value={createForm[f.field]}
                      onChange={e =>
                        setCreateForm(prev => ({
                          ...prev,
                          [f.field]: e.target.value
                        }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #E9E9EB',
                        borderRadius: '8px',
                        fontSize: '14px', outline: 'none',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{
                fontSize: '13px', fontWeight: 700,
                color: '#E23744',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}>
                Restaurant Details
              </div>
              <div className="row g-3 mb-4">
                {[
                  { field: 'restaurantName',
                    label: 'Restaurant Name *',
                    full: true },
                  { field: 'description',
                    label: 'Description',
                    full: true },
                  { field: 'location',
                    label: 'Location' },
                  { field: 'city', label: 'City' },
                  { field: 'phone',
                    label: 'Restaurant Phone' },
                ].map(f => (
                  <div key={f.field}
                    className={f.full
                      ? 'col-12' : 'col-md-6'}>
                    <label style={{
                      display: 'block',
                      fontWeight: 700,
                      fontSize: '13px',
                      marginBottom: '6px',
                    }}>
                      {f.label}
                    </label>
                    <input
                      type="text"
                      required={f.label.includes('*')}
                      value={createForm[f.field]}
                      onChange={e =>
                        setCreateForm(prev => ({
                          ...prev,
                          [f.field]: e.target.value
                        }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #E9E9EB',
                        borderRadius: '8px',
                        fontSize: '14px', outline: 'none',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', gap: '12px'
              }}>
                <button type="submit"
                  disabled={creating}
                  style={{
                    flex: 1,
                    background: creating ? '#ccc'
                      : '#E23744',
                    color: '#fff', border: 'none',
                    borderRadius: '10px',
                    padding: '14px',
                    fontWeight: 700, fontSize: '15px',
                    cursor: creating
                      ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                  {creating
                    ? 'Creating...'
                    : 'Create Restaurant'}
                </button>
                <button type="button"
                  onClick={() =>
                    setShowCreateModal(false)}
                  style={{
                    padding: '14px 24px',
                    border: '1.5px solid #E9E9EB',
                    borderRadius: '10px',
                    background: '#fff',
                    fontWeight: 700, fontSize: '15px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#686B78',
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;