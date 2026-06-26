import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantSidebar from
  '../../components/RestaurantSidebar';
import restaurantService from
  '../../services/restaurantService';
import toast from 'react-hot-toast';
import {
  FaPlus, FaTrash, FaTags
} from 'react-icons/fa';

const RestaurantCategories = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cats, rest] = await Promise.all([
        restaurantService.getMyCategories(),
        restaurantService.getProfile(),
      ]);
      setCategories(cats || []);
      setRestaurant(rest);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      await restaurantService.addCategory(form);
      toast.success(
        `"${form.name}" category added! ✅`);
      setForm({
        name: '', description: '', imageUrl: ''
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (catId, name) => {
    if (!window.confirm(
      `Delete "${name}" category? All menu items in this category will also be deleted.`))
      return;
    setDeleting(catId);
    try {
      await restaurantService.deleteCategory(catId);
      setCategories(prev =>
        prev.filter(c => c.id !== catId));
      toast.success(`"${name}" deleted`);
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  const FOOD_IMAGES = {
    'Breakfast':
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200&h=200&fit=crop',
    'Lunch':
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop',
    'Dinner':
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
    'Pizza':
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    'Burger':
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    'Biryani':
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop',
    'Desserts':
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop',
    'Beverages':
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop',
    'Starters':
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
    'Main Course':
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=200&fit=crop',
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#F5F5F6',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <RestaurantSidebar restaurant={restaurant} />

      <div style={{
        marginLeft: '260px',
        flex: 1,
        padding: '32px',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#1a1a1a',
              marginBottom: '4px',
            }}>
              Menu Categories 🏷️
            </h1>
            <p style={{
              color: '#686B78',
              margin: 0,
              fontSize: '14px',
            }}>
              {categories.length} categories —
              organize your menu items
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: showForm
                ? '#F5F5F6'
                : '#E23744',
              color: showForm ? '#686B78' : '#fff',
              border: showForm
                ? '1.5px solid #E9E9EB' : 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}>
            <FaPlus />
            {showForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>

        {/* Add Category Form */}
        {showForm && (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid #F0F0F0',
            boxShadow:
              '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <h5 style={{
              fontWeight: 800,
              marginBottom: '20px',
              color: '#1a1a1a',
              fontSize: '16px',
            }}>
              ➕ New Category
            </h5>

            <form onSubmit={handleAdd}>
              <div className="row g-3">

                {/* Name */}
                <div className="col-md-4">
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1a1a1a',
                    marginBottom: '6px',
                  }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder=
                      "e.g. Pizza, Burger, Starters"
                    value={form.name}
                    onChange={e =>
                      setForm(p => ({
                        ...p, name: e.target.value
                      }))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #E9E9EB',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily:
                        'Poppins, sans-serif',
                    }}
                    onFocus={e =>
                      e.target.style.borderColor
                        = '#E23744'}
                    onBlur={e =>
                      e.target.style.borderColor
                        = '#E9E9EB'}
                  />
                </div>

                {/* Description */}
                <div className="col-md-4">
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1a1a1a',
                    marginBottom: '6px',
                  }}>
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder=
                      "Short description (optional)"
                    value={form.description}
                    onChange={e =>
                      setForm(p => ({
                        ...p,
                        description: e.target.value
                      }))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #E9E9EB',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily:
                        'Poppins, sans-serif',
                    }}
                    onFocus={e =>
                      e.target.style.borderColor
                        = '#E23744'}
                    onBlur={e =>
                      e.target.style.borderColor
                        = '#E9E9EB'}
                  />
                </div>

                {/* Image URL */}
                <div className="col-md-4">
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1a1a1a',
                    marginBottom: '6px',
                  }}>
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={e =>
                      setForm(p => ({
                        ...p,
                        imageUrl: e.target.value
                      }))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #E9E9EB',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily:
                        'Poppins, sans-serif',
                    }}
                    onFocus={e =>
                      e.target.style.borderColor
                        = '#E23744'}
                    onBlur={e =>
                      e.target.style.borderColor
                        = '#E9E9EB'}
                  />
                </div>
              </div>

              {/* Quick Pick Suggestions */}
              <div style={{ marginTop: '16px' }}>
                <p style={{
                  fontSize: '12px',
                  color: '#686B78',
                  fontWeight: 600,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Quick Pick
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  {Object.keys(FOOD_IMAGES).map(
                    (name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({
                        name,
                        description: '',
                        imageUrl: FOOD_IMAGES[name],
                      })}
                      style={{
                        background:
                          form.name === name
                            ? '#FFF0F1' : '#F5F5F6',
                        border: `1.5px solid ${
                          form.name === name
                            ? '#E23744' : 'transparent'}`,
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: form.name === name
                          ? '#E23744' : '#686B78',
                        fontFamily:
                          'Poppins, sans-serif',
                        transition: 'all 0.15s',
                      }}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                display: 'flex',
                gap: '12px',
              }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: saving ? '#ccc'
                      : '#E23744',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 28px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: saving
                      ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                  {saving
                    ? 'Adding...' : '✅ Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({
                      name: '',
                      description: '',
                      imageUrl: '',
                    });
                  }}
                  style={{
                    background: '#F5F5F6',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: '#686B78',
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="loader">
            <div className="spinner" />
          </div>
        ) : categories.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '80px 40px',
            textAlign: 'center',
            border: '1px solid #F0F0F0',
          }}>
            <div style={{ fontSize: '64px' }}>
              🏷️
            </div>
            <h4 style={{
              fontWeight: 800,
              marginTop: '16px',
              color: '#1a1a1a',
            }}>
              No categories yet
            </h4>
            <p style={{
              color: '#686B78',
              marginBottom: '24px',
            }}>
              Create categories to organize
              your menu items
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background:
                  '#E23744',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 28px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}>
              + Create First Category
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {categories.map((cat, i) => (
              <div key={cat.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #F0F0F0',
                  transition:
                    'transform 0.2s, box-shadow 0.2s',
                  opacity:
                    deleting === cat.id ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform
                    = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow
                    = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform
                    = 'translateY(0)';
                  e.currentTarget.style.boxShadow
                    = 'none';
                }}>

                {/* Category Image */}
                <div style={{
                  height: '120px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#F5F5F6',
                }}>
                  <img
                    src={cat.imageUrl
                      || FOOD_IMAGES[cat.name]
                      || 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop'}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={e => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                  }} />
                </div>

                {/* Content */}
                <div style={{ padding: '14px' }}>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '15px',
                    color: '#1a1a1a',
                    marginBottom: '4px',
                  }}>
                    {cat.name}
                  </div>
                  {cat.description && (
                    <div style={{
                      fontSize: '12px',
                      color: '#686B78',
                      marginBottom: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {cat.description}
                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(cat.id, cat.name)}
                    disabled={deleting === cat.id}
                    style={{
                      background: '#FFF0F1',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      color: '#E23744',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: deleting === cat.id
                        ? 'not-allowed' : 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: '100%',
                      justifyContent: 'center',
                    }}>
                    <FaTrash size={11} />
                    {deleting === cat.id
                      ? 'Deleting...' : 'Delete'}
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

export default RestaurantCategories;