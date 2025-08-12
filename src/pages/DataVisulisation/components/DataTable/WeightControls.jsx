import React from 'react';
import styles from '../style/MCDA.module.css';

const WeightControls = ({
  projectNames,
  weights,
  weightInputValues,
  lockedWeights,
  onWeightInputChange,
  onWeightInputBlur,
  onWeightSliderChange,
  onToggleWeightLock,
  onResetWeights
}) => {
  // Defensive: ensure weights and other objects are always defined
  const safeWeights = weights && typeof weights === 'object' ? weights : {};
  const safeWeightInputValues = weightInputValues && typeof weightInputValues === 'object' ? weightInputValues : {};
  const safeLockedWeights = lockedWeights && typeof lockedWeights === 'object' ? lockedWeights : {};
  const safeProjectNames = Array.isArray(projectNames) ? projectNames : [];

  const totalWeight = Object.values(safeWeights).reduce((sum, weight) => sum + weight, 0);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Project Weights</h4>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Weight: <span className="font-semibold">{totalWeight.toFixed(2)}</span>
          </span>
          <button
            onClick={onResetWeights}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            Reset Weights
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeProjectNames.map(projectName => {
          const weight = safeWeights[projectName] || 0;
          const inputValue = safeWeightInputValues[projectName] !== undefined ? safeWeightInputValues[projectName] : '0';
          const isLocked = !!safeLockedWeights[projectName];
          const percentage = totalWeight > 0 ? (weight / totalWeight * 100).toFixed(1) : '0.0';
          
          return (
            <div key={projectName} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-sm font-medium text-gray-800 truncate">{projectName}</h5>
                <button
                  onClick={() => onToggleWeightLock && onToggleWeightLock(projectName)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                    isLocked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={isLocked ? 'Unlock Weight' : 'Lock Weight'}
                >
                  {isLocked ? '🔒' : '🔓'}
                </button>
              </div>
              
              <div className="space-y-2">
                {/* Weight Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={weight}
                    onChange={(e) => onWeightSliderChange && onWeightSliderChange(projectName, parseFloat(e.target.value))}
                    disabled={isLocked}
                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                      isLocked ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(weight / 10) * 100}%, #e5e7eb ${(weight / 10) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>
                
                {/* Weight Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => onWeightInputChange && onWeightInputChange(projectName, e.target.value)}
                    onBlur={() => onWeightInputBlur && onWeightInputBlur(projectName)}
                    disabled={isLocked}
                    className={`flex-1 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      isLocked ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    step="0.1"
                    min="0"
                    max="10"
                  />
                  <span className="text-xs text-gray-500 w-12 text-center">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Weight Distribution Visualization */}
      {totalWeight > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-medium text-gray-800 mb-3">Weight Distribution</h5>
          <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
            {safeProjectNames.map(projectName => {
              const weight = safeWeights[projectName] || 0;
              const percentage = (weight / totalWeight * 100);
              const colors = [
                'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
              ];
              const colorIndex = safeProjectNames.indexOf(projectName) % colors.length;
              
              return (
                <div
                  key={projectName}
                  className={`${colors[colorIndex]} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                  title={`${projectName}: ${percentage.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightControls;
