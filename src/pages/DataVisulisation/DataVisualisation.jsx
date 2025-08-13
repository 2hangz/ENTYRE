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

  return (
    <div className={styles.intro_wrapper}>
      <div className={styles.tabWrapper} style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
        {tabs.map(({ label, key }) => (
          <button
            key={key}
            className={`${styles.tab} ${styles.tabButton} ${currentTab === key ? 'tabButtonActive' : ''}`}
            onClick={() => handleTabClick(key)}
            type="button"
          >
            {label}
            {currentTab === key && (
              <span className="tabUnderline" />
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