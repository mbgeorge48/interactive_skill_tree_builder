import { useState, useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    Panel,
    ReactFlowProvider,
    useReactFlow,
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
import { generateInitialSkillTree } from "./utils/skillTreeData.js";
import "./App.css";

function FlowContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState([]);

    const reactFlowInstance = useReactFlow();

    const canNodeBeSelected = useCallback((nodeId, selectedNodes, edges) => {
        if (nodeId === "node") return true;

        // Find edges that target this node (prerequisites)
        const prerequisiteEdges = edges.filter(
            (edge) => edge.target === nodeId
        );

        if (prerequisiteEdges.length === 0) return true;
        // All prerequisite nodes must be selected, but treat starting node as always selected
        return prerequisiteEdges.every(
            (edge) =>
                edge.source === "node" || selectedNodes.includes(edge.source)
        );
    }, []);

    const handleSkillNodeClick = useCallback(
        (nodeId) => {
            setSelectedNodes((currentSelected) => {
                const nodes = reactFlowInstance.getNodes();
                const edges = reactFlowInstance.getEdges();

                const canSelect = canNodeBeSelected(
                    nodeId,
                    currentSelected,
                    edges
                );

                if (!canSelect) {
                    return currentSelected;
                }

                const isSelected = isNodeSelected(nodeId, currentSelected);
                const updatedNodes = updateNodeVisualState(
                    nodeId,
                    nodes,
                    !isSelected
                );
                reactFlowInstance.setNodes(updatedNodes);

                return updateNodeSelection(nodeId, currentSelected);
            });
        },
        [reactFlowInstance, canNodeBeSelected]
    );

    // Generate initial skill tree data
    const { nodes: initialNodes, edges: initialEdges } =
        generateInitialSkillTree(handleSkillNodeClick, selectedNodes);

    // Update nodes with locked state when selectedNodes changes
    const updateNodesWithLockState = useCallback(() => {
        const nodes = reactFlowInstance.getNodes();
        const edges = reactFlowInstance.getEdges();

        if (nodes.length === 0) return;

        const updatedNodes = nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                selected: selectedNodes.includes(node.id),
                locked: !canNodeBeSelected(node.id, selectedNodes, edges),
            },
        }));

        reactFlowInstance.setNodes(updatedNodes);
    }, [reactFlowInstance, selectedNodes, canNodeBeSelected]);

    // Update lock states whenever selectedNodes changes
    useEffect(() => {
        updateNodesWithLockState();
    }, [selectedNodes, updateNodesWithLockState]);

    const handleAddSkillClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleAddSkill = (formData) => {
        const nodes = reactFlowInstance.getNodes();
        const edges = reactFlowInstance.getEdges();
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

        reactFlowInstance.addNodes(newNode);

        if (formData.prerequisite && formData.prerequisite !== "") {
            const newEdge = {
                id: `edge-${edges.length + 1}`,
                source: formData.prerequisite,
                target: id,
            };
            reactFlowInstance.addEdges(newEdge);
        }

        // Update lock states after adding new node and edge
        setTimeout(() => updateNodesWithLockState(), 50);
    };

    const nodeTypes = {
        skillNode: SkillNode,
        startingNode: StartingNode,
    };

    return (
        <ReactFlow
            defaultNodes={initialNodes}
            defaultEdges={initialEdges}
            nodeTypes={nodeTypes}
            fitView
        >
            <Panel position="top-left">
                <div className="panel-content">
                    <h2>Interactive Skill Tree Builder</h2>
                </div>
            </Panel>
            <Panel position="bottom-right">
                <button onClick={handleAddSkillClick}>Add New Skill</button>
            </Panel>
            <Background bgColor="#B8CEFF" />
            <Controls position="top-right" />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddSkill}
                existingNodes={reactFlowInstance.getNodes()}
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

// local storage saving/loading
// tests
// readme
// linting
