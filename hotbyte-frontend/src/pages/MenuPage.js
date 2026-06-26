import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
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

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [filtered, setFiltered] = useState([]);

  // Handle URL ?search= param on mount
  useEffect(() => {
    const s = searchParams.get('search') || '';
    if (s) {
      setSearchQuery(s);
      setSelectedCategory(s);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      menuService.getAllMenuItems(),
      menuService.getAllCategories(),
    ]).then(([items, cats]) => {
      setMenuItems(items || []);
      setCategories(cats || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...menuItems];

    if (selectedCategory) {
      result = result.filter(item =>
        item.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() && !selectedCategory) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.categoryName?.toLowerCase().includes(q) ||
        item.restaurantName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    }

    if (selectedFoodType) {
      result = result.filter(item => item.foodType === selectedFoodType);
    }

    setFiltered(result);
  }, [menuItems, searchQuery, selectedCategory, selectedFoodType]);

  // Unique categories for filter chips
  const uniqueCategories = [
    ...new Map(categories.map(c => [c.categoryName || c.name, c])).values()
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedFoodType('');
    setSearchParams({});
  };

  return (
    <div style={{ background: '#F7F7F8', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />

      {/* ── Top Bar ── */}
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
            gap: '12px', flexWrap: 'wrap',
          }}>

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#F5F5F6', borderRadius: '10px',
              padding: '11px 16px', gap: '10px', flex: 1,
              minWidth: '200px',
            }}>
              <FaSearch style={{ color: '#93959F', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  border: 'none', outline: 'none',
                  background: 'transparent',
                  fontSize: '14px', flex: 1,
                  fontFamily: 'Poppins, sans-serif',
                  color: '#1a1a1a',
                }}
              />
              {searchQuery && (
                <button onClick={clearFilters}
                  style={{
                    background: '#D4D5D9', border: 'none',
                    borderRadius: '50%', width: '20px', height: '20px',
                    cursor: 'pointer', fontSize: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
              )}
            </div>

            {/* Veg / Non-Veg filter */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'All', value: '' },
                { label: '🟢 Veg', value: 'VEG' },
                { label: '🔴 Non-Veg', value: 'NON_VEG' },
              ].map(opt => (
                <button key={opt.value}
                  onClick={() => setSelectedFoodType(opt.value)}
                  style={{
                    padding: '8px 16px', borderRadius: '20px',
                    border: `1.5px solid ${selectedFoodType === opt.value ? '#E23744' : '#D4D5D9'}`,
                    background: selectedFoodType === opt.value ? '#FFF0F1' : '#fff',
                    color: selectedFoodType === opt.value ? '#E23744' : '#1C1C1C',
                    fontWeight: 700, fontSize: '13px',
                    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                    transition: 'all 0.2s',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter chips */}
          {uniqueCategories.length > 0 && (
            <div className="category-chips" style={{
  display: 'flex', gap: '8px',
  overflowX: 'auto', marginTop: '12px',
  paddingBottom: '4px',
  scrollbarWidth: 'thin',
  scrollbarColor: '#E23744 transparent',
}}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: '6px 16px', borderRadius: '20px', flexShrink: 0,
                  border: `1.5px solid ${!selectedCategory ? '#E23744' : '#D4D5D9'}`,
                  background: !selectedCategory ? '#FFF0F1' : '#fff',
                  color: !selectedCategory ? '#E23744' : '#686B78',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                }}>
                All
              </button>
              {uniqueCategories.map((cat, i) => {
                const name = cat.categoryName || cat.name;
                const isActive = selectedCategory?.toLowerCase() === name.toLowerCase();
                const meta = CATEGORY_META[name] || { emoji: '🍴' };
                return (
                  <button key={i}
                    onClick={() => {
                      setSelectedCategory(isActive ? null : name);
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '6px 16px', borderRadius: '20px', flexShrink: 0,
                      border: `1.5px solid ${isActive ? '#E23744' : '#D4D5D9'}`,
                      background: isActive ? '#FFF0F1' : '#fff',
                      color: isActive ? '#E23744' : '#686B78',
                      fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      transition: 'all 0.2s',
                    }}>
                    {meta.emoji} {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container py-4">

        {/* Results count + active filter */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '8px', marginBottom: '20px', flexWrap: 'wrap',
        }}>
          <span style={{ color: '#686B78', fontSize: '14px', fontWeight: 600 }}>
            {loading ? 'Loading...' : `${filtered.length} items`}
          </span>
          {selectedCategory && (
            <>
              <span style={{ color: '#D4D5D9' }}>in</span>
              <span style={{
                background: '#FFF0F1', color: '#E23744',
                padding: '3px 12px', borderRadius: '20px',
                fontSize: '13px', fontWeight: 700,
              }}>
                {CATEGORY_META[selectedCategory]?.emoji} {selectedCategory}
                <span
                  onClick={clearFilters}
                  style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.7 }}>
                  ✕
                </span>
              </span>
            </>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '64px' }}>🍽️</div>
            <h4 style={{ marginTop: '16px', color: '#1C1C1C', fontWeight: 800 }}>
              No items found
            </h4>
            <p style={{ color: '#686B78' }}>Try a different search or category</p>
            <button
              onClick={clearFilters}
              style={{
                background: '#E23744', color: '#fff',
                border: 'none', borderRadius: '10px',
                padding: '12px 28px', fontWeight: 800,
                fontSize: '14px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                marginTop: '16px',
                boxShadow: '0 4px 16px rgba(226,55,68,0.3)',
              }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map(item => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;