import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';
import styles from '../styles/App.module.css';
import RadarChart from '../components/RadarChart';
import McdaTool from '../components/mcdaTool';

const tabList = [
  { label: <h2>Compare Pathways</h2>, key: "compare" },
  { label: <h2>MCDA Tool</h2>, key: "mcda" }
];

const DataVisualisation = () => {
  const [activeTab, setActiveTab] = useState("compare");

  return (
    <div className={styles.intro_wrapper}>
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
            <RadarChart />
          </div>
        )}
        {activeTab === "mcda" && (
          <div>
            <McdaTool />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualisation;