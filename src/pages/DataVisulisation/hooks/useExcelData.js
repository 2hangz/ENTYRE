import { useState, useEffect, useRef } from 'react';

export const useExcelData = () => {
  // Data state
  const [classData, setClassData] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [weights, setWeights] = useState({});
  const [initialWeights, setInitialWeights] = useState({});
  const [sliderMaxMap, setSliderMaxMap] = useState({});
  const [sliderMinMap, setSliderMinMap] = useState({});
  const [initialClassData, setInitialClassData] = useState([]);
  const [tempSliderValues, setTempSliderValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [lockedValues, setLockedValues] = useState({});
  const [lockedWeights, setLockedWeights] = useState({});
  const [weightInputValues, setWeightInputValues] = useState({});
  // File management
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const debounceTimerRef = useRef(null);

  // For compatibility with mcdaTool.jsx, export "data" (alias for classData)
  const [data, setData] = useState(undefined);

  const API_BASE = 'https://entyre-backend.onrender.com';

  // Fetch file list
  const fetchFileList = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/files`);
      if (response.ok) {
        const files = await response.json();
        setAvailableFiles(files);
        // Auto-select the first file (only on first load)
        if (files.length > 0 && !selectedFile) {
          setSelectedFile(files[0]);
        }
      }
    } catch (error) {
      // Optionally handle error
    }
  };

  // Load Excel data
  const loadExcelData = async (fileName) => {
    if (!fileName) {
      return;
    }
    try {
      // Use /api/file?file=xxx
      const url = `${API_BASE}/api/file?file=${encodeURIComponent(fileName)}`;
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error('Failed to load Excel file');
      }
      const dataObj = await response.json();

      // Process data
      const processedData = processExcelData(dataObj);

      // Update state
      setClassData(processedData.classData);
      setProjectNames(processedData.projectNames);
      setWeights(processedData.weights);
      setInitialWeights(processedData.weights);
      setSliderMaxMap(processedData.sliderMaxMap);
      setSliderMinMap(processedData.sliderMinMap);
      setInitialClassData(processedData.classData);

      // For mcdaTool.jsx compatibility
      setData(processedData.classData);

      // Initialize input/slider/weight input values
      const initialInputValues = {};
      const initialTempSliderValues = {};
      const initialWeightInputValues = {};

      processedData.projectNames.forEach(projectName => {
        initialWeightInputValues[projectName] = processedData.weights[projectName]?.toString() || '0';
      });

      processedData.classData.forEach(classItem => {
        classItem.projects.forEach(project => {
          // project.value may be an object (criteria with sub-items)
          if (typeof project.value === 'object' && project.value !== null) {
            Object.entries(project.value).forEach(([projName, val]) => {
              const key = `${classItem.name}-${project.name}-${projName}`;
              initialInputValues[key] = val.toString();
              initialTempSliderValues[key] = val;
            });
          } else {
            const key = `${classItem.name}-${project.name}`;
            initialInputValues[key] = project.value.toString();
            initialTempSliderValues[key] = project.value;
          }
        });
      });

      setInputValues(initialInputValues);
      setTempSliderValues(initialTempSliderValues);
      setWeightInputValues(initialWeightInputValues);

    } catch (error) {
      setData(undefined);
      setClassData([]);
    }
  };

  // Process Excel data
  const processExcelData = (data) => {
    const classData = [];
    const projectNames = new Set();
    const weights = {};
    const sliderMaxMap = {};
    const sliderMinMap = {};

    Object.entries(data).forEach(([className, sheetData]) => {
      if (Array.isArray(sheetData) && sheetData.length > 0) {
        const projects = [];
        sheetData.forEach((row, index) => {
          if (index === 0) {
            // First row: project names and weights
            Object.entries(row).forEach(([key, value]) => {
              if (key !== 'Criteria' && key !== 'Class') {
                projectNames.add(key);
                const weight = parseFloat(value) || 0;
                weights[key] = weight;
              }
            });
          } else {
            // Other rows: criteria and values
            const criteria = row['Criteria'] || row['Class'] || `Criteria ${index}`;
            const projectValues = {};
            Object.entries(row).forEach(([key, value]) => {
              if (key !== 'Criteria' && key !== 'Class') {
                const numValue = parseFloat(value) || 0;
                projectValues[key] = numValue;
                // Update slider max/min
                if (
                  typeof sliderMaxMap[key] === 'undefined' ||
                  numValue > sliderMaxMap[key]
                ) {
                  sliderMaxMap[key] = numValue;
                }
                if (
                  typeof sliderMinMap[key] === 'undefined' ||
                  numValue < sliderMinMap[key]
                ) {
                  sliderMinMap[key] = numValue;
                }
              }
            });
            projects.push({
              name: criteria,
              value: projectValues,
              originalValue: { ...projectValues }
            });
          }
        });
        classData.push({
          name: className,
          projects: projects
        });
      }
    });

    return {
      classData,
      projectNames: Array.from(projectNames),
      weights,
      sliderMaxMap,
      sliderMinMap
    };
  };

  // Initialize
  useEffect(() => {
    fetchFileList();
  }, []);

  // Watch selectedFile and auto-load data
  useEffect(() => {
    if (selectedFile) {
      loadExcelData(selectedFile);
    } else {
      setData(undefined);
      setClassData([]);
    }
    // eslint-disable-next-line
  }, [selectedFile]);

  // Export
  return {
    // Data state
    classData,
    projectNames,
    weights,
    initialWeights,
    sliderMaxMap,
    sliderMinMap,
    initialClassData,
    tempSliderValues,
    inputValues,
    lockedValues,
    lockedWeights,
    weightInputValues,
    // File state
    availableFiles,
    selectedFile,
    // For mcdaTool.jsx compatibility
    data,
    // Actions
    setSelectedFile,
    setWeights,
    setTempSliderValues,
    setInputValues,
    setLockedValues,
    setLockedWeights,
    setWeightInputValues,
    fetchFileList,
    loadExcelData,
    // Utilities
    debounceTimerRef
  };
};
