import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Nav.module.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.hash === `#${path}`;


  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div>
          <button className={styles.logoButton}>
            <img
              src="https://www.marei.ie/wp-content/uploads/2020/03/logo-1.png"
              alt="logo"
              className={styles.logoImage}
            />
          </button>
        </div>

        <div className={styles.navLinks}>
          <Link to="/home" className={`${styles.navLink} ${isActive('/home') ? styles.activeLink : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`}>
            About
          </Link>
          <Link to="/key-outputs" className={`${styles.navLink} ${isActive('/key-outputs') ? styles.activeLink : ''}`}>
            Key Outputs
          </Link>
          <Link to="/pathway-explorer" className={`${styles.navLink} ${isActive('/pathway-explorer') ? styles.activeLink : ''}`}>
            Pathway Explorer
          </Link>
          <Link to="/data-visualisation" className={`${styles.navLink} ${isActive('/data-visualisation') ? styles.activeLink : ''}`}>
            Data Visualisation
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;