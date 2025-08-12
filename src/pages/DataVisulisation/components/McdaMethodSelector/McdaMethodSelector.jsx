import React from 'react';
import styles from '../style/MCDA.module.css';

const methodOptions = [
  {
    value: 'weighted_sum',
    label: 'Weighted Sum',
    description: 'Simple weighted average method',
  },
  {
    value: 'cp',
    label: 'CP (Compromise Programming)',
    description: 'Distance-based compromise method',
  },
  {
    value: 'topsis',
    label: 'TOPSIS',
    description: 'Technique for Order Preference',
  },
];

const getMethodDescription = (method) => {
  switch (method) {
    case 'weighted_sum':
      return "Simple linear combination of criteria values weighted by their importance. Higher scores indicate better alternatives.";
    case 'cp':
      return "Minimizes the distance to the ideal solution (100) while maximizing the distance to the negative ideal solution (0). Lower scores indicate better alternatives.";
    case 'topsis':
      return "Technique for Order Preference by Similarity to an Ideal Solution. Ranks alternatives based on their relative closeness to the ideal (100) and negative ideal (0) solutions. Higher scores indicate better alternatives.";
    default:
      return "";
  }
};

const McdaMethodSelector = ({
  mcdaMethod,
  onMethodChange,
  cpP,
  onCpPChange,
  topsisIdealType,
  onTopsisIdealTypeChange
}) => {
  const currentOption = methodOptions.find(opt => opt.value === mcdaMethod);

  return (
    <div className={`${styles.mcdaMethodSelectorWrapper} bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row`}>
      {/* Sidebar for method selection */}
      <div className="md:w-1/3 w-full bg-gradient-to-b md:bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-6 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          MCDA Method Selection
        </h3>
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-white mb-3" htmlFor="mcda-method-select">
            Choose MCDA Method:
          </label>
          <select
            id="mcda-method-select"
            className="p-3 rounded-lg border-2 border-white bg-white bg-opacity-90 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            value={mcdaMethod}
            onChange={e => onMethodChange(e.target.value)}
          >
            {methodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="mt-4">
            <div className="text-white text-sm">
              {currentOption?.description}
            </div>
          </div>
        </div>
      </div>
      {/* Main content area */}
      <div className="md:w-2/3 w-full p-6 space-y-6 flex flex-col justify-center">
        {/* CP Parameters */}
        {mcdaMethod === 'cp' && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CP Parameter (p):
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={cpP}
                onChange={(e) => onCpPChange(parseInt(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-medium text-blue-600 w-12 text-center">
                p = {cpP}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Higher p values give more weight to larger deviations from ideal solutions.
            </p>
          </div>
        )}

        {/* TOPSIS Parameters */}
        {mcdaMethod === 'topsis' && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              TOPSIS Ideal Type:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="benefit"
                  checked={topsisIdealType === 'benefit'}
                  onChange={(e) => onTopsisIdealTypeChange(e.target.value)}
                  className="mr-2 text-green-600"
                />
                <span className="text-sm">Benefit Criteria (Higher is better)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cost"
                  checked={topsisIdealType === 'cost'}
                  onChange={(e) => onTopsisIdealTypeChange(e.target.value)}
                  className="mr-2 text-green-600"
                />
                <span className="text-sm">Cost Criteria (Lower is better)</span>
              </label>
            </div>
          </div>
        )}

        {/* Method Description */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Method Description:</h4>
          <p className="text-sm text-gray-600">
            {getMethodDescription(mcdaMethod)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default McdaMethodSelector;
