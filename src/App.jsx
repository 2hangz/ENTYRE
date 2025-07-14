// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styles from './styles/App.module.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page views
import Home from './pages/Home';
import About from './pages/About';
import KeyOutputs from './pages/KeyOutputs';
import PathwayExplorer from './pages/PathwayExplorer';
import DataVisualisation from './pages/DataVisualisation';

export default function App() {
  return (
    <Router>
      <div className={styles.appWrapper}>
        <Navbar />

        <main className={styles.mainContent}>
          <div className={styles.pageContainer}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/key-outputs" element={<KeyOutputs />} />
              <Route path="/pathway-explorer" element={<PathwayExplorer />} />
              <Route path="/data-visualisation" element={<DataVisualisation />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}