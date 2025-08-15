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
import StatusIndicator from '../components/StatusIndicator';

const defaultEdgeStyles = {
  default: { stroke: "#003C69", strokeWidth: 2 },
  redDashed: { stroke: "red", strokeWidth: 2, strokeDasharray: "6 4"},
  redSolid: { stroke: "red", strokeWidth: 2 },
  grayDashed: { stroke: "gray", strokeWidth: 2, strokeDasharray: "6 4"},
  blueBold: { stroke: "blue", strokeWidth: 4 }
};

const WORKFLOWS_API = 'https://entyre-backend.onrender.com/api/workflow';

function renderDetail(detail) {
  if (!detail) return null;

  const linkMatch = detail.match(/\[(.*?)\]/);
  if (linkMatch) {
    const linkText = linkMatch[1];
    const parts = detail.split(/\[|\]/);
    return (
      <div style={{ fontFamily: "'FiraGO', sans-serif" }}>
        {parts.map((part, index) => {
          if (part === linkText) {
            return (
              <a
                key={index}
                href={`https://echa.europa.eu/regulations/reach/understanding-reach`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: '#006087',
                  textDecoration: 'underline',
                  fontWeight: '500'
                }}
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

  return <div style={{ fontFamily: "'FiraGO', sans-serif" }}>{detail}</div>;
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

  useEffect(() => {
    setLoading(true);
    fetch(WORKFLOWS_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch workflows');
        return res.json();
      })
      .then(data => {
        const obj = {};
        data.forEach(wf => {
          obj[wf._id || wf.id] = wf;
        });
        setWorkflows(obj);
        if (data.length > 0) {
          const last = data[data.length - 1];
          setSelectedPathway(last._id || last.id);
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
    
    const edgeStyles = currentPathway.edgeStyles || defaultEdgeStyles;
    
    return (currentPathway.connections || []).map((conn) => ({
      id: `e${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      animated: false,
      type: conn.edgeType || 'step',
      style: conn.edgeStyle && edgeStyles[conn.edgeStyle] ? 
             edgeStyles[conn.edgeStyle] : 
             edgeStyles.default,
      markerEnd: {
        type: 'arrowclosed',
        width: 10,
        height: 10,
        color: conn.edgeStyle && edgeStyles[conn.edgeStyle] ? 
               edgeStyles[conn.edgeStyle].stroke : 
               edgeStyles.default.stroke,
      },
      label: conn.label || undefined,
      labelStyle: conn.label ? { 
        fill: '#CE1F2C', 
        fontWeight: 600, 
        fontFamily: "'FiraGO', sans-serif" 
      } : undefined,
    }));
  }, [workflows, selectedPathway]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data);
  }, []);

  const getPathwaySlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getPathwayHashRoute = (slug) => {
    return `/ENTYRE/#/pathway-explorer/${slug}`;
  };

  const reversedWorkflowsEntries = useMemo(() => {
    return Object.entries(workflows).reverse();
  }, [workflows]);

  // Loading state
  if (loading) {
    return (
      <div className={styles.intro_wrapper}>
        <h1>
          ELTs Valorisation Pathways
        </h1>
          <span style={{ fontFamily: "'FiraGO', sans-serif", color: '#003C69' }}>
            Loading pathways...
          </span>
      </div>
    );
  }

  const currentPathway = workflows[selectedPathway];

  const handlePathwayClick = (key, name) => {
    setSelectedPathway(key);
    const slug = getPathwaySlug(name);
    if (slug) {
      // Use hash routing for the correct URL
      window.location.hash = `#/pathway-explorer/${slug}`;
    }
  };

  return (
    <div className={styles.intro_wrapper}>
      <h1 style={{ fontFamily: "'Merriweather', Georgia, serif", color: '#003C69' }}>
        ELTs Valorisation Pathways
      </h1>
      
      {/* Pathways selector */}
      <div className={styles.pathway_selector}>
        {reversedWorkflowsEntries.map(([key, p]) => {
          const slug = getPathwaySlug(p.name);
          const hashRoute = getPathwayHashRoute(slug);
          return (
            <a
              key={key}
              href={hashRoute}
              onClick={e => {
                e.preventDefault();
                handlePathwayClick(key, p.name);
              }}
              className={selectedPathway === key ? 'active' : ''}
              style={{
                borderRadius: '8px',
                background: selectedPathway === key ? '#003C69' : '#ffffff',
                color: selectedPathway === key ? '#ffffff' : '#003C69',
                fontFamily: "'FiraGO', sans-serif",
                boxShadow: selectedPathway === key ? '0 4px 8px rgba(0, 60, 105, 0.15)' : '0 2px 4px rgba(0, 60, 105, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
            >
              {p.name}
            </a>
          );
        })}
      </div>

      <div style={{display: 'flex', flexDirection: 'row', gap: 12}}>
        <div style={{
          ...pathwayInfoCard,
          borderLeft: '4px solid #FFB500',
          fontFamily: "'FiraGO', sans-serif"
        }}>
          <div style={{ 
            fontFamily: "'Merriweather', Georgia, serif",
            fontWeight: 'bold', 
            fontSize: 20,
            color: '#003C69',
            marginBottom: '12px'
          }}>
            {currentPathway.name}
          </div>
          <div style={{ 
            color: '#666', 
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontWeight: '500' }}>Status:</span>
            <StatusIndicator status={currentPathway.status} />
          </div>
          <div style={{ 
            color: '#003C69',
            lineHeight: '1.6',
            fontSize: '15px'
          }}>
            {currentPathway.description}
          </div>
        </div>
        
        <div 
        className={styles.nodeDetailCard}
        style={{
          height: 105,
        }}>
          {selectedNode ? (
            <>
              <div className={styles.nodeDetailCardLabel}>
                {selectedNode.label || selectedNode.id}
              </div>
              <div className={styles.nodeDetailCardContent}>
                {renderDetail(selectedNode.detail)}
              </div>
            </>
          ) : (
            <div style={{ 
              color: '#888',
              fontFamily: "'FiraGO', sans-serif",
              fontStyle: 'italic'
            }}>
              Click a node to see details here.
            </div>
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
      
      {/* Call to action button */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a
          href="https://2hangz.github.io/ENTYRE/#/data-visualisation/compare"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#FFB500',
            color: '#003C69',
            borderRadius: '0px',
            fontWeight: '700',
            fontSize: '20px',
            fontFamily: "'FiraGO'",
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#FFB500';
            e.target.style.color = '#003C69';
            e.target.style.borderColor = '#FFB500';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(255, 181, 0, 0.25)';
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#003C69';
            e.target.style.color = '#ffffff';
            e.target.style.borderColor = '#003C69';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 60, 105, 0.15)';
          }}
        >
          Compare Pathways →
        </a>
      </div>
    </div>
  );
};

export default PathwayExplorer;