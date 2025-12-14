import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { SkillNode } from "./components/SkillNode.jsx";
import { StartingNode } from "./components/StartingNode.jsx";
import { Modal } from "./components/Modal.jsx";
import {
  isNodeSelected,
  updateNodeSelection,
  updateNodeVisualState,
} from "./utils/skillTreeUtils.js";
import {
  setLocalStorageSkillTree,
  generateInitialSkillTree,
  getLocalStorageSkillTree,
} from "./utils/skillTreeData.js";
import "./App.css";

function FlowContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const canNodeBeSelected = useCallback((nodeId, selectedNodes, edges) => {
    // Find edges that target this node (prerequisites), handles mutliple prerequisites however the code to add nodes doesn't allow this yet
    const prerequisiteEdges = edges.filter((edge) => edge.target === nodeId);

    if (prerequisiteEdges.length === 0) return true;
    // All prerequisite nodes must be selected, but treat starting node as always selected
    return prerequisiteEdges.every(
      (edge) => edge.source === "node" || selectedNodes.includes(edge.source),
    );
  }, []);

  const handleSkillNodeClick = useCallback(
    (nodeId) => {
      // This is a little complex because we're managing lots of state in a single callback
      setSelectedNodes((currentSelected) => {
        setNodes((currentNodes) => {
          setEdges((currentEdges) => {
            const canSelect = canNodeBeSelected(
              nodeId,
              currentSelected,
              currentEdges,
            );

            if (!canSelect) {
              return currentEdges;
            }

            const isSelected = isNodeSelected(nodeId, currentSelected);
            const updatedNodes = updateNodeVisualState(
              nodeId,
              currentNodes,
              !isSelected,
            );

            setNodes(updatedNodes);
            return currentEdges;
          });
          return currentNodes;
        });

        return updateNodeSelection(nodeId, currentSelected, edges);
      });
    },
    [canNodeBeSelected, edges],
  );

  useEffect(() => {
    // Update lock states whenever selectedNodes changes
    setNodes((currentNodes) => {
      if (currentNodes.length === 0) return currentNodes;

      return currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: selectedNodes.includes(node.id),
          locked: !canNodeBeSelected(node.id, selectedNodes, edges),
        },
      }));
    });

    // Validate that all currently selected nodes are still valid to prevent invalid states
    const validSelectedNodes = [];
    for (const nodeId of selectedNodes) {
      if (canNodeBeSelected(nodeId, validSelectedNodes, edges)) {
        validSelectedNodes.push(nodeId);
      }
    }
    if (validSelectedNodes.length !== selectedNodes.length) {
      setSelectedNodes(validSelectedNodes);
    }
  }, [selectedNodes, edges, canNodeBeSelected]);

  useEffect(() => {
    // Save to localStorage when nodes, edges, or selectedNodes change
    if (nodes.length > 0) {
      const timeoutId = setTimeout(() => {
        setLocalStorageSkillTree(nodes, edges, selectedNodes);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, selectedNodes]);

  const handleResetInitialSkills = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = generateInitialSkillTree(
      handleSkillNodeClick,
      [], // Pass empty array since we're resetting to initial state
    );
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodes([]); // Clear selected nodes when resetting
  }, [handleSkillNodeClick]);

  const handleAddSkillClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const handleAddSkill = (formData) => {
    const id = `node-${nodes.length + 1}`;

    const newNode = {
      id,
      type: "skillNode",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label: formData.skillName,
        description: formData.description,
        category: formData.category,
        handleSkillNodeClick: handleSkillNodeClick,
        selected: false,
      },
    };
    setNodes([...nodes, newNode]);

    if (formData.prerequisite && formData.prerequisite !== "") {
      const newEdge = {
        id: `edge-${edges.length + 1}`,
        source: formData.prerequisite,
        target: id,
      };
      setEdges([...edges, newEdge]);
    }
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const nodeTypes = {
    startingNode: StartingNode,
    skillNode: SkillNode,
  };

  useEffect(() => {
    const {
      nodes: loadedNodes,
      edges: loadedEdges,
      selectedNodes: loadedSelectedNodes,
    } = getLocalStorageSkillTree(handleSkillNodeClick, []);

    // Validate which nodes from localStorage can actually be selected as a fail safe
    const validSelectedNodes = [];
    for (const nodeId of loadedSelectedNodes) {
      if (canNodeBeSelected(nodeId, validSelectedNodes, loadedEdges)) {
        validSelectedNodes.push(nodeId);
      }
    }

    setSelectedNodes(validSelectedNodes);
    const updatedNodes = loadedNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        handleSkillNodeClick:
          node.type === "skillNode"
            ? handleSkillNodeClick
            : node.data.handleSkillNodeClick,
        selected: validSelectedNodes.includes(node.id),
      },
    }));

    setNodes(updatedNodes);
    setEdges(loadedEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-left">
        <div className="panel-content">
          <h2>Interactive Skill Tree Builder</h2>
        </div>
      </Panel>
      <Panel position="bottom-right">
        <div className="panel-content">
          <button
            className="btn btn-primary"
            onClick={handleResetInitialSkills}
          >
            Reset Initial Skills
          </button>
          <button className="btn btn-secondary" onClick={handleAddSkillClick}>
            Add New Skill
          </button>
        </div>
      </Panel>
      <Background bgColor="#B8CEFF" />
      <Controls position="top-right" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSkill}
        existingNodes={nodes}
      />
    </ReactFlow>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
}
