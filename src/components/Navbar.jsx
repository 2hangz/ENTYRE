import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Nav.module.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    const currentPath = location.pathname;
    
    if (path === '/home') {
      return currentPath === '/' || currentPath === '/home';
    }
    
    return currentPath.startsWith(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div>
          <Link to="/home" className={styles.logoButton} style={{ display: 'flex', alignItems: 'center', height: 70 }}>
            <img
              src="https://res.cloudinary.com/ddzezr2rm/image/upload/v1755300553/logo_d7wqie.png"
              alt="MaREI Centre Logo"
              className={styles.logoImage}
              style={{ height: 70, width: 'auto', marginRight: 40 }}
            />
            <img
              src="https://res.cloudinary.com/ddzezr2rm/image/upload/v1755300552/logo2_eixhfj.png"
              alt="MaREI Centre Logo"
              className={styles.logoImage}
              style={{ height: 80, width: 'auto' }}
            />
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link 
            to="/home" 
            className={`${styles.navLink} ${isActive('/home') ? styles.activeLink : ''}`}
            aria-current={isActive('/home') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            to="/key-outputs" 
            className={`${styles.navLink} ${isActive('/key-outputs') ? styles.activeLink : ''}`}
            aria-current={isActive('/key-outputs') ? 'page' : undefined}
          >
            Key Outputs
          </Link>
          <Link 
            to="/pathway-explorer" 
            className={`${styles.navLink} ${isActive('/pathway-explorer') ? styles.activeLink : ''}`}
            aria-current={isActive('/pathway-explorer') ? 'page' : undefined}
          >
            Pathway Explorer
          </Link>
          <Link 
            to="/data-visualisation" 
            className={`${styles.navLink} ${isActive('/data-visualisation') ? styles.activeLink : ''}`}
            aria-current={isActive('/data-visualisation') ? 'page' : undefined}
          >
            Data Visualisation
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;