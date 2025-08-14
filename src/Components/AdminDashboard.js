import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { label: 'Add Resource', path: '/admin/addresource' },
   
    { label: 'Add Skill', path: '/admin/skills' },
    
  ];

  const styles = {
    dashboard: {
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: '#f0f0f0',
      padding: '1.5rem',
      borderRadius: '10px',
      cursor: 'pointer',
      width: '200px',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease, background-color 0.2s ease',
    },
    cardHover: {
      backgroundColor: '#e0f2ff',
      transform: 'scale(1.05)',
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    cardDescription: {
      fontSize: '0.95rem',
      color: '#555',
    },
  };

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <div style={styles.cardContainer}>
        {navItems.map((item, index) => {
          const isHovered = hovered === index;
          const cardStyle = {
            ...styles.card,
            ...(isHovered ? styles.cardHover : {}),
          };

          return (
            <div
              key={item.label}
              style={cardStyle}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.cardTitle}>{item.label}</div>
              <div style={styles.cardDescription}>Go to {item.label} page</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
