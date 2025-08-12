import React, { useState, useEffect } from 'react';
import FileSelector from './FileSelector/FileSelector';
import McdaMethodSelector from './McdaMethodSelector/McdaMethodSelector';
import WeightControls from './DataTable/WeightControls';
import ImageModal from './AnalysisImages/ImageModal';
import DataTable from './DataTable/DataTable';
import ClassChart from './Charts/ClassChart';
import ImageGallery from './AnalysisImages/ImageGallery';
import { useExcelData } from '../hooks/useExcelData';
import { recalculateRanks, calculateParetoDominance } from '../utils/mcdaCalculations';
import styles from './style/MCDA.module.css';

function McdaTool() {
  const excelData = useExcelData();

  const [mcdaMethod, setMcdaMethod] = useState('weighted_sum');
  const [cpP, setCpP] = useState(2);
  const [topsisIdealType, setTopsisIdealType] = useState('benefit');

  const [chartType, setChartType] = useState('bar');
  const [imageType, setImageType] = useState('scatter');
  const [isRunningScripts, setIsRunningScripts] = useState(false);
  const [scriptStatus, setScriptStatus] = useState('');
  const baseApi = 'https://entyre-backend.onrender.com';

  useEffect(() => {
    checkAndGenerateImages();
    // eslint-disable-next-line
  }, []);

  const checkAndGenerateImages = async () => {
    try {
      const imageResponse = await fetch(`${baseApi}/api/check-images`);
      if (!imageResponse.ok) {
        return;
      }
      const imageResult = await imageResponse.json();
      if (!imageResult.hasFiles) {
        setIsRunningScripts(true);
        setScriptStatus('Checking image folder...');
        // Run Scatter.py
        setScriptStatus('Running Scatter.py...');
        try {
          const scatterResponse = await fetch(`${baseApi}/api/run-script?script=Scatter.py`);
          if (scatterResponse.ok) {
            const result = await scatterResponse.json();
            if (result.success) {
              setScriptStatus('Scatter.py completed successfully');
            } else {
              setScriptStatus('Scatter.py failed');
            }
          } else {
            setScriptStatus('Scatter.py failed');
          }
        } catch (error) {
          setScriptStatus('Scatter.py error');
        }
        // Run Tornado.py
        setScriptStatus('Running Tornado.py...');
        try {
          const tornadoResponse = await fetch(`${baseApi}/api/run-script?script=Tornado.py`);
          if (tornadoResponse.ok) {
            const result = await tornadoResponse.json();
            if (result.success) {
              setScriptStatus('Tornado.py completed successfully');
            } else {
              setScriptStatus('Tornado.py failed');
            }
          } else {
            setScriptStatus('Tornado.py failed');
          }
        } catch (error) {
          setScriptStatus('Tornado.py error');
        }
        setIsRunningScripts(false);
      }
    } catch (error) {
      setIsRunningScripts(false);
    }
  };

  const handleWeightInputChange = (projectName, value) => {
    if (excelData.setWeightInputValues) {
      excelData.setWeightInputValues(prev => ({
        ...prev,
        [projectName]: value
      }));
    }
  };

  const handleWeightInputBlur = (projectName) => {};

  const handleWeightSliderChange = (projectName, value) => {
    if (excelData.setWeightInputValues) {
      excelData.setWeightInputValues(prev => ({
        ...prev,
        [projectName]: value
      }));
    }
  };

  const handleToggleWeightLock = (projectName) => {
    if (excelData.setLockedWeights) {
      excelData.setLockedWeights(prev => ({
        ...prev,
        [projectName]: !prev[projectName]
      }));
    }
  };

  const handleResetWeights = () => {
    if (excelData.resetWeights) {
      excelData.resetWeights();
    }
  };

  const handleToggleLock = (className, projectName) => {
    if (excelData.setLockedValues) {
      excelData.setLockedValues(prev => ({
        ...prev,
        [className]: {
          ...prev[className],
          [projectName]: !prev[className]?.[projectName]
        }
      }));
    }
  };

  const handleSliderChange = (className, projectName, newValue) => {
    if (excelData.setInputValues) {
      excelData.setInputValues(prev => ({
        ...prev,
        [className]: {
          ...prev[className],
          [projectName]: newValue
        }
      }));
    }
  };

  const handleInputChange = (className, projectName, value) => {
    if (excelData.setInputValues) {
      excelData.setInputValues(prev => ({
        ...prev,
        [className]: {
          ...prev[className],
          [projectName]: value
        }
      }));
    }
  };

  const handleInputBlur = (className, projectName) => {};

  const handleSliderChangeEnd = (className, projectName) => {};

  const handleReset = () => {
    if (excelData.resetInputValues) {
      excelData.resetInputValues();
    }
  };

  const handleMethodChange = (method) => {
    setMcdaMethod(method);
  };

  const handleCpPChange = (value) => {
    setCpP(value);
  };

  const handleTopsisIdealTypeChange = (type) => {
    setTopsisIdealType(type);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleImageTypeChange = (type) => {
    setImageType(type);
  };

  const ranks = recalculateRanks(excelData.data, mcdaMethod, cpP, topsisIdealType);
  const paretoDominance = calculateParetoDominance(excelData.data);

  const fileListLoaded = Array.isArray(excelData.availableFiles) && excelData.availableFiles.length > 0;

  if (!fileListLoaded) {
    return (
      <div className={styles.mcdaToolContainer}>
        <div className={styles.mcdaHeader}>
          <h1>MCDA Interactive Data Visualization Tool</h1>
          <p>Multi-Criteria Decision Analysis Tool for ELT Processing Pathways</p>
        </div>
        <div className={styles.mcdaContent}>
          <div className={styles.mcdaLeftPanel}></div>
          <div className={styles.mcdaRightPanel}></div>
        </div>
      </div>
    );
  }

  if (!excelData.selectedFile) {
    return (
      <div className={styles.mcdaToolContainer}>
        <div className={styles.mcdaHeader}>
          <h1>MCDA Interactive Data Visualization Tool</h1>
          <p>Multi-Criteria Decision Analysis Tool for ELT Processing Pathways</p>
        </div>
        <div className={styles.mcdaContent}>
          <div className={styles.mcdaLeftPanel}>
            <FileSelector 
              onFileSelect={excelData.setSelectedFile}
              selectedFile={excelData.selectedFile}
              availableFiles={excelData.availableFiles}
            />
            <McdaMethodSelector
              method={mcdaMethod}
              onMethodChange={handleMethodChange}
              cpP={cpP}
              onCpPChange={handleCpPChange}
              topsisIdealType={topsisIdealType}
              onTopsisIdealTypeChange={handleTopsisIdealTypeChange}
            />
          </div>
          <div className={styles.mcdaRightPanel}></div>
        </div>
      </div>
    );
  }

  if (!excelData.data) {
    return (
      <div className={styles.mcdaToolContainer}>
        <div className={styles.mcdaHeader}>
          <h1>MCDA Interactive Data Visualization Tool</h1>
          <p>Multi-Criteria Decision Analysis Tool for ELT Processing Pathways</p>
        </div>
        <div className={styles.mcdaContent}>
          <div className={styles.mcdaLeftPanel}>
            <FileSelector 
              onFileSelect={excelData.setSelectedFile}
              selectedFile={excelData.selectedFile}
              availableFiles={excelData.availableFiles}
            />
            <McdaMethodSelector
              method={mcdaMethod}
              onMethodChange={handleMethodChange}
              cpP={cpP}
              onCpPChange={handleCpPChange}
              topsisIdealType={topsisIdealType}
              onTopsisIdealTypeChange={handleTopsisIdealTypeChange}
            />
          </div>
          <div className={styles.mcdaRightPanel}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mcdaToolContainer}>
      <div className={styles.mcdaHeader}>
        <h1>MCDA Interactive Data Visualization Tool</h1>
        <p>Multi-Criteria Decision Analysis Tool for ELT Processing Pathways</p>
      </div>

      {isRunningScripts && (
        <div className={styles.scriptStatus}>
          <p>{scriptStatus}</p>
        </div>
      )}

      <div className={styles.mcdaContent}>
        <div className={styles.mcdaLeftPanel}>
          <FileSelector 
            onFileSelect={excelData.setSelectedFile}
            selectedFile={excelData.selectedFile}
            availableFiles={excelData.availableFiles}
          />
          
          <McdaMethodSelector
            method={mcdaMethod}
            onMethodChange={handleMethodChange}
            cpP={cpP}
            onCpPChange={handleCpPChange}
            topsisIdealType={topsisIdealType}
            onTopsisIdealTypeChange={handleTopsisIdealTypeChange}
          />

          <WeightControls
            weightInputValues={excelData.weightInputValues}
            weightLocks={excelData.lockedWeights}
            onWeightInputChange={handleWeightInputChange}
            onWeightInputBlur={handleWeightInputBlur}
            onWeightSliderChange={handleWeightSliderChange}
            onToggleWeightLock={handleToggleWeightLock}
            onResetWeights={handleResetWeights}
            data={excelData.data}
          />

          <DataTable
            data={excelData.data}
            ranks={ranks}
            paretoDominance={paretoDominance}
            weightInputValues={excelData.weightInputValues}
            weightLocks={excelData.lockedWeights}
            inputValues={excelData.inputValues}
            locks={excelData.lockedValues}
            onWeightInputChange={handleWeightInputChange}
            onWeightInputBlur={handleWeightInputBlur}
            onWeightSliderChange={handleWeightSliderChange}
            onToggleWeightLock={handleToggleWeightLock}
            onResetWeights={handleResetWeights}
            onToggleLock={handleToggleLock}
            onSliderChange={handleSliderChange}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
            onSliderChangeEnd={handleSliderChangeEnd}
            onReset={handleReset}
          />
        </div>

        <div className={styles.mcdaRightPanel}>
          <ClassChart
            data={excelData.data}
            ranks={ranks}
            chartType={chartType}
            onChartTypeChange={handleChartTypeChange}
          />
          
          <ImageGallery
            imageType={imageType}
            onImageTypeChange={handleImageTypeChange}
            selectedFile={excelData.selectedFile}
          />
        </div>
      </div>
    </div>
  );
}

export default McdaTool;
