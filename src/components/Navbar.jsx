import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Nav.module.css';

// Breadcrumb component
const Breadcrumb = ({ location }) => {
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbNames = {
    'home': 'Home',
    'key-outputs': 'Research & Publications',
    'pathway-explorer': 'Recycling Solutions',
    'data-visualisation': 'Analysis Tools',
    'compare': 'Compare Options',
    'mcda': 'Decision Tool',
    'manual': 'User Guide'
  };

  if (pathnames.length === 0 || pathnames[0] === 'home') {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <div style={{
      background: '#f8fafc',
      padding: '8px 0',
      fontSize: '14px',
      color: '#666',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        fontFamily: "'FiraGO', sans-serif"
      }}>
        <Link 
          to="/home" 
          style={{ 
            color: '#006087', 
            textDecoration: 'none' 
          }}
        >
          Home
        </Link>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return (
            <span key={pathname}>
              <span style={{ margin: '0 8px', color: '#ccc' }}>/</span>
              {isLast ? (
                <span style={{ color: '#003C69', fontWeight: '500' }}>
                  {displayName}
                </span>
              ) : (
                <Link 
                  to={routeTo} 
                  style={{ 
                    color: '#006087', 
                    textDecoration: 'none' 
                  }}
                >
                  {displayName}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    const currentPath = location.pathname;
    
    if (path === '/home') {
      return currentPath === '/' || currentPath === '/home';
    }
    
    return currentPath.startsWith(path);
  };

  // Navigation items with clearer labels and descriptions
  const navItems = [
    {
      path: '/home',
      label: 'Home',
      description: 'Project overview and latest updates'
    },
    {
      path: '/key-outputs',
      label: 'Research & Publications',
      description: 'Scientific studies and technical reports'
    },
    {
      path: '/pathway-explorer',
      label: 'Recycling Solutions',
      description: 'Interactive tyre recycling pathways'
    },
    {
      path: '/data-visualisation',
      label: 'Analysis Tools',
      description: 'Compare and analyze recycling options'
    }
  ];

  return (
    <>
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
                alt="ENTYRE Project Logo"
                className={styles.logoImage}
                style={{ height: 80, width: 'auto' }}
              />
            </Link>
          </div>

          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`${styles.navLink} ${isActive(item.path) ? styles.activeLink : ''}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                title={item.description}
                style={{
                  position: 'relative'
                }}
              >
                {item.label}
                {/* Tooltip on hover */}
                <span style={{
                  position: 'absolute',
                  bottom: '-45px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#003C69',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  opacity: 0,
                  visibility: 'hidden',
                  transition: 'opacity 0.2s, visibility 0.2s',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}
                className="nav-tooltip"
                >
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <Breadcrumb location={location} />
      
      {/* Add CSS for tooltip hover effect */}
      <style jsx>{`
        .${styles.navLink}:hover .nav-tooltip {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;