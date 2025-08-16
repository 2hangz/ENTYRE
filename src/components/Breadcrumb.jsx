import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  // Default breadcrumb mapping
  const breadcrumbNames = {
    'home': 'Home',
    'key-outputs': 'Research & Publications',
    'pathway-explorer': 'Recycling Solutions',
    'data-visualisation': 'Analysis Tools',
    'compare': 'Compare Options',
    'mcda': 'Decision Tool',
    'manual': 'User Guide',
    'outputs': 'Publications'
  };

  // Use custom items if provided, otherwise generate from current path
  let breadcrumbItems = [];
  
  if (customItems) {
    breadcrumbItems = customItems;
  } else {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    // Don't show breadcrumb on home page
    if (pathnames.length === 0 || pathnames[0] === 'home') {
      return null;
    }

    breadcrumbItems = [
      { path: '/home', label: 'Home' },
      ...pathnames.map((pathname, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = breadcrumbNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
        return { path, label };
      })
    ];
  }

  if (breadcrumbItems.length <= 1) return null;

  return (
    <div style={{
      background: '#f8fafc',
      padding: '12px 0',
      fontSize: '14px',
      color: '#666',
      borderBottom: '1px solid #e2e8f0',
      fontFamily: "'FiraGO', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <React.Fragment key={item.path}>
              {index > 0 && (
                <span style={{ 
                  margin: '0 8px', 
                  color: '#ccc',
                  fontSize: '12px'
                }}>
                  /
                </span>
              )}
              {isLast ? (
                <span style={{ 
                  color: '#003C69', 
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  style={{ 
                    color: '#006087', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#003C69';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#006087';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;