import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import cartService from '../services/cartService';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  FaTrash, FaPlus, FaMinus,
  FaShoppingCart, FaArrowRight
} from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(cartItemId);
    try {
      const updated = await cartService.updateCartItem(
        cartItemId, newQuantity);
      setCart(updated);
      refreshCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (cartItemId) => {
    setUpdating(cartItemId);
    try {
      const updated = await cartService.removeFromCart(
        cartItemId);
      setCart(updated);
      refreshCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm(
      'Clear all items from cart?')) return;
    try {
      await cartService.clearCart();
      setCart(null);
      refreshCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="loader">
        <div className="spinner"></div>
      </div>
    </div>
  );

  const isEmpty = !cart || !cart.items
    || cart.items.length === 0;

  return (
    <div>
      <Navbar />

      <div className="container py-5">
        <h2 style={{ fontWeight: 700, marginBottom: '30px' }}>
          🛒 My Cart
          {!isEmpty && (
            <span style={{
              fontSize: '16px', color: '#888',
              fontWeight: 400, marginLeft: '10px',
            }}>
              ({cart.items.length} items)
            </span>
          )}
        </h2>

        {isEmpty ? (
          <div className="text-center py-5">
            <FaShoppingCart size={80}
              style={{ color: '#eee' }} />
            <h4 className="mt-4" style={{
              color: '#888'
            }}>
              Your cart is empty
            </h4>
            <p style={{ color: '#aaa' }}>
              Add some delicious food to get started!
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary-custom mt-3">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="row g-4">

            {/* Cart Items */}
            <div className="col-lg-8">
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow:
                  '0 2px 15px rgba(0,0,0,0.08)',
              }}>
                {cart.items.map((item, index) => (
                  <div key={item.cartItemId}
                    style={{
                      padding: '20px',
                      borderBottom:
                        index < cart.items.length - 1
                          ? '1px solid #f5f5f5' : 'none',
                      opacity: updating === item.cartItemId
                        ? 0.6 : 1,
                      transition: 'opacity 0.3s',
                    }}>
                    <div className="d-flex
                      align-items-center gap-3">

                      {/* Image */}
                      <img
                        src={item.imageUrl
                          || 'https://via.placeholder.com/80x80?text=Food'}
                        alt={item.itemName}
                        style={{
                          width: '80px', height: '80px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />

                      {/* Details */}
                      <div style={{ flex: 1 }}>
                        <h6 style={{
                          fontWeight: 700,
                          marginBottom: '4px',
                        }}>
                          {item.itemName}
                        </h6>
                        <div style={{
                          fontSize: '12px',
                          color: item.foodType === 'VEG'
                            ? '#28a745' : '#dc3545',
                          fontWeight: 600,
                        }}>
                          {item.foodType === 'VEG'
                            ? '🟢 VEG' : '🔴 NON-VEG'}
                        </div>
                        <div style={{
                          fontWeight: 700,
                          color: '#E23744',
                          marginTop: '4px',
                        }}>
                          ₹{item.unitPrice}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #eee',
                        borderRadius: '50px',
                        overflow: 'hidden',
                      }}>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cartItemId,
                              item.quantity - 1)}
                          disabled={updating
                            === item.cartItemId}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            color: '#E23744',
                          }}>
                          <FaMinus size={10} />
                        </button>
                        <span style={{
                          padding: '0 12px',
                          fontWeight: 700,
                          minWidth: '36px',
                          textAlign: 'center',
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cartItemId,
                              item.quantity + 1)}
                          disabled={updating
                            === item.cartItemId}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            color: '#E23744',
                          }}>
                          <FaPlus size={10} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div style={{
                        fontWeight: 700,
                        fontSize: '16px',
                        minWidth: '70px',
                        textAlign: 'right',
                      }}>
                        ₹{(item.unitPrice *
                          item.quantity).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          handleRemove(item.cartItemId)}
                        disabled={updating
                          === item.cartItemId}
                        style={{
                          background: '#FFF0EB',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px', height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#E23744',
                          flexShrink: 0,
                        }}>
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                <div style={{
                  padding: '15px 20px',
                  borderTop: '1px solid #f5f5f5',
                }}>
                  <button
                    onClick={handleClearCart}
                    style={{
                      background: 'none',
                      border: '1px solid #dc3545',
                      color: '#dc3545',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}>
                    🗑️ Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow:
                  '0 2px 15px rgba(0,0,0,0.08)',
                position: 'sticky', top: '80px',
              }}>
                <h5 style={{
                  fontWeight: 700, marginBottom: '20px'
                }}>
                  Order Summary
                </h5>

                {[
                  {
                    label: 'Subtotal',
                    value: `₹${cart.subtotal?.toFixed(2)}`,
                  },
                  {
                    label: 'Delivery Fee',
                    value: `₹${cart.deliveryFee?.toFixed(2)}`,
                  },
                ].map((row, i) => (
                  <div key={i}
                    className="d-flex
                      justify-content-between mb-2">
                    <span style={{ color: '#888' }}>
                      {row.label}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {row.value}
                    </span>
                  </div>
                ))}

                <hr />

                <div className="d-flex
                  justify-content-between mb-4">
                  <span style={{ fontWeight: 700 }}>
                    Total
                  </span>
                  <span style={{
                    fontWeight: 800,
                    fontSize: '22px',
                    color: '#E23744',
                  }}>
                    ₹{cart.total?.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg,#E23744,#c62839)',
                    color: 'white', border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 700, fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}>
                  Proceed to Checkout
                  <FaArrowRight />
                </button>

                <button
                  onClick={() => navigate('/menu')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: '1px solid #eee',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '10px',
                    color: '#555',
                  }}>
                  + Add More Items
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;