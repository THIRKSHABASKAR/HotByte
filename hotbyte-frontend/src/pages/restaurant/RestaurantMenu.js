import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantSidebar from
  '../../components/RestaurantSidebar';
import restaurantService from
  '../../services/restaurantService';
import toast from 'react-hot-toast';
import {
  FaEdit, FaTrash, FaToggleOn,
  FaToggleOff, FaPlus, FaSearch
} from 'react-icons/fa';

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...menuItems];
    if (search.trim()) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(
          search.toLowerCase()));
    }
    if (filterType !== 'ALL') {
      result = result.filter(
        item => item.foodType === filterType);
    }
    setFiltered(result);
  }, [menuItems, search, filterType]);

  const fetchData = async () => {
    try {
      const [items, rest] = await Promise.all([
        restaurantService.getMyMenu(),
        restaurantService.getProfile(),
      ]);
      setMenuItems(items || []);
      setFiltered(items || []);
      setRestaurant(rest);
    } catch (err) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId, name) => {
    if (!window.confirm(
      `Delete "${name}"? This cannot be undone.`))
      return;
    setDeleting(itemId);
    try {
      await restaurantService.deleteMenuItem(itemId);
      setMenuItems(prev =>
        prev.filter(i => i.id !== itemId));
      toast.success(`"${name}" deleted`);
    } catch (err) {
      toast.error('Failed to delete item');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (itemId) => {
    try {
      await restaurantService
        .toggleAvailability(itemId);
      setMenuItems(prev => prev.map(i =>
        i.id === itemId
          ? { ...i, isAvailable: !i.isAvailable }
          : i));
      toast.success('Availability updated');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div style={{ display: 'flex',
      minHeight: '100vh',
      background: '#F5F5F6' }}>
      <RestaurantSidebar restaurant={restaurant} />

      <div style={{
        marginLeft: '260px', flex: 1,
        padding: '32px',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: 900,
              color: '#1a1a1a', marginBottom: '4px',
            }}>
              My Menu 🍽️
            </h1>
            <p style={{
              color: '#686B78', margin: 0,
              fontSize: '14px',
            }}>
              {menuItems.length} items total
            </p>
          </div>
          <button
            onClick={() =>
              navigate('/restaurant/menu/add')}
            style={{
              background:
                '#E23744',
              color: '#fff', border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: 700, fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center', gap: '8px',
            }}>
            <FaPlus /> Add New Item
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          border: '1px solid #F0F0F0',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#F5F5F6',
            borderRadius: '8px',
            padding: '10px 16px',
            flex: 1, minWidth: '200px',
          }}>
            <FaSearch style={{
              color: '#93959F'
            }} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          </div>

          <div style={{
            display: 'flex', gap: '8px'
          }}>
            {['ALL', 'VEG', 'NON_VEG'].map(type => (
              <button key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `1.5px solid ${
                    filterType === type
                      ? '#E23744' : '#E9E9EB'}`,
                  background:
                    filterType === type
                      ? '#FFF0F1' : '#fff',
                  color: filterType === type
                    ? '#E23744' : '#686B78',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                }}>
                {type === 'ALL' ? 'All'
                  : type === 'VEG' ? '🟢 Veg'
                  : '🔴 Non-Veg'}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
          }}>
            <div style={{ fontSize: '60px' }}>🍽️</div>
            <h4 style={{
              fontWeight: 800, marginTop: '16px'
            }}>
              No menu items yet
            </h4>
            <p style={{ color: '#686B78' }}>
              Add your first menu item to get started!
            </p>
            <button
              onClick={() =>
                navigate('/restaurant/menu/add')}
              style={{
                background: '#E23744',
                color: '#fff', border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '12px',
                fontFamily: 'Poppins, sans-serif',
              }}>
              + Add First Item
            </button>
          </div>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #F0F0F0',
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns:
                '60px 1fr 100px 100px 100px 120px 140px',
              padding: '14px 20px',
              background: '#F5F5F6',
              fontSize: '12px', fontWeight: 700,
              color: '#686B78',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              <div>Image</div>
              <div>Item Details</div>
              <div>Category</div>
              <div>Price</div>
              <div>Type</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {filtered.map((item, i) => (
              <div key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '60px 1fr 100px 100px 100px 120px 140px',
                  padding: '16px 20px',
                  alignItems: 'center',
                  borderBottom: i < filtered.length - 1
                    ? '1px solid #F5F5F6' : 'none',
                  opacity: deleting === item.id
                    ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}>

                {/* Image */}
                <img
                  src={item.imageUrl
                    || 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=100&h=100&fit=crop'}
                  alt={item.name}
                  style={{
                    width: '48px', height: '48px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />

                {/* Name */}
                <div>
                  <div style={{
                    fontWeight: 700, fontSize: '14px',
                    color: '#1a1a1a',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontSize: '12px', color: '#686B78',
                    marginTop: '2px',
                  }}>
                    {item.description?.slice(0, 40)}
                    {item.description?.length > 40
                      ? '...' : ''}
                  </div>
                </div>

                {/* Category */}
                <div style={{
                  fontSize: '13px',
                  color: '#686B78',
                  fontWeight: 600,
                }}>
                  {item.categoryName || '—'}
                </div>

                {/* Price */}
                <div>
                  <div style={{
                    fontWeight: 800, fontSize: '14px',
                    color: '#1a1a1a',
                  }}>
                    ₹{item.discountPrice || item.price}
                  </div>
                  {item.discountPrice && (
                    <div style={{
                      fontSize: '12px', color: '#aaa',
                      textDecoration: 'line-through',
                    }}>
                      ₹{item.price}
                    </div>
                  )}
                </div>

                {/* Type */}
                <div>
                  <span style={{
                    fontSize: '12px', fontWeight: 700,
                    color: item.foodType === 'VEG'
                      ? '#60B246' : '#E23744',
                    background: item.foodType === 'VEG'
                      ? '#F0FAF0' : '#FFF0F1',
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}>
                    {item.foodType === 'VEG'
                      ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </div>

                {/* Availability Toggle */}
                <div>
                  <button
                    onClick={() =>
                      handleToggle(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: item.isAvailable
                        ? '#60B246' : '#E23744',
                      fontFamily:
                        'Poppins, sans-serif',
                    }}>
                    {item.isAvailable
                      ? <><FaToggleOn
                          style={{
                            fontSize: '22px',
                            color: '#60B246',
                          }} /> In Stock</>
                      : <><FaToggleOff
                          style={{
                            fontSize: '22px',
                            color: '#E23744',
                          }} /> Out of Stock</>
                    }
                  </button>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex', gap: '8px'
                }}>
                  <button
                    onClick={() => navigate(
                      `/restaurant/menu/edit/${item.id}`,
                      { state: { item } })}
                    style={{
                      background: '#FFF5EE',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      cursor: 'pointer',
                      color: '#FC8019',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily:
                        'Poppins, sans-serif',
                    }}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(
                        item.id, item.name)}
                    disabled={deleting === item.id}
                    style={{
                      background: '#FFF0F1',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      cursor: 'pointer',
                      color: '#E23744',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily:
                        'Poppins, sans-serif',
                    }}>
                    <FaTrash />
                    {deleting === item.id
                      ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;