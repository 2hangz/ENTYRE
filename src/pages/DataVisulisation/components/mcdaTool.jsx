import React, { useState, useEffect } from 'react';
import FileSelector from './FileSelector/FileSelector';
import McdaMethodSelector from './McdaMethodSelector/McdaMethodSelector';
import WeightControls from './DataTable/WeightControls';
import DataTable from './DataTable/DataTable';
import ClassChart from './Charts/ClassChart';
import ImageGallery from './AnalysisImages/ImageGallery';
import { useExcelData } from '../hooks/useExcelData';
import { recalculateRanks, calculateParetoDominance } from '../utils/mcdaCalculations';
import styles from './style/MCDA.module.css';

/**
 * 说明：
 * 1. 如果 WeightControls 组件没有显示 weight，通常是 data 结构不对或者 weightInputValues 没有正确传递。
 * 2. 你需要确保 excelData.data 里有权重相关信息，且 weightInputValues 不是 undefined。
 * 3. 下面增加了 debug 输出，帮助你排查 weightInputValues 和 data 的结构。
 */

function McdaTool() {
  // Excel data management
  const excelData = useExcelData();

  // MCDA method state
  const [mcdaMethod, setMcdaMethod] = useState('weighted_sum');
  const [cpP, setCpP] = useState(2);
  const [topsisIdealType, setTopsisIdealType] = useState('benefit');

  // UI state
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

  // 权重相关事件
  const handleWeightInputChange = (className, value) => {
    // 注意：这里参数名是 className，实际应该是 criterionName 或 weightName
    if (excelData.setWeightInputValues) {
      excelData.setWeightInputValues(prev => ({
        ...prev,
        [className]: value
      }));
    }
  };

  const handleWeightInputBlur = (className) => {
    // 可在 useExcelData 中实现，如需失焦校正
  };

  const handleWeightSliderChange = (className, value) => {
    if (excelData.setWeightInputValues) {
      excelData.setWeightInputValues(prev => ({
        ...prev,
        [className]: value
      }));
    }
  };

  const handleToggleWeightLock = (className) => {
    if (excelData.setLockedWeights) {
      excelData.setLockedWeights(prev => ({
        ...prev,
        [className]: !prev[className]
      }));
    }
  };

  const handleResetWeights = () => {
    if (excelData.resetWeights) {
      excelData.resetWeights();
    }
  };

  // 其他输入相关事件
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

  const handleInputBlur = (className, projectName) => {
    // 可在 useExcelData 中实现，如需失焦校正
  };

  const handleSliderChangeEnd = (className, projectName) => {
    // 可在 useExcelData 中实现，如需松开滑块时处理
  };

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

  // 计算排名和帕累托优势
  const ranks = recalculateRanks(excelData.data, mcdaMethod, cpP, topsisIdealType);
  const paretoDominance = calculateParetoDominance(excelData.data);

  // 检查文件列表是否加载
  const fileListLoaded = Array.isArray(excelData.availableFiles) && excelData.availableFiles.length > 0;

  // 检查数据是否加载
  if (!fileListLoaded) {
    return (
      <div className={styles.mcdaToolContainer}>
        <div className={styles.mcdaHeader}>
          <h1>MCDA Interactive Data Visualization Tool</h1>
          <p>Multi-Criteria Decision Analysis Tool for ELT Processing Pathways</p>
        </div>
        <div className={styles.mcdaContent}>
          <div className={styles.mcdaLeftPanel}>
            <div style={{ color: 'red', marginTop: 20 }}>
              未能加载到数据文件列表。<br />
              <span style={{ color: '#888', fontSize: 14 }}>
                请检查后端接口是否可用：<br />
                <a href="https://entyre-backend.onrender.com/api/files" target="_blank" rel="noopener noreferrer">
                  https://entyre-backend.onrender.com/api/files
                </a>
                <br />
                可能原因：
                <ul style={{ color: '#888', fontSize: 13, margin: '8px 0 0 16px' }}>
                  <li>后端未启动或网络不通</li>
                  <li>接口路径错误</li>
                  <li>没有可用的Excel文件</li>
                  <li>跨域（CORS）问题</li>
                </ul>
              </span>
            </div>
          </div>
          <div className={styles.mcdaRightPanel}>
            <div style={{ color: '#888', marginTop: 40 }}>
              数据未加载，无法显示图表和图片。
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 检查是否有选中的文件
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
            <div style={{ color: 'red', marginTop: 20 }}>
              没有选中的数据文件，请先选择一个Excel文件。
            </div>
          </div>
          <div className={styles.mcdaRightPanel}>
            <div style={{ color: '#888', marginTop: 40 }}>
              数据未加载，无法显示图表和图片。
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 检查数据是否加载
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
            <div style={{ color: 'red', marginTop: 20 }}>
              已选择文件，但未能加载数据。
              <br />
              <span style={{ color: '#888', fontSize: 14 }}>
                <b>排查建议：</b>
                <ul style={{ color: '#888', fontSize: 13, margin: '8px 0 0 16px' }}>
                  <li>请检查 <b>useExcelData</b> 钩子是否在 <b>selectedFile</b> 变化时自动加载数据。</li>
                  <li>请检查 <b>FileSelector</b> 组件是否在切换文件时自动调用 <b>onFileSelect</b>。</li>
                  <li>请检查 <b>loadExcelFile</b> 是否有被调用（可在 loadExcelFile 里加 <code>console.log</code>）。</li>
                  <li>请检查后端 <code>/api/file?name=xxx</code> 是否能返回数据。</li>
                  <li>请检查 <b>useExcelData</b> 里 <b>setData/setSelectedFile</b> 的逻辑。</li>
                </ul>
                <br />
                数据获取地址: <a href="https://entyre-backend.onrender.com/api/files" target="_blank" rel="noopener noreferrer">https://entyre-backend.onrender.com/api/files</a>
                <br />
                当前 selectedFile: <b>{excelData.selectedFile}</b>
              </span>
            </div>
          </div>
          <div className={styles.mcdaRightPanel}>
            <div style={{ color: '#888', marginTop: 40 }}>
              数据未加载，无法显示图表和图片。
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DEBUG: 打印权重数据结构，帮助排查 weight 没有显示出来的原因 ---
  // eslint-disable-next-line
  console.log('weightInputValues:', excelData.weightInputValues);
  // eslint-disable-next-line
  console.log('data:', excelData.data);

  // 正常渲染所有组件
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

          {/* 
            WeightControls 组件显示权重，依赖于：
            1. data 里有权重相关的 criterion/class 信息
            2. weightInputValues 结构正确
            3. 事件参数名要和 WeightControls 组件一致
          */}
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