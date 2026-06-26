import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation,
  useParams } from 'react-router-dom';
import RestaurantSidebar from
  '../../components/RestaurantSidebar';
import restaurantService from
  '../../services/restaurantService';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const AddMenuItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: editId } = useParams();
  const isEditing = !!editId;
  const editItem = location.state?.item;

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    imageUrl: '',
    foodType: 'VEG',
    availability: 'ALL_DAY',
    tasteInfo: '',
    calories: '',
    proteins: '',
    fats: '',
    carbohydrates: '',
    cookingTime: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInit();
    if (isEditing && editItem) {
      setForm({
        name: editItem.name || '',
        description: editItem.description || '',
        ingredients: editItem.ingredients || '',
        price: editItem.price || '',
        discountPrice: editItem.discountPrice || '',
        categoryId: editItem.categoryId || '',
        imageUrl: editItem.imageUrl || '',
        foodType: editItem.foodType || 'VEG',
        availability:
          editItem.availability || 'ALL_DAY',
        tasteInfo: editItem.tasteInfo || '',
        calories: editItem.calories || '',
        proteins: editItem.proteins || '',
        fats: editItem.fats || '',
        carbohydrates: editItem.carbohydrates || '',
        cookingTime: editItem.cookingTime || '',
      });
    }
  }, []);

  const fetchInit = async () => {
    try {
      const [cats, rest] = await Promise.all([
        restaurantService.getMyCategories(),
        restaurantService.getProfile(),
      ]);
      setCategories(cats || []);
      setRestaurant(rest);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = 'Item name is required';
    if (!form.price || isNaN(form.price)
      || Number(form.price) <= 0)
      e.price = 'Valid price is required';
    if (!form.categoryId)
      e.categoryId = 'Category is required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors(prev => ({
        ...prev, [field]: ''
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice) : null,
        categoryId: parseInt(form.categoryId),
        calories: form.calories
          ? parseInt(form.calories) : null,
        cookingTime: form.cookingTime
          ? parseInt(form.cookingTime) : null,
        proteins: form.proteins
          ? parseFloat(form.proteins) : null,
        fats: form.fats
          ? parseFloat(form.fats) : null,
        carbohydrates: form.carbohydrates
          ? parseFloat(form.carbohydrates) : null,
        tasteInfo: form.tasteInfo || null,
      };

      if (isEditing) {
        await restaurantService.updateMenuItem(
          editId, payload);
        toast.success('Menu item updated! ✅');
      } else {
        await restaurantService.addMenuItem(payload);
        toast.success('Menu item added! 🎉');
      }
      navigate('/restaurant/menu');
    } catch (err) {
      toast.error(
        err.response?.data?.message
        || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${
      errors[field] ? '#E23744' : '#E9E9EB'}`,
    borderRadius: '10px', fontSize: '14px',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif',
    color: '#1a1a1a',
    background: '#fff',
    transition: 'border 0.2s',
  });

  const labelStyle = {
    display: 'block', fontWeight: 700,
    fontSize: '13px', color: '#1a1a1a',
    marginBottom: '6px',
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
          alignItems: 'center',
          gap: '16px', marginBottom: '28px',
        }}>
          <button
            onClick={() =>
              navigate('/restaurant/menu')}
            style={{
              background: '#fff', border: 'none',
              borderRadius: '10px',
              padding: '10px 14px',
              cursor: 'pointer',
              color: '#E23744',
              display: 'flex',
              alignItems: 'center', gap: '6px',
              fontWeight: 700, fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              boxShadow:
                '0 2px 8px rgba(0,0,0,0.08)',
            }}>
            <FaArrowLeft /> Back
          </button>
          <div>
            <h1 style={{
              fontSize: '26px', fontWeight: 900,
              color: '#1a1a1a', marginBottom: '2px',
            }}>
              {isEditing
                ? '✏️ Edit Menu Item'
                : '➕ Add New Menu Item'}
            </h1>
            <p style={{
              color: '#686B78', margin: 0,
              fontSize: '14px',
            }}>
              Fill in the details below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">

            {/* Left Column */}
            <div className="col-lg-8">

              {/* Basic Info */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid #F0F0F0',
              }}>
                <h5 style={{
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: '#1a1a1a',
                }}>
                  Basic Information
                </h5>

                <div className="row g-3">
                  {/* Name */}
                  <div className="col-12">
                    <label style={labelStyle}>
                      Item Name *
                    </label>
                    <input
                      type="text"
                      placeholder=
                        "e.g. Margherita Pizza"
                      value={form.name}
                      onChange={e =>
                        handleChange(
                          'name', e.target.value)}
                      style={inputStyle('name')}
                    />
                    {errors.name && (
                      <div style={{
                        color: '#E23744',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label style={labelStyle}>
                      Description
                    </label>
                    <textarea
                      placeholder=
                        "Describe your dish..."
                      value={form.description}
                      onChange={e =>
                        handleChange(
                          'description',
                          e.target.value)}
                      rows={3}
                      style={{
                        ...inputStyle('description'),
                        resize: 'none',
                      }}
                    />
                  </div>

                  {/* Ingredients */}
                  <div className="col-12">
                    <label style={labelStyle}>
                      Key Ingredients
                    </label>
                    <input
                      type="text"
                      placeholder=
                        "e.g. Tomatoes, Mozzarella, Basil"
                      value={form.ingredients}
                      onChange={e =>
                        handleChange(
                          'ingredients',
                          e.target.value)}
                      style={inputStyle('ingredients')}
                    />
                  </div>

                  {/* Category */}
                  <div className="col-12">
                    <label style={labelStyle}>
                      Category *
                    </label>
                    {categories.length === 0 ? (
                      <div style={{
                        background: '#FFF0F1',
                        border: '1px solid #FFCDD2',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        color: '#E23744',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}>
                        ⚠️ No categories found.
                        Please create a category first
                        in your settings.
                      </div>
                    ) : (
                      <select
                        value={form.categoryId}
                        onChange={e =>
                          handleChange(
                            'categoryId',
                            e.target.value)}
                        style={{
                          ...inputStyle('categoryId'),
                          background: '#fff',
                        }}>
                        <option value="">
                          Select category...
                        </option>
                        {categories.map(cat => (
                          <option
                            key={cat.id}
                            value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.categoryId && (
                      <div style={{
                        color: '#E23744',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}>
                        {errors.categoryId}
                      </div>
                    )}
                  </div>

                  {/* Image URL */}
                  <div className="col-12">
                    <label style={labelStyle}>
                      Image URL
                    </label>
                    <input
                      type="url"
                      placeholder=
                        "https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={e =>
                        handleChange(
                          'imageUrl',
                          e.target.value)}
                      style={inputStyle('imageUrl')}
                    />
                    {form.imageUrl && (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          marginTop: '10px',
                        }}
                        onError={e =>
                          e.target.style.display
                            = 'none'}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Nutritional Info */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #F0F0F0',
              }}>
                <h5 style={{
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: '#1a1a1a',
                }}>
                  Nutritional Information
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#686B78',
                    marginLeft: '8px',
                  }}>
                    (Optional)
                  </span>
                </h5>
                <div className="row g-3">
                  {[
                    { field: 'calories',
                      label: 'Calories (kcal)',
                      placeholder: 'e.g. 350' },
                    { field: 'proteins',
                      label: 'Proteins (g)',
                      placeholder: 'e.g. 12' },
                    { field: 'fats',
                      label: 'Fats (g)',
                      placeholder: 'e.g. 8' },
                    { field: 'carbohydrates',
                      label: 'Carbohydrates (g)',
                      placeholder: 'e.g. 45' },
                  ].map(f => (
                    <div key={f.field}
                      className="col-md-6">
                      <label style={labelStyle}>
                        {f.label}
                      </label>
                      <input
                        type="number"
                        placeholder={f.placeholder}
                        value={form[f.field]}
                        onChange={e =>
                          handleChange(
                            f.field, e.target.value)}
                        style={inputStyle(f.field)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-4">

              {/* Pricing */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid #F0F0F0',
              }}>
                <h5 style={{
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: '#1a1a1a',
                }}>
                  Pricing
                </h5>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 299"
                    value={form.price}
                    onChange={e =>
                      handleChange(
                        'price', e.target.value)}
                    style={inputStyle('price')}
                  />
                  {errors.price && (
                    <div style={{
                      color: '#E23744',
                      fontSize: '12px',
                      marginTop: '4px',
                    }}>
                      {errors.price}
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>
                    Discount Price (₹)
                    <span style={{
                      fontWeight: 500,
                      color: '#686B78',
                      marginLeft: '6px',
                    }}>
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 249"
                    value={form.discountPrice}
                    onChange={e =>
                      handleChange(
                        'discountPrice',
                        e.target.value)}
                    style={inputStyle('discountPrice')}
                  />
                </div>

                {form.price && form.discountPrice && (
                  <div style={{
                    background: '#F0FAF0',
                    border: '1px solid #C8E6C9',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginTop: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2E7D32',
                  }}>
                    💚 Customer saves ₹
                    {(parseFloat(form.price)
                      - parseFloat(form.discountPrice))
                      .toFixed(0)}
                    {' '}(
                    {Math.round(
                      ((form.price - form.discountPrice)
                        / form.price) * 100)}
                    % OFF)
                  </div>
                )}
              </div>

              {/* Food Details */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid #F0F0F0',
              }}>
                <h5 style={{
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: '#1a1a1a',
                }}>
                  Food Details
                </h5>

                {/* Food Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Food Type
                  </label>
                  <div style={{
                    display: 'flex', gap: '8px'
                  }}>
                    {[
                      { v: 'VEG',
                        label: '🟢 Veg',
                        color: '#60B246' },
                      { v: 'NON_VEG',
                        label: '🔴 Non-Veg',
                        color: '#E23744' },
                      { v: 'VEGAN',
                        label: '🌿 Vegan',
                        color: '#2E7D32' },
                    ].map(opt => (
                      <button key={opt.v}
                        type="button"
                        onClick={() =>
                          handleChange(
                            'foodType', opt.v)}
                        style={{
                          flex: 1, padding: '8px 4px',
                          borderRadius: '8px',
                          border: `2px solid ${
                            form.foodType === opt.v
                              ? opt.color : '#E9E9EB'}`,
                          background:
                            form.foodType === opt.v
                              ? `${opt.color}15`
                              : '#fff',
                          color: form.foodType === opt.v
                            ? opt.color : '#686B78',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily:
                            'Poppins, sans-serif',
                        }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Availability
                  </label>
                  <select
                    value={form.availability}
                    onChange={e =>
                      handleChange(
                        'availability',
                        e.target.value)}
                    style={{
                      ...inputStyle('availability'),
                      background: '#fff',
                    }}>
                    <option value="ALL_DAY">
                      🕐 All Day
                    </option>
                    <option value="BREAKFAST">
                      🌅 Breakfast Only
                    </option>
                    <option value="LUNCH">
                      ☀️ Lunch Only
                    </option>
                    <option value="DINNER">
                      🌙 Dinner Only
                    </option>
                  </select>
                </div>

                {/* Taste */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Taste Info
                  </label>
                  <select
                    value={form.tasteInfo}
                    onChange={e =>
                      handleChange(
                        'tasteInfo', e.target.value)}
                    style={{
                      ...inputStyle('tasteInfo'),
                      background: '#fff',
                    }}>
                    <option value="">
                      Select taste...
                    </option>
                    <option value="SWEET">
                      🍬 Sweet
                    </option>
                    <option value="SPICY_LIGHT">
                      🌶️ Mildly Spicy
                    </option>
                    <option value="SPICY_FULL">
                      🔥 Very Spicy
                    </option>
                    <option value="MILD">
                      😊 Mild
                    </option>
                    <option value="SAVORY">
                      😋 Savory
                    </option>
                  </select>
                </div>

                {/* Cooking Time */}
                <div>
                  <label style={labelStyle}>
                    Cooking Time (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={form.cookingTime}
                    onChange={e =>
                      handleChange(
                        'cookingTime',
                        e.target.value)}
                    style={inputStyle('cookingTime')}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: '100%',
                  background: saving ? '#ccc'
                    : '#E23744',
                  color: '#fff', border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontWeight: 800, fontSize: '16px',
                  cursor: saving
                    ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}>
                <FaSave />
                {saving ? 'Saving...'
                  : isEditing
                    ? 'Update Item'
                    : 'Add to Menu'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;