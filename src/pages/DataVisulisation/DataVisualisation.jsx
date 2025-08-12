import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import RadarChart from './components/comparePathways';
import McdaTool from './components/mcdaTool';
import McdaUserManual from './components/mcdaUserManual';
import styles from '../../styles/App.module.css';

const tabs = [
  { label: 'User Guide', key: 'manual', path: 'manual' },
  { label: 'Compare Pathways', key: 'compare', path: 'compare' },
  { label: 'MCDA Tool', key: 'mcda', path: 'mcda' },
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

  const ButtonStyle = {
    padding: '10px 28px',
    margin: '0 10px',
    border: 'none',
    borderRadius: '24px',
    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '17px',
    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, color 0.2s, transform 0.1s',
    outline: 'none',
    position: 'relative',
    zIndex: 1,
  };

  const beautifiedActiveStyle = {
    background: 'linear-gradient(90deg, #1565c0 0%, #64b5f6 100%)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)',
    transform: 'scale(1.06)',
  };

  return (
    <div className={styles.intro_wrapper}>
      <div className={styles.tabWrapper} style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
        {tabs.map(({ label, key }) => (
          <button
            key={key}
            className={`${styles.tab} ${styles.tabButton}`}
            style={{
              ...ButtonStyle,
              ...(currentTab === key ? beautifiedActiveStyle : {}),
            }}
            onClick={() => handleTabClick(key)}
            type="button"
          >
            {label}
            {currentTab === key && (
              <span
                style={{
                  display: 'block',
                  position: 'absolute',
                  left: '50%',
                  bottom: '-8px',
                  transform: 'translateX(-50%)',
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.12)',
                  zIndex: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>
      <div>
        <Routes>
          <Route index element={<Navigate to="/data-visualisation/manual" replace />} />
          <Route path="manual" element={<McdaUserManual />} />
          <Route path="compare" element={<RadarChart />} />
          <Route path="mcda" element={<McdaTool />} />
          <Route path="*" element={<Navigate to="/data-visualisation/compare" replace />} />
        </Routes>
      </div>
    </div>
  );
}