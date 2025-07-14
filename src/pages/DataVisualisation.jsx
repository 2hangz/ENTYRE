import React, { useState } from 'react';
import styles from '../styles/App.module.css';

const tabList = [
  { label: <h2>Compare pathways</h2>, key: "compare" },
  { label: <h2>MCDA Tool</h2>, key: "mcda" }
];

const DataVisualisation = () => {
  const [activeTab, setActiveTab] = useState("compare");

  return (
    <div className={styles.intro_wrapper}>
      {/* <h1>Data Visualisation</h1> */}
      <div className={styles.tabBar}>
        {tabList.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${styles.tabButton} ${activeTab === tab.key ? styles.activeTabButton : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "compare" && (
          <div>
            {/* Content for Compare pathways */}
            <p>Compare pathways visualisation will appear here.</p>
          </div>
        )}
        {activeTab === "mcda" && (
          <div>
            {/* Content for MCDA Tool */}
            <p>MCDA Tool visualisation will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualisation;