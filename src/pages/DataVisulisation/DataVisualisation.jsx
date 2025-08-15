import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import RadarChart from './components/comparePathways';
import McdaTool from './components/mcdaTool';
import McdaUserManual from './components/mcdaUserManual';
import styles from '../../styles/App.module.css';

const tabs = [
  { label: 'User Guide', key: 'manual', path: 'manual'},
  { label: 'Compare Pathways', key: 'compare', path: 'compare'},
  { label: 'MCDA Tool', key: 'mcda', path: 'mcda'},
];

export default function DataVisualisation() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = tabs.find(tab => location.pathname.endsWith(tab.path))?.key || 'manual';

  const handleTabClick = (key) => {
    const tab = tabs.find(t => t.key === key);
    if (tab) {
      navigate(`/data-visualisation/${tab.path}`);
    }
  };

  return (
    <div className={styles.intro_wrapper}>
      {/* Page header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontFamily: "'Merriweather', Georgia, serif",
          color: '#003C69', // UCC Crest Blue
          fontSize: '2.2rem',
          marginBottom: '12px'
        }}>
          Data Visualisation & Analysis
        </h1>
        <p style={{ 
          fontFamily: "'FiraGO', sans-serif",
          color: '#666',
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Explore comprehensive analysis tools and pathway comparisons for End-of-Life Tyre valorisation research.
        </p>
      </div>

      {/* Tab navigation with UCC styling */}
      <div style={{ 
        marginBottom: '32px', 
        display: 'flex', 
        justifyContent: 'center',
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0, 60, 105, 0.06)',
        border: '1px solid #D1D3D4'
      }}>
        {tabs.map(({ label, key, icon }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            type="button"
            style={{
              background: currentTab === key ? '#003C69' : 'transparent', // UCC Crest Blue for active
              color: currentTab === key ? '#ffffff' : '#003C69',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 24px',
              margin: '0 4px',
              fontFamily: "'FiraGO', sans-serif",
              fontWeight: currentTab === key ? '700' : '500',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
              minWidth: '140px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (currentTab !== key) {
                e.target.style.background = 'rgba(0, 60, 105, 0.05)';
                e.target.style.color = '#006087'; // UCC Lee Blue
              } else {
                e.target.style.background = '#006087'; // Darker blue on hover for active
              }
            }}
            onMouseLeave={(e) => {
              if (currentTab !== key) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#003C69';
              } else {
                e.target.style.background = '#003C69';
                e.target.style.color = '#ffffff';
              }
            }}
            aria-selected={currentTab === key}
            aria-label={`Switch to ${label} tab`}
          >
            <span style={{ fontSize: '14px' }}>{icon}</span>
            <span>{label}</span>
            {currentTab === key && (
              <span style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #003C69'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Content area with subtle styling */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 60, 105, 0.06)',
        border: '1px solid #D1D3D4',
        overflow: 'hidden'
      }}>
        <Routes>
          <Route index element={<Navigate to="/data-visualisation/manual" replace />} />
          <Route path="manual" element={<McdaUserManual />} />
          <Route path="compare" element={<RadarChart />} />
          <Route path="mcda" element={<McdaTool />} />
          <Route path="*" element={<Navigate to="/data-visualisation/compare" replace />} />
        </Routes>
      </div>

      {/* Additional info section */}
      <div style={{
        marginTop: '32px',
        background: '#f8fafc',
        borderRadius: '8px',
        padding: '20px',
        borderLeft: '4px solid #49C0B6', // UCC Honan Teal
        fontFamily: "'FiraGO', sans-serif"
      }}>
        <h3 style={{ 
          color: '#003C69',
          marginTop: '0',
          marginBottom: '12px',
          fontFamily: "'Merriweather', Georgia, serif"
        }}>
          About These Tools
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          color: '#333'
        }}>
          <div>
            <strong style={{ color: '#003C69' }}>User Guide:</strong> Step-by-step instructions for using the Multi-Criteria Decision Analysis (MCDA) tools and understanding the comparison methodology.
          </div>
          <div>
            <strong style={{ color: '#003C69' }}>Compare Pathways:</strong> Interactive charts and rankings comparing different End-of-Life Tyre valorisation pathways based on multiple criteria and scenarios.
          </div>
          <div>
            <strong style={{ color: '#003C69' }}>MCDA Tool:</strong> Advanced analysis platform for customizing weights, adjusting parameters, and performing detailed multi-criteria evaluations.
          </div>
        </div>
      </div>
    </div>
  );
}