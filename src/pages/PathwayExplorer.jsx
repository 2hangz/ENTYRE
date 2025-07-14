import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import CustomPolylineEdge from '../components/CustomPolylineEdge';
import IconNode from '../components/IconNode';
import {
  pathwayInfoCard,
  flowContainer
} from '../components/Style';
import data from '../data.json';
import styles from '../styles/App.module.css';
import BackgroundImageNode from '../components/BackgroundImageNode';


const { nodesData, edgeStyles, globalNodePositions, pathways } = data;

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

const PathwayExplorer = () => {
  const edgeTypes = useMemo(() => ({
    customPolyline: CustomPolylineEdge,
  }), []);
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState('allPathways');

  const currentPathway = pathways[selectedPathway];

  const currentPositions = {
    ...globalNodePositions,
    ...(currentPathway.nodePositions || {})
  };

  const reactFlowNodes = useMemo(() =>
    nodesData
      .filter(node => currentPathway.nodes.includes(node.id))
      .map(node => {
        let style;
        let selectable;
        if (node.type === 'backgroundImage') {
          style = node.style || {
            zIndex: -1,
            transition: 'width 0.2s, height 0.2s',
          };
          // Default selectable to false for backgroundImage nodes unless explicitly set
          selectable = typeof node.selectable === 'boolean' ? node.selectable : false;
        } else {
          style = node.style || {
            width: node.id === 'civil_engineering' ? 200 : 100,
            height: node.id === 'civil_engineering' ? 200 : 100,
            zIndex: node.id === 'civil_engineering' ? 2 : 1,
            transition: 'width 0.2s, height 0.2s',
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
      }),
    [currentPathway]
  );

  const reactFlowEdges = useMemo(() =>
    currentPathway.connections.map((conn) => ({
      id: `e${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      animated: false,
      type: conn.edgeType || 'step',
      style: conn.edgeStyle ? edgeStyles[conn.edgeStyle] : edgeStyles.default,
      markerEnd: {
        type: 'arrowclosed',
        width: 10,
        height: 10,
        color: (conn.edgeStyle && edgeStyles[conn.edgeStyle]?.stroke) ? edgeStyles[conn.edgeStyle].stroke : '#000000',
      },
      label: conn.label || undefined,
      labelStyle: conn.label ? { fill: 'red', fontWeight: 600 } : undefined,
    })),
    [currentPathway]
  );

  const nodeTypes = useMemo(() => ({
    iconNode: IconNode,
    backgroundImage: BackgroundImageNode,
  }), []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  return (
    <div className={styles.intro_wrapper}>
      <h1>ELTs Valorisation Pathways</h1>

      {/* pathways buttons */}
      <div className={styles.pathway_selector}>
        {Object.entries(pathways).map(([key, p]) => (
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
        {/* pathways information Container */}
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
        
         {/* nodes information Container */}
        <div className={styles.nodeDetailCard}>
          {selectedNode ? (
            <>
              <div className={styles.nodeDetailCardLabel}>{selectedNode.label || selectedNode.id}</div>
              <div className={styles.nodeDetailCardContent}>{renderDetail(selectedNode.detail)}</div>
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
    </div>
  );
};

export default PathwayExplorer; 