import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import menuService from '../services/menuService';
import { FaSearch } from 'react-icons/fa';

const CATEGORY_META = {
  'Pizza':              { emoji: '🍕' },
  'Starters':           { emoji: '🥗' },
  'Pasta':              { emoji: '🍝' },
  'Burger':             { emoji: '🍔' },
  'Burgers':            { emoji: '🍔' },
  'Chicken':            { emoji: '🍗' },
  'Sides & Fries':      { emoji: '🍟' },
  'Biryani':            { emoji: '🍛' },
  'Chicken Biryani':    { emoji: '🍛' },
  'Mutton Biryani':     { emoji: '🍛' },
  'Veg Biryani':        { emoji: '🥘' },
  'Egg Biryani':        { emoji: '🍳' },
  'Seafood Biryani':    { emoji: '🦐' },
  'Dosas':              { emoji: '🫓' },
  'Idli & Vada':        { emoji: '🍱' },
  'Pongal':             { emoji: '🥣' },
  'Uttapam':            { emoji: '🥞' },
  'Meals':              { emoji: '🍽️' },
  'South Indian':       { emoji: '🫓' },
  'Chinese':            { emoji: '🥢' },
  'Noodles':            { emoji: '🍜' },
  'Fried Rice':         { emoji: '🍚' },
  'Soups':              { emoji: '🍲' },
  'Main Course':        { emoji: '🍛' },
  'Beverages':          { emoji: '🥤' },
  'Fresh Juices':       { emoji: '🍹' },
  'Milkshakes':         { emoji: '🥛' },
  'Smoothies':          { emoji: '🫐' },
  'Mojitos & Coolers':  { emoji: '🍸' },
  'Lassi & Buttermilk': { emoji: '🥛' },
  'Hot Beverages':      { emoji: '☕' },
  'Fried Chicken':      { emoji: '🍗' },
  'Chicken Wings':      { emoji: '🍖' },
  'Chicken Burgers':    { emoji: '🍔' },
  'Wraps & Rolls':      { emoji: '🌯' },
  'Sides':              { emoji: '🍟' },
  'Combos':             { emoji: '🎁' },
  'Desserts':           { emoji: '🍰' },
  'Cakes':              { emoji: '🎂' },
  'Pastries':           { emoji: '🥐' },
  'Brownies':           { emoji: '🍫' },
  'Ice Creams':         { emoji: '🍦' },
  'Waffles & Crepes':   { emoji: '🧇' },
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    menuService.getAllCategories()
      .then(cats => setCategories(cats || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Deduplicate by name
  const allCategories = categories.length > 0
    ? [...new Map(categories.map(c => [c.categoryName || c.name, c])).values()]
    : Object.keys(CATEGORY_META).map(name => ({ categoryName: name, name }));

  const filtered = searchQuery.trim()
    ? allCategories.filter(c =>
        (c.categoryName || c.name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
    : allCategories;

  const handleCategoryClick = (name) => {
    navigate(`/menu?search=${encodeURIComponent(name)}`);
  };

  return (
    <div style={{ background: '#F7F7F8', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      {/* Search Bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E9E9EB',
        padding: '14px 0',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#F5F5F6', borderRadius: '10px',
            padding: '11px 16px', gap: '10px',
          }}>
            <FaSearch style={{ color: '#93959F', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none', outline: 'none',
                background: 'transparent',
                fontSize: '14px', flex: 1,
                fontFamily: 'Poppins, sans-serif',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                style={{
                  background: '#D4D5D9', border: 'none',
                  borderRadius: '50%', width: '20px', height: '20px',
                  cursor: 'pointer', fontSize: '11px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '26px', fontWeight: 900,
            color: '#1a1a1a', marginBottom: '6px',
          }}>
            What are you craving? 🍽️
          </h2>
          <p style={{ color: '#686B78', fontSize: '15px', margin: 0 }}>
            Pick a category to explore
          </p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '48px' }}>🔍</div>
            <h4 style={{ marginTop: '16px', color: '#1C1C1C', fontWeight: 800 }}>
              No categories found
            </h4>
            <p style={{ color: '#686B78' }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '24px 16px',
          }}>
            {filtered.map((cat, i) => {
              const name = cat.categoryName || cat.name;
              const meta = CATEGORY_META[name] || { emoji: '🍴' };

              return (
                <div
                  key={i}
                  onClick={() => handleCategoryClick(name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '16px 8px',
                    borderRadius: '16px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Circle */}
                  <div
                    style={{
                      width: '110px', height: '110px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #E23744',
                      boxShadow: '0 4px 16px rgba(226,55,68,0.2)',
                      transition: 'all 0.25s',
                      flexShrink: 0,
                      background: '#FFF0F1',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(226,55,68,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(226,55,68,0.2)';
                    }}
                  >
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '42px',
                      }}>
                        {meta.emoji}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <span style={{
                    fontWeight: 700, fontSize: '14px',
                    color: '#1a1a1a', textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoriesPage;