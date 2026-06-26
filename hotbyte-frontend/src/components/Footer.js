import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: '#1C1C1C',
    color: '#fff',
    padding: '48px 0 24px',
  }}>
    <div className="container">
      <div className="row g-4 mb-4">

        {/* Brand */}
        <div className="col-lg-4 col-md-6">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '28px' }}>🔥</span>
            <div>
              <div style={{
                fontSize: '24px', fontWeight: 900,
                color: '#E23744', lineHeight: 1,
              }}>
                hotbyte
              </div>
              <div style={{
                fontSize: '10px', color: '#686B78',
                fontWeight: 600,
              }}>
                Hot food. On time. Every time.
              </div>
            </div>
          </div>
          <p style={{
            color: '#93959F', fontSize: '14px',
            lineHeight: 1.7, maxWidth: '280px',
          }}>
            We deliver delicious food from the best
            restaurants right to your door, fast and fresh.
          </p>
          <div style={{
            marginTop: '20px',
            display: 'flex', gap: '8px',
          }}>
            {['App Store', 'Play Store'].map((s, i) => (
              <div key={i} style={{
                background: '#2D2D2D',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px', fontWeight: 700,
                color: 'white', cursor: 'pointer',
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="col-lg-2 col-md-6
          col-6">
          <h6 style={{
            fontWeight: 800, color: 'white',
            marginBottom: '16px', fontSize: '14px',
          }}>
            Company
          </h6>
          {['About Us', 'Careers', 'Blog',
            'Press'].map((item, i) => (
            <div key={i} style={{
              marginBottom: '10px',
            }}>
              <span style={{
                color: '#93959F', fontSize: '14px',
                cursor: 'pointer',
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="col-lg-3 col-md-6 col-6">
          <h6 style={{
            fontWeight: 800, color: 'white',
            marginBottom: '16px', fontSize: '14px',
          }}>
            Contact
          </h6>
          {[
            '📍 Chennai, Tamil Nadu',
            '📞 +91 98765 43210',
            '📧 support@hotbyte.com',
            '🕐 24/7 Customer Support',
          ].map((item, i) => (
            <div key={i} style={{
              color: '#93959F', fontSize: '14px',
              marginBottom: '10px',
            }}>
              {item}
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="col-lg-3 col-md-6">
          <h6 style={{
            fontWeight: 800, color: 'white',
            marginBottom: '16px', fontSize: '14px',
          }}>
            Legal
          </h6>
          {['Privacy Policy', 'Terms of Service',
            'Cookie Policy',
            'Refund Policy'].map((item, i) => (
            <div key={i} style={{
              marginBottom: '10px',
            }}>
              <span style={{
                color: '#93959F', fontSize: '14px',
                cursor: 'pointer',
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #2D2D2D',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{
          color: '#686B78', fontSize: '13px'
        }}>
          © 2024 HotByte. All rights reserved.
        </div>
        <div style={{
          color: '#686B78', fontSize: '13px'
        }}>
          Made with ❤️ in India 🇮🇳
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;