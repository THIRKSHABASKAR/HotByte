import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const WalletPage = () => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data.data);
    } catch (err) {
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Poppins, sans-serif',
      background: '#F5F5F6',
      minHeight: '100vh',
    }}>
      <Navbar />

      <div className="container py-5">
        <h2 style={{
          fontWeight: 900, fontSize: '28px',
          marginBottom: '28px', color: '#1a1a1a',
        }}>
          My Wallet
        </h2>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <div className="row g-4">

            {/* Balance Card */}
            <div className="col-md-4">
              <div style={{
                background: '#E23744',
                borderRadius: '20px',
                padding: '32px',
                color: '#fff',
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(226,55,68,0.3)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                  💳
                </div>
                <div style={{
                  fontSize: '14px', opacity: 0.85,
                  marginBottom: '8px', fontWeight: 600,
                }}>
                  Available Balance
                </div>
                <div style={{
                  fontSize: '48px', fontWeight: 900,
                  lineHeight: 1, marginBottom: '20px',
                }}>
                  ₹{profile?.walletBalance || 0}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '13px', fontWeight: 600,
                }}>
                  Use wallet balance at checkout
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="col-md-8">
              <div style={{
                background: '#fff', borderRadius: '20px',
                padding: '28px', border: '1px solid #F0F0F0',
                height: '100%',
              }}>
                <h5 style={{ fontWeight: 800, marginBottom: '20px', color: '#1a1a1a' }}>
                  How Wallet Works
                </h5>

                {[
                  {
                    icon: '🎁',
                    title: 'Earn Credits',
                    desc: 'Get wallet credits when orders are cancelled or refunded.',
                    color: '#60B246',
                  },
                  {
                    icon: '💸',
                    title: 'Use at Checkout',
                    desc: 'Select "Wallet" as payment method when placing orders.',
                    color: '#E23744',
                  },
                  {
                    icon: '🔄',
                    title: 'Automatic Refunds',
                    desc: 'Cancelled order amounts go directly to your wallet.',
                    color: '#7B61FF',
                  },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '16px',
                    padding: '16px 0',
                    borderBottom: i < 2 ? '1px solid #F5F5F6' : 'none',
                  }}>
                    <div style={{
                      width: '44px', height: '44px',
                      background: `${item.color}15`,
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontWeight: 700, fontSize: '15px',
                        color: '#1a1a1a', marginBottom: '3px',
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: '13px', color: '#686B78', lineHeight: 1.5,
                      }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="col-12">
              <div style={{
                background: '#fff', borderRadius: '20px',
                padding: '28px', border: '1px solid #F0F0F0',
              }}>
                <h5 style={{ fontWeight: 800, marginBottom: '20px', color: '#1a1a1a' }}>
                  Transaction History
                </h5>
                <div style={{
                  textAlign: 'center', padding: '40px 0', color: '#686B78',
                }}>
                  <FaWallet size={48} style={{ color: '#E9E9EB', marginBottom: '12px' }} />
                  <p style={{ margin: 0 }}>No transactions yet</p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>
                    Your wallet history will appear here
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WalletPage;