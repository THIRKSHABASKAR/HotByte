import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      fontFamily: 'Poppins, sans-serif',
      background: '#fff',
      minHeight: '100vh',
    }}>
      <Navbar />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        padding: '40px 20px',
      }}>

        {/* 404 Visual */}
        <div style={{
          fontSize: '120px',
          lineHeight: 1,
          marginBottom: '16px',
          position: 'relative',
        }}>
          🍽️
        </div>

        <div style={{
          fontSize: '80px',
          fontWeight: 900,
          color: '#E23744',
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          404
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#1a1a1a',
          marginBottom: '12px',
        }}>
          Oops! Page not found
        </h2>

        <p style={{
          color: '#686B78',
          fontSize: '16px',
          marginBottom: '36px',
          maxWidth: '380px',
          lineHeight: 1.6,
        }}>
          Looks like this page went out for
          delivery and never came back! 😄
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background:
                 '#E23744',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              boxShadow:
                '0 6px 20px rgba(226,55,68,0.3)',
            }}>
            🏠 Go Home
          </button>
          <button
            onClick={() => navigate('/menu')}
            style={{
              background: '#fff',
              border: '1.5px solid #E9E9EB',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              color: '#1a1a1a',
              fontFamily: 'Poppins, sans-serif',
            }}>
            🍔 Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;