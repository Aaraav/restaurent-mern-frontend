import React from 'react';

export default function Footer() {
  return (
    <div style={styles.footerContainer}>
      <div style={styles.footerContent}>
        <div style={styles.section}>
          <h2 style={styles.heading}>Urbangroove Eatery</h2>
          <p style={styles.text}>123 Main Street, Faridabad, India</p>
          <p style={styles.text}>(+91) 8920390010</p>
        </div>
        <div style={styles.section}>
          <h2 style={styles.heading}>Quick Links</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}><a style={styles.link} href="/menu">Menu</a></li>
            <li style={styles.listItem}><a style={styles.link} href="/reservations">Reservations</a></li>
            <li style={styles.listItem}><a style={styles.link} href="/contact">Contact</a></li>
          </ul>
        </div>
        <div style={styles.section}>
          <h2 style={styles.heading}>Follow Us</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}><a style={styles.link} href="https://facebook.com/AaraavSehgal">Facebook</a></li>
            <li style={styles.listItem}><a style={styles.link} href="https://instagram.com/aaraav_28">Instagram</a></li>
            <li style={styles.listItem}><a style={styles.link} href="https://twitter.com/AaraavSehgal">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p style={styles.text}>© 2024 Restaurant Name. All rights reserved.</p>
      </div>
    </div>
  );
}

const styles = {
  footerContainer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px 0',
    height:'50px'
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  section: {
    flex: '1',
    padding: '10px',
  },
  heading: {
    color: '#E21837', // red color
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  text: {
    marginBottom: '10px',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    marginBottom: '10px',
  },
  link: {
    color: '#E21837', // red color
    textDecoration: 'none',
  },
  footerBottom: {
    textAlign: 'center',
    marginTop: '20px',
  },
};
