import React from 'react';
import WeightControls from './WeightControls';
import styles from '../style/MCDA.module.css';

const DataTable = ({
  classData,
  projectNames,
  weights,
  tempSliderValues,
  inputValues,
  lockedValues,
  lockedWeights,
  weightInputValues,
  sliderMaxMap,
  sliderMinMap,
  onWeightInputChange,
  onWeightInputBlur,
  onWeightSliderChange,
  onToggleWeightLock,
  onResetWeights,
  onToggleLock,
  onSliderChange,
  onInputChange,
  onInputBlur,
  onSliderChangeEnd,
  onReset
}) => {
  // Defensive: ensure arrays are always defined to prevent .map errors
  const safeClassData = Array.isArray(classData) ? classData : [];
  const safeProjectNames = Array.isArray(projectNames) ? projectNames : [];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            Interactive Data Table
          </h3>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
          >
            Reset All
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Weight Controls */}
        <WeightControls
          projectNames={safeProjectNames}
          weights={weights}
          weightInputValues={weightInputValues}
          lockedWeights={lockedWeights}
          onWeightInputChange={onWeightInputChange}
          onWeightInputBlur={onWeightInputBlur}
          onWeightSliderChange={onWeightSliderChange}
          onToggleWeightLock={onToggleWeightLock}
          onResetWeights={onResetWeights}
        />

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Class / Project
                </th>
                {safeProjectNames.map(projectName => (
                  <th key={projectName} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    {projectName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {safeClassData.map(classItem => (
                <React.Fragment key={classItem?.name || Math.random()}>
                  <tr className="bg-blue-50">
                    <td colSpan={safeProjectNames.length + 1} className="px-4 py-2 text-sm font-semibold text-blue-800">
                      {classItem?.name}
                    </td>
                  </tr>
                  {(Array.isArray(classItem?.projects) ? classItem.projects : []).map(project => (
                    <tr key={`${classItem?.name || ''}-${project?.name || Math.random()}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">
                        {project?.name}
                      </td>
                      {safeProjectNames.map(projectName => {
                        const key = `${classItem?.name || ''}-${project?.name || ''}`;
                        const isLocked = lockedValues?.[key];
                        const currentValue = (tempSliderValues && tempSliderValues[key] !== undefined)
                          ? tempSliderValues[key]
                          : (project?.value && project.value[projectName] !== undefined)
                            ? project.value[projectName]
                            : 0;
                        const inputValue = (inputValues && inputValues[key] !== undefined)
                          ? inputValues[key]
                          : currentValue.toString();
                        const min = sliderMinMap?.[projectName] !== undefined ? sliderMinMap[projectName] : 0;
                        const max = sliderMaxMap?.[projectName] !== undefined ? sliderMaxMap[projectName] : 100;
                        
                        return (
                          <td key={projectName} className="px-4 py-3 text-center border-b border-gray-200">
                            <div className="flex flex-col items-center space-y-2">
                              {/* Lock Button */}
                              <button
                                onClick={() => onToggleLock && onToggleLock(classItem?.name, project?.name)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                                  isLocked 
                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                                title={isLocked ? 'Unlock' : 'Lock'}
                              >
                                {isLocked ? '🔒' : '🔓'}
                              </button>
                              
                              {/* Slider */}
                              <input
                                type="range"
                                min={min}
                                max={max}
                                step="0.1"
                                value={currentValue}
                                onChange={(e) => onSliderChange && onSliderChange(classItem?.name, project?.name, parseFloat(e.target.value))}
                                onMouseUp={() => onSliderChangeEnd && onSliderChangeEnd(classItem?.name, project?.name)}
                                onTouchEnd={() => onSliderChangeEnd && onSliderChangeEnd(classItem?.name, project?.name)}
                                disabled={isLocked}
                                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                                  isLocked ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((currentValue - min) / (max - min)) * 100}%, #e5e7eb ${((currentValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`
                                }}
                              />
                              
                              {/* Input Field */}
                              <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => onInputChange && onInputChange(classItem?.name, project?.name, e.target.value)}
                                onBlur={() => onInputBlur && onInputBlur(classItem?.name, project?.name)}
                                disabled={isLocked}
                                className={`w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  isLocked ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                step="0.1"
                                min={min}
                                max={max}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
