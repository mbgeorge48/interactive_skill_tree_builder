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

function FlowContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState([]);

    const reactFlowInstance = useReactFlow();

    // Helper function to check if a node can be selected
    const canNodeBeSelected = useCallback((nodeId, selectedNodes, edges) => {
        // Starting node can always be selected (but doesn't need to be clicked)
        if (nodeId === "node") return true;

        // Find edges that target this node (prerequisites)
        const prerequisiteEdges = edges.filter(
            (edge) => edge.target === nodeId
        );

        // If no prerequisites, node can be selected
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

                // Check if node can be selected (prerequisites met)
                const canSelect = canNodeBeSelected(
                    nodeId,
                    currentSelected,
                    edges
                );

                if (!canSelect) {
                    return currentSelected; // Don't allow selection
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

    const initialNodes = [
        {
            id: "node",
            type: "startingNode",
            position: { x: 450, y: 0 },
            data: {},
        },
        {
            id: "node-1",
            type: "skillNode",
            position: { x: 250, y: 100 },
            data: {
                label: "Double Jump",
                description:
                    "Allows the player to dash in any direction while airborne.",
                category: "movement",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-1"),
                locked: false,
            },
        },
        {
            id: "node-5",
            type: "skillNode",
            position: { x: -50, y: 300 },
            data: {
                label: "Safe Landing",
                description:
                    "Reduces fall damage and allows for a quick recovery upon landing.",
                category: "movement",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-5"),
                locked: true,
            },
        },
        {
            id: "node-2",
            type: "skillNode",
            position: { x: 250, y: 300 },
            data: {
                label: "Wall Run",
                description:
                    "Enables the player to run along vertical surfaces for a short duration.",
                category: "movement",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-2"),
                locked: true,
            },
        },
        {
            id: "node-3",
            type: "skillNode",
            position: { x: 650, y: 100 },
            data: {
                label: "Heavy Attack",
                description:
                    "A powerful attack that launches enemies into the air.",
                category: "combat",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-3"),
                locked: false,
            },
        },
        {
            id: "node-4",
            type: "skillNode",
            position: { x: 650, y: 300 },
            data: {
                label: "Parry Strike",
                description:
                    "A perfectly timed block that stuns enemies and opens them to counterattacks.",
                category: "combat",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-4"),
                locked: true,
            },
        },
    ];

    const initialEdges = [
        { id: "edge-1", source: "node", target: "node-1" },
        { id: "edge-2", source: "node", target: "node-3" },
        { id: "edge-3", source: "node-1", target: "node-5" },
        { id: "edge-4", source: "node-1", target: "node-2" },
        { id: "edge-5", source: "node-3", target: "node-4" },
    ];

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

    let nodeId = initialNodes.length;
    const handleAddSkill = (formData) => {
        const id = `node-${++nodeId}`;
        const edges = reactFlowInstance.getEdges();
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
                locked: !canNodeBeSelected(id, selectedNodes, edges),
            },
        };
        reactFlowInstance.addNodes(newNode);

        // Update lock states after adding new node
        setTimeout(() => updateNodesWithLockState(), 0);
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
            // onConnect={onConnect}
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

// Lock nodes
// add new nodes at specific positions
// local storage saving/loading
// add branching
