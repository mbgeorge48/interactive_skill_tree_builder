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

import { TextUpdaterNode } from "./components/TextUpdaterNode.jsx";
import { SkillNode } from "./components/SkillNode.jsx";
import { Modal } from "./components/Modal.jsx";

// const initialNodes = [
//     {
//         id: "n1",
//         type: "skillNode",
//         position: { x: 0, y: 0 },
//         data: { label: "Node 1" },
//     },
//     {
//         id: "n2",
//         type: "skillNode",
//         position: { x: 0, y: 100 },
//         data: { label: "Node 2", completed: true },
//     },
// ];
// const initialEdges = [
//     {
//         id: "n1-n2",
//         source: "n1",
//         target: "n2",
//         type: "step",
//     },
// ];

const initialNodes = [
    {
        id: "node-1",
        type: "skillNode",
        position: { x: 325, y: 350 },
        data: { label: "Double Jump" },
    },
    {
        id: "node-2",
        type: "skillNode",
        position: { x: 200, y: 200 },
        data: { label: "Wall Run" },
    },
    {
        id: "node-3",
        type: "skillNode",
        position: { x: 450, y: 200 },
        data: { label: "Air Dash" },
    },
    {
        id: "node-4",
        type: "skillNode",
        position: { x: 125, y: 50 },
        data: { label: "Grapple Hook" },
    },
    {
        id: "node-5",
        type: "skillNode",
        position: { x: 525, y: 50 },
        data: { label: "Ground Slam" },
    },
];

const initialEdges = [
    // { id: "edge-1", source: "node-1", target: "node-2" },
    // { id: "edge-2", source: "node-1", target: "node-3" },
];

function FlowContent() {
    const [edges, setEdges] = useState(initialEdges);
    const reactFlowInstance = useReactFlow();
    const [skillPoints, setSkillPoints] = useState(8);
    const [isModalOpen, setIsModalOpen] = useState(false);

    let nodeId = initialNodes.length;
    const handleAddSkillClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

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
                label: formData.skillName || `Skill ${nodeId}`,
                description: formData.description || "",
                cost: parseInt(formData.cost) || 1,
                category: formData.category || "general",
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
