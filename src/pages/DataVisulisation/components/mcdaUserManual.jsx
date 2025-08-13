import React from 'react';

// Simple flow arrow component
const Arrow = ({ direction = 'down', style = {} }) => (
  <div style={{ textAlign: 'center', ...style }}>
    {direction === 'down' && <span style={{ fontSize: 24 }}>↓</span>}
    {direction === 'right' && <span style={{ fontSize: 24, margin: '0 8px' }}>→</span>}
  </div>
);

const StepBox = ({ title, children, style = {} }) => (
  <div
    style={{
      border: '2px solid #1976d2',
      borderRadius: 8,
      padding: 16,
      margin: '0 auto',
      background: '#f5faff',
      maxWidth: 400,
      boxShadow: '0 2px 8px #e3e3e3',
      ...style,
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 18, color: '#1976d2', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 15 }}>{children}</div>
  </div>
);

const FlowRow = ({ children, style = {} }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
    {children}
  </div>
);

const McdaUserManual = () => (
  <div
    style={{
      width: '100vw',
      minWidth: '100vw',
      maxWidth: '100vw',
      margin: 0,
      padding: '2rem 0',
      background: '#fff',
      borderRadius: 0,
      fontSize: 16,
      lineHeight: 1.7,
      boxSizing: 'border-box',
      position: 'relative',
      left: '50%',
      right: '50%',
      transform: 'translateX(-50%)',
    }}
  >
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
        MCDA Multi-Criteria Decision Analysis Tool<br />User Flowchart
      </h1>

      {/* Main Flowchart */}
      <div style={{ margin: '32px 0' }}>
        <StepBox title="1. Select Data File">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Select Excel data file in the left panel</li>
            <li>System will automatically load and validate data</li>
          </ul>
        </StepBox>
        <Arrow />
        <StepBox title="2. Select Decision Method">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Choose one: Weighted Sum, CP, or TOPSIS</li>
            <li>Adjust method parameters if needed</li>
          </ul>
        </StepBox>
        <Arrow />
        <StepBox title="3. Adjust Weights and Data">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Drag sliders or input values to adjust weights/data</li>
            <li>Lock important items to prevent accidental changes</li>
            <li>Weights are automatically normalized</li>
          </ul>
        </StepBox>
        <Arrow />
        <StepBox title="4. View Analysis Results">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>View bar chart, line chart, radar chart, etc. on the right</li>
            <li>Pareto optimal solutions are shown automatically</li>
            <li>Switch to scatter plot, tornado chart, and other advanced analyses</li>
          </ul>
        </StepBox>
        <Arrow />
        <StepBox title="5. Export & Feedback">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Export images or data</li>
            <li>Check FAQ or contact support if you encounter issues</li>
          </ul>
        </StepBox>
      </div>

      {/* Detailed Branch Flows */}
      <h2 style={{ marginTop: 48, color: '#1976d2' }}>Common Operation Branch Flows</h2>
      <div style={{ margin: '32px 0' }}>
        <FlowRow>
          <StepBox title="Adjust Weights" style={{ minWidth: 220 }}>
            <div>Adjust with slider/input box → <b>Auto-normalization</b> → <b>Real-time update of ranking and charts</b></div>
          </StepBox>
          <Arrow direction="right" />
          <StepBox title="Lock Weights" style={{ minWidth: 220 }}>
            <div>Click lock button → <b>Cannot be changed after locking</b> → <b>Remaining weights auto-distributed</b></div>
          </StepBox>
        </FlowRow>
        <div style={{ height: 24 }} />
        <FlowRow>
          <StepBox title="Adjust Data" style={{ minWidth: 220 }}>
            <div>Adjust with slider/input box → <b>Real-time range validation</b> → <b>Auto-refresh ranking and charts</b></div>
          </StepBox>
          <Arrow direction="right" />
          <StepBox title="Lock Data" style={{ minWidth: 220 }}>
            <div>Click lock button → <b>Prevent accidental changes</b> → <b>Cannot be changed after locking</b></div>
          </StepBox>
        </FlowRow>
        <div style={{ height: 24 }} />
        <FlowRow>
          <StepBox title="Pareto Analysis" style={{ minWidth: 220 }}>
            <div>Automatically identify optimal solutions → <b>Highlight</b> → <b>Assist decision making</b></div>
          </StepBox>
          <Arrow direction="right" />
          <StepBox title="Advanced Analysis" style={{ minWidth: 220 }}>
            <div>Switch to scatter/tornado chart → <b>Sensitivity analysis</b> → <b>Export results</b></div>
          </StepBox>
        </FlowRow>
      </div>

      {/* Version Info */}
      <div style={{ marginTop: 32, color: '#888', fontSize: 14, textAlign: 'center' }}>
        Version: MCDA-Tool-Web-1.0<br />
        Last updated: 2025<br />
        Documentation version: 1.0<br />
      </div>
    </div>
  </div>
);

export default McdaUserManual;
