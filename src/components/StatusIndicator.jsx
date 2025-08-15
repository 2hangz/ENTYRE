import React from 'react';

const StatusIndicator = ({ status, showTooltip = true }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'verified':
        return {
          color: '#0A6836',
          bgColor: 'rgba(10, 104, 54, 0.1)',
          label: 'Verified',
          description: 'This pathway has been validated through research and real-world applications.'
        };
      case 'researching':
        return {
          color: '#ED9A22',
          bgColor: 'rgba(237, 154, 34, 0.1)',
          label: 'Research Stage',
          description: 'This pathway is currently under active research and development.'
        };
      default:
        return {
          color: '#888',
          bgColor: 'rgba(136, 136, 136, 0.1)',
          label: 'Under Review',
          description: 'This pathway status is being evaluated.'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const indicatorStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '6px',
    backgroundColor: config.bgColor,
    color: config.color,
    fontWeight: '600',
    fontSize: '14px',
    fontFamily: "'FiraGO', sans-serif",
    border: `1px solid ${config.color}30`,
    cursor: showTooltip ? 'help' : 'default',
    position: 'relative'
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    padding: '8px 12px',
    backgroundColor: '#003C69',
    color: 'white',
    borderRadius: '6px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    width: '200px',
    whiteSpace: 'normal',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0, 60, 105, 0.2)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.2s, visibility 0.2s'
  };

  const [showTooltipState, setShowTooltipState] = React.useState(false);

  return (
    <span 
      style={indicatorStyle}
      onMouseEnter={() => showTooltip && setShowTooltipState(true)}
      onMouseLeave={() => showTooltip && setShowTooltipState(false)}
      title={showTooltip ? config.description : undefined}
    >
      <span style={{ fontSize: '12px' }}>{config.icon}</span>
      <span>{config.label}</span>
      {showTooltip && (
        <span 
          style={{
            ...tooltipStyle,
            opacity: showTooltipState ? 1 : 0,
            visibility: showTooltipState ? 'visible' : 'hidden'
          }}
        >
          {config.description}
        </span>
      )}
    </span>
  );
};

export default StatusIndicator;