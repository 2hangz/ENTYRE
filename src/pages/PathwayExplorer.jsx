import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import CustomPolylineEdge from '../components/CustomPolylineEdge';
import {
  pathwayInfoCard,
  flowContainer
} from '../components/Style';

import styles from '../styles/App.module.css';
import BackgroundImageNode from '../components/BackgroundImageNode';
import ConnectedIconNode from '../components/ConnectedIconNode';

const WORKFLOWS_API = 'https://entyre-backend.onrender.com/api/workflow';

function renderDetail(detail) {
  if (!detail) return null;

  const linkMatch = detail.match(/\[(.*?)\]/);
  if (linkMatch) {
    const linkText = linkMatch[1];
    const parts = detail.split(/\[|\]/);
    return (
      <div>
        {parts.map((part, index) => {
          if (part === linkText) {
            return (
              <a
                key={index}
                href={`https://echa.europa.eu/regulations/reach/understanding-reach`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                {part}
              </a>
            );
          }
          return part;
        })}
      </div>
    );
  }

  return <div>{detail}</div>;
}


const edgeTypes = {
  customPolyline: CustomPolylineEdge,
};

const nodeTypes = {
  iconNode: ConnectedIconNode,
  backgroundImage: BackgroundImageNode,
};

const PathwayExplorer = () => {
  const [workflows, setWorkflows] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workflows from backend on mount
  useEffect(() => {
    setLoading(true);
    fetch(WORKFLOWS_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch workflows');
        return res.json();
      })
      .then(data => {
        // Convert array to object keyed by _id or id
        const obj = {};
        data.forEach(wf => {
          obj[wf._id || wf.id] = wf;
        });
        setWorkflows(obj);
        // Default to first workflow if available
        if (data.length > 0) {
          setSelectedPathway(data[0]._id || data[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error loading workflows');
        setLoading(false);
      });
  }, []);

  // Compose nodes for ReactFlow
  const reactFlowNodes = useMemo(() => {
    const currentPathway = workflows[selectedPathway];
    if (!currentPathway) return [];
    const currentPositions = currentPathway.nodePositions || {};
    return (currentPathway.nodes || [])
      .map(node => {
        let style;
        let selectable;
        if (node.type === 'backgroundImage') {
          style = node.style || {
            zIndex: -1,
            transition: 'width 0.2s, height 0.2s',
          };
          selectable = typeof node.selectable === 'boolean' ? node.selectable : false;
        } else {
          style = node.style || {
            width: node.id === 'civil_engineering' ? 200 : 100,
            height: node.id === 'civil_engineering' ? 200 : 100,
            zIndex: node.id === 'civil_engineering' ? 2 : 1,
            transition: 'width 0.2s, height 0.2s',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
          };
          selectable = node.selectable;
        }
        return {
          id: node.id,
          type: node.type || 'iconNode',
          data: { ...node },
          position: currentPositions[node.id] || { x: 0, y: 0 },
          style,
          draggable: node.draggable,
          selectable,
          focusable: node.focusable
        };
      });
  }, [workflows, selectedPathway]);

  // Compose edges for ReactFlow
  const reactFlowEdges = useMemo(() => {
    const currentPathway = workflows[selectedPathway];
    if (!currentPathway) return [];
    return (currentPathway.connections || []).map((conn) => ({
      id: `e${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      animated: false,
      type: conn.edgeType || 'step',
      style: conn.edgeStyle ? (currentPathway.edgeStyles && currentPathway.edgeStyles[conn.edgeStyle]) : (currentPathway.edgeStyles && currentPathway.edgeStyles.default),
      markerEnd: {
        type: 'arrowclosed',
        width: 10,
        height: 10,
        color: (conn.edgeStyle && currentPathway.edgeStyles && currentPathway.edgeStyles[conn.edgeStyle]?.stroke) ? currentPathway.edgeStyles[conn.edgeStyle].stroke : '#000000',
      },
      label: conn.label || undefined,
      labelStyle: conn.label ? { fill: 'red', fontWeight: 600 } : undefined,
    }));
  }, [workflows, selectedPathway]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles.intro_wrapper}>
        <h1>ELTs Valorisation Pathways</h1>
        <div>Loading pathways...</div>
        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          <span>
            Fetching workflow data from: <code>{WORKFLOWS_API}</code>
          </span>
        </div>
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div className={styles.intro_wrapper}>
        <h1>ELTs Valorisation Pathways</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          <span>
            Tried to fetch workflow data from: <code>{WORKFLOWS_API}</code>
          </span>
        </div>
      </div>
    );
  }
  // No data state
  if (!workflows || Object.keys(workflows).length === 0) {
    return (
      <div className={styles.intro_wrapper}>
        <h1>ELTs Valorisation Pathways</h1>
        <div>No pathways found.</div>
        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          <span>
            No data found at: <code>{WORKFLOWS_API}</code>
          </span>
        </div>
      </div>
    );
  }

  const currentPathway = workflows[selectedPathway];

  // Defensive: If no currentPathway, show nothing
  if (!currentPathway) {
    return (
      <div className={styles.intro_wrapper}>
        <h1>ELTs Valorisation Pathways</h1>
        <div>No pathway selected.</div>
        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          <span>
            Data is fetched from: <code>{WORKFLOWS_API}</code>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.intro_wrapper}>
      <h1>ELTs Valorisation Pathways</h1>
      {/* Pathways selector */}
      <div className={styles.pathway_selector}>
        {Object.entries(workflows).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setSelectedPathway(key)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: 'none',
              background: selectedPathway === key ? '#05243B' : '#e5e7eb',
              color: selectedPathway === key ? '#fff' : '#05243B',
              fontWeight: 600,
              fontSize: 16,
              boxShadow: selectedPathway === key ? '0 2px 8px rgba(5,36,59,0.12)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{display: 'flex', flexDirection: 'row', gap: 12}}>
        {/* Pathway information */}
        <div style={pathwayInfoCard}>
          <div style={{ fontWeight: 'bold', fontSize: 20 }}>{currentPathway.name}</div>
          <div style={{ color: '#666', margin: '4px 0 8px 0' }}>
            Status:<span style={{
              color: currentPathway.status === 'verified' ? 'green' :
                     currentPathway.status === 'researching' ? '#eab308' : '#888',
              fontWeight: 600
            }}>{currentPathway.status}</span>
          </div>
          <div style={{ color: '#444' }}>{currentPathway.description}</div>
        </div>
        {/* Node information */}
        <div className={styles.nodeDetailCard}>
          {selectedNode ? (
            <>
              <div className={styles.nodeDetailCardLabel}>{selectedNode.label || selectedNode.id}</div>
              <div className={styles.nodeDetailCardContent}>
                {renderDetail(selectedNode.detail)}
              </div>
            </>
          ) : (
            <div style={{ color: '#888' }}>Click a node to see details here.</div>
          )}
        </div>
      </div>

      <div style={flowContainer}>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls/>
          <Background/>
        </ReactFlow>
      </div>
      {/* Add the Go compare pathways button at the bottom */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a
          href="https://2hangz.github.io/ENTYRE/#/data-visualisation/compare"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#2563eb',
            color: '#fff',
            borderRadius: 24,
            fontWeight: 700,
            fontSize: 18,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            transition: 'background 0.2s',
          }}
        >
          Go compare pathways
        </a>
      </div>
    </div>
  );
};

export default PathwayExplorer;