import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import {
  FaMapMarkerAlt, FaPhone,
  FaCreditCard, FaMoneyBill,
  FaMobile, FaCrosshairs,
  FaUniversity, FaWallet
} from 'react-icons/fa';
import { SiRazorpay } from 'react-icons/si';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryPhone: '',
    paymentMethod: 'COD',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      if (!data || !data.items || data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      setCart(data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // ── Use My Location ──────────────────────────────
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setFetchingLocation(true);
    toast.loading('Fetching your location...', { id: 'loc' });
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data?.address) {
            const a = data.address;
            const parts = [
              a.house_number,
              a.road || a.pedestrian || a.street,
              a.neighbourhood || a.suburb,
              a.city || a.town || a.village || a.county,
              a.state,
              a.postcode,
            ].filter(Boolean);
            setFormData(p => ({ ...p, deliveryAddress: parts.join(', ') }));
            setErrors(p => ({ ...p, deliveryAddress: '' }));
            toast.success('Location fetched!', { id: 'loc' });
          } else {
            toast.error('Could not read address. Enter manually.', { id: 'loc' });
          }
        } catch {
          toast.error('Failed to get address. Enter manually.', { id: 'loc' });
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => {
        setFetchingLocation(false);
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : 'Unable to fetch location.',
          { id: 'loc' }
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.deliveryAddress.trim())
      newErrors.deliveryAddress = 'Delivery address is required';
    if (!formData.deliveryPhone.trim())
      newErrors.deliveryPhone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.deliveryPhone))
      newErrors.deliveryPhone = 'Enter valid 10-digit phone number';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Razorpay Payment Handler ─────────────────────
  const handleRazorpayPayment = async () => {
    try {
      // Step 1: Create order on backend
      const razorpayOrder = await orderService.createRazorpayOrder(
        Math.round(cart.total * 100) // amount in paise
      );

      // Step 2: Open Razorpay checkout
      const options = {
        key: 'Replace your key', // add the razorpay key
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'HotByte',
        description: 'Food Order Payment',
        image: '/logo192.png',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Step 4: Place the actual order
            const orderData = {
              ...formData,
              couponCode: couponCode || null,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            };
            const order = await orderService.placeOrder(orderData);
            toast.success('Payment successful! Order placed 🎉');
            navigate(`/order-success/${order.orderId}`);
          } catch (err) {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          contact: formData.deliveryPhone,
        },
        theme: { color: '#E23744' },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            toast.error('Payment cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setPlacing(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      setPlacing(false);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  // ── Place Order Handler ──────────────────────────
  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setPlacing(true);

    try {
      // COD — place order directly
      if (formData.paymentMethod === 'COD') {
        const orderData = {
          ...formData,
          couponCode: couponCode || null,
        };
        const order = await orderService.placeOrder(orderData);
        toast.success('Order placed successfully! 🎉');
        navigate(`/order-success/${order.orderId}`);

      } else {
        // UPI / CARD / NET_BANKING — go through Razorpay
        await handleRazorpayPayment();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to place order';
      toast.error(msg);
      setPlacing(false);
    }
  };

  const paymentMethods = [
    {
      value: 'COD',
      label: 'Cash on Delivery',
      desc: 'Pay when your food arrives',
      icon: <FaMoneyBill style={{ color: '#28a745', fontSize: '20px' }} />,
    },
    {
      value: 'UPI',
      label: 'UPI Payment',
      desc: 'GPay, PhonePe, Paytm & more',
      icon: <FaMobile style={{ color: '#E23744', fontSize: '20px' }} />,
      badge: 'INSTANT',
    },
    {
      value: 'CARD',
      label: 'Credit / Debit Card',
      desc: 'Visa, Mastercard, RuPay',
      icon: <FaCreditCard style={{ color: '#0066ff', fontSize: '20px' }} />,
    },
    {
      value: 'NET_BANKING',
      label: 'Net Banking',
      desc: 'All major banks supported',
      icon: <FaUniversity style={{ color: '#7B61FF', fontSize: '20px' }} />,
    },
    {
      value: 'WALLET',
      label: 'Wallets',
      desc: 'Paytm, Amazon Pay & more',
      icon: <FaWallet style={{ color: '#FC8019', fontSize: '20px' }} />,
    },
  ];

  if (loading) return (
    <div>
      <Navbar />
      <div className="loader"><div className="spinner"></div></div>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div className="container py-5">
        <h2 style={{ fontWeight: 700, marginBottom: '30px' }}>
          📋 Checkout
        </h2>

        <div className="row g-4">

          {/* ── Left — Delivery & Payment ── */}
          <div className="col-lg-8">

            {/* Delivery Details */}
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '24px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              marginBottom: '20px',
            }}>
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
                <FaMapMarkerAlt className="me-2 text-danger" />
                Delivery Details
              </h5>

              {/* Address */}
              <div className="mb-3">
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '6px',
                }}>
                  <label style={{ fontWeight: 600, fontSize: '14px' }}>
                    Delivery Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={fetchingLocation}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      background: '#FFF0F1', border: '1.5px solid #E23744',
                      color: '#E23744', borderRadius: '20px',
                      padding: '5px 12px', fontSize: '12px', fontWeight: 700,
                      cursor: fetchingLocation ? 'not-allowed' : 'pointer',
                      fontFamily: 'Poppins, sans-serif',
                      opacity: fetchingLocation ? 0.7 : 1, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (!fetchingLocation) {
                        e.currentTarget.style.background = '#E23744';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#FFF0F1';
                      e.currentTarget.style.color = '#E23744';
                    }}
                  >
                    <FaCrosshairs size={10} />
                    {fetchingLocation ? 'Fetching...' : 'Use My Location'}
                  </button>
                </div>
                <textarea
                  name="deliveryAddress"
                  placeholder="Enter your full delivery address"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px',
                    border: `2px solid ${errors.deliveryAddress ? '#dc3545' : '#eee'}`,
                    borderRadius: '12px', fontSize: '14px',
                    outline: 'none', resize: 'none',
                  }}
                />
                {errors.deliveryAddress && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    {errors.deliveryAddress}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label style={{
                  fontWeight: 600, fontSize: '14px',
                  marginBottom: '6px', display: 'block',
                }}>
                  <FaPhone className="me-1" />
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="deliveryPhone"
                  placeholder="10-digit phone number"
                  value={formData.deliveryPhone}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '12px',
                    border: `2px solid ${errors.deliveryPhone ? '#dc3545' : '#eee'}`,
                    borderRadius: '12px', fontSize: '14px', outline: 'none',
                  }}
                />
                {errors.deliveryPhone && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    {errors.deliveryPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '24px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
            }}>
              <h5 style={{ fontWeight: 700, marginBottom: '8px' }}>
                <FaCreditCard className="me-2 text-primary" />
                Payment Method
              </h5>

              {/* Razorpay badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginBottom: '20px',
              }}>
                <span style={{ fontSize: '12px', color: '#686B78' }}>
                  Secured by
                </span>
                <span style={{
                  fontWeight: 800, fontSize: '13px', color: '#072654',
                  letterSpacing: '0.5px',
                }}>
                  Razorpay
                </span>
                <span style={{ fontSize: '11px', color: '#60B246', fontWeight: 700 }}>
                  🔒 100% Secure
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                {paymentMethods.map(pm => (
                  <div key={pm.value}
                    onClick={() => setFormData(prev => ({
                      ...prev, paymentMethod: pm.value
                    }))}
                    style={{
                      border: `2px solid ${formData.paymentMethod === pm.value ? '#E23744' : '#eee'}`,
                      borderRadius: '12px', padding: '16px',
                      cursor: 'pointer',
                      background: formData.paymentMethod === pm.value ? '#FFF0F1' : 'white',
                      display: 'flex', alignItems: 'center', gap: '14px',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{ flexShrink: 0 }}>{pm.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 700, fontSize: '14px',
                        color: formData.paymentMethod === pm.value ? '#E23744' : '#1a1a1a',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}>
                        {pm.label}
                        {pm.badge && (
                          <span style={{
                            background: '#E23744', color: '#fff',
                            fontSize: '10px', fontWeight: 800,
                            padding: '2px 8px', borderRadius: '10px',
                            letterSpacing: '0.5px',
                          }}>
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#686B78', marginTop: '2px' }}>
                        {pm.desc}
                      </div>
                    </div>
                    {formData.paymentMethod === pm.value && (
                      <span style={{ color: '#E23744', fontWeight: 800, fontSize: '16px' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Info note for online payments */}
              {formData.paymentMethod !== 'COD' && (
                <div style={{
                  marginTop: '16px',
                  background: '#F0FAF0', border: '1px solid #C8E6C9',
                  borderRadius: '10px', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <span style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 600 }}>
                    You'll be redirected to Razorpay's secure payment page to complete your payment.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right — Order Summary ── */}
          <div className="col-lg-4">
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '24px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              position: 'sticky', top: '80px',
            }}>
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
                Order Summary
              </h5>

              {/* Items */}
              {cart?.items?.map(item => (
                <div key={item.cartItemId}
                  className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    {item.itemName}
                    <span style={{ color: '#888' }}> x{item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>
                    ₹{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr />

              {/* Coupon */}
              <div className="mb-3">
                <label style={{
                  fontWeight: 600, fontSize: '13px',
                  marginBottom: '6px', display: 'block',
                }}>
                  🏷️ Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="HOTBYTE50"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%', padding: '8px 12px',
                    border: '1px solid #eee', borderRadius: '8px',
                    fontSize: '13px', outline: 'none',
                  }}
                />
              </div>

              <hr />

              {/* Totals */}
              {[
                { label: 'Subtotal', value: `₹${cart?.subtotal?.toFixed(2)}` },
                { label: 'Delivery', value: `₹${cart?.deliveryFee?.toFixed(2)}` },
              ].map((row, i) => (
                <div key={i} className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#888' }}>{row.label}</span>
                  <span style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '22px', color: '#E23744' }}>
                  ₹{cart?.total?.toFixed(2)}
                </span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                style={{
                  width: '100%',
                  background: placing ? '#ccc'
                    : 'linear-gradient(135deg,#E23744,#b71c1c)',
                  color: 'white', border: 'none',
                  padding: '14px', borderRadius: '12px',
                  fontWeight: 700, fontSize: '16px',
                  cursor: placing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}>
                {placing ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {formData.paymentMethod === 'COD' ? 'Placing Order...' : 'Opening Payment...'}
                  </span>
                ) : (
                  formData.paymentMethod === 'COD'
                    ? '🚀 Place Order'
                    : '💳 Proceed to Pay ₹' + cart?.total?.toFixed(2)
                )}
              </button>

              <p style={{
                fontSize: '12px', color: '#888',
                textAlign: 'center', marginTop: '10px',
              }}>
                🔒 Secure & Safe Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;