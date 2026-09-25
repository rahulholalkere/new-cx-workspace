import React, { useEffect, useState } from 'react';

export default function App({ cardTitle }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Access Liferay's CSRF auth token dynamically
        const authToken = window.Liferay?.authToken || '';

        const response = await fetch('/o/headless-admin-user/v1.0/my-user-account', {
          headers: {
            'x-csrf-token': authToken,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch user profile`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{cardTitle}</h3>
      {loading && <p style={styles.text}>Loading account details...</p>}
      {error && <p style={{ ...styles.text, color: '#da1414' }}>Error: {error}</p>}
      {userData && (
        <div style={styles.infoGroup}>
          <p style={styles.text}><strong>Name:</strong> {userData.name}</p>
          <p style={styles.text}><strong>Email:</strong> {userData.emailAddress}</p>
        </div>
      )}
    </div>
  );
}

// Inline styles keep the component self-contained within the Shadow DOM
const styles = {
  card: {
    padding: '1.25rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '360px'
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.2rem',
    color: '#0b5fff'
  },
  text: {
    margin: '0.4rem 0',
    fontSize: '0.95rem',
    color: '#393a4d'
  },
  infoGroup: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '0.75rem'
  }
};