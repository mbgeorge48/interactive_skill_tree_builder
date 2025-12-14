export const generateInitialSkillTree = (
  handleSkillNodeClick,
  selectedNodes,
) => {
  const nodes = [
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
      },
    },
    {
      id: "node-3",
      type: "skillNode",
      position: { x: 650, y: 100 },
      data: {
        label: "Heavy Attack",
        description: "A powerful attack that launches enemies into the air.",
        category: "combat",
        handleSkillNodeClick: handleSkillNodeClick,
        selected: selectedNodes.includes("node-3"),
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
      },
    },
  ];

  const edges = [
    { id: "edge-1", source: "node", target: "node-1" },
    { id: "edge-2", source: "node", target: "node-3" },
    { id: "edge-3", source: "node-1", target: "node-5" },
    { id: "edge-4", source: "node-1", target: "node-2" },
    { id: "edge-5", source: "node-3", target: "node-4" },
  ];

  return { nodes, edges };
};

export const setLocalStorageSkillTree = (nodes, edges, selectedNodes = []) => {
  console.log("Saving skill tree to localStorage...", nodes);

  // Ensure nodes have current selected state before saving
  const nodesWithCurrentSelection = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      selected: selectedNodes.includes(node.id),
    },
  }));

  localStorage.setItem(
    "skillTreeNodes",
    JSON.stringify(nodesWithCurrentSelection),
  );
  localStorage.setItem("skillTreeEdges", JSON.stringify(edges));
};
export const getLocalStorageSkillTree = (
  handleSkillNodeClick,
  selectedNodes,
) => {
  const storedNodes = localStorage.getItem("skillTreeNodes");
  const storedEdges = localStorage.getItem("skillTreeEdges");

  const { nodes: defaultNodes, edges: defaultEdges } = generateInitialSkillTree(
    handleSkillNodeClick,
    selectedNodes,
  );

  // Use stored data if it exists, is valid, and is not empty, otherwise use defaults
  let parsedNodes = defaultNodes;
  let parsedEdges = defaultEdges;

  if (storedNodes && storedNodes !== "null") {
    try {
      const parsed = JSON.parse(storedNodes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedNodes = parsed;
      }
    } catch (error) {
      console.warn("Failed to parse stored nodes from localStorage:", error);
      // parsedNodes remains as defaultNodes
    }
  }

  if (storedEdges && storedEdges !== "null") {
    try {
      const parsed = JSON.parse(storedEdges);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedEdges = parsed;
      }
    } catch (error) {
      console.warn("Failed to parse stored edges from localStorage:", error);
      // parsedEdges remains as defaultEdges
    }
  }

  return {
    nodes: parsedNodes,
    edges: parsedEdges,
  };
};
