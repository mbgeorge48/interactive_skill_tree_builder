import { useState, useCallback } from "react";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
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

const initialEdges = [
    // { id: "edge-1", source: "node-1", target: "node-2" },
    // { id: "edge-2", source: "node-1", target: "node-3" },
];

function FlowContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [edges, setEdges] = useState(initialEdges);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [skillPoints, setSkillPoints] = useState(8);

    const reactFlowInstance = useReactFlow();

    const handleSkillNodeClick = useCallback(
        (nodeId) => {
            setSelectedNodes((prev) => {
                const isSelected = prev.includes(nodeId);
                const newSelection = isSelected
                    ? prev.filter((id) => id !== nodeId)
                    : [...prev, nodeId];

                const nodes = reactFlowInstance.getNodes();
                const updatedNodes = nodes.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                selected: !isSelected,
                            },
                        };
                    }
                    return node;
                });
                reactFlowInstance.setNodes(updatedNodes);

                return newSelection;
            });
        },
        [reactFlowInstance]
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
                label: "Air Dash",
                cost: 1,
                description:
                    "Allows the player to dash in any direction while airborne.",
                category: "movement",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-1"),
            },
        },
        {
            id: "node-2",
            type: "skillNode",
            position: { x: 250, y: 300 },
            data: {
                label: "Wall Run",
                cost: 1,
                description:
                    "Enables the player to run along vertical surfaces for a short duration.",
                category: "movement",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-2"),
            },
        },
        {
            id: "node-3",
            type: "skillNode",
            position: { x: 250, y: 500 },
            data: {
                label: "Blink Step",
                cost: 2,
                description:
                    "Instantly teleports the player a short distance in the direction of movement.",
                category: "movement",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-3"),
            },
        },
        {
            id: "node-4",
            type: "skillNode",
            position: { x: 650, y: 100 },
            data: {
                label: "Launcher Attack",
                cost: 1,
                description:
                    "A powerful attack that launches enemies into the air.",
                category: "combat",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-4"),
            },
        },
        {
            id: "node-5",
            type: "skillNode",
            position: { x: 650, y: 300 },
            data: {
                label: "Parry Strike",
                cost: 2,
                description:
                    "A perfectly timed block that stuns enemies and opens them to counterattacks.",
                category: "combat",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-5"),
            },
        },
        {
            id: "node-6",
            type: "skillNode",
            position: { x: 650, y: 500 },
            data: {
                label: "Ground Slam",
                cost: 1,
                description:
                    "Slams the ground from the air, dealing damage to nearby enemies.",
                category: "combat",
                handleSkillNodeClick: handleSkillNodeClick,
                selected: selectedNodes.includes("node-6"),
            },
        },
    ];

    const handleAddSkillClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    let nodeId = initialNodes.length;
    const handleAddSkill = (formData) => {
        const id = `node-${++nodeId}`;
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
                cost: parseInt(formData.cost),
                category: formData.category,
                handleSkillNodeClick: handleSkillNodeClick,
            },
        };
        reactFlowInstance.addNodes(newNode);
        console.log("Added new skill:", newNode);
    };

    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        []
    );

    const nodeTypes = {
        skillNode: SkillNode,
        startingNode: StartingNode,
    };

    return (
        <ReactFlow
            defaultNodes={initialNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            fitView
        >
            <Panel position="top-left">
                <div className="panel-content">
                    <h2>Interactive Skill Tree Builder</h2>
                </div>
            </Panel>
            <Panel position="bottom-left">
                <div className="panel-content">
                    <h4>Availible Skill Points: {skillPoints}</h4>
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
