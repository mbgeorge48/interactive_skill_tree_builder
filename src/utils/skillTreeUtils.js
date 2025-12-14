export const isNodeSelected = (nodeId, selectedNodes) => {
    return selectedNodes.includes(nodeId);
};

export const updateNodeSelection = (nodeId, selectedNodes) => {
    const isSelected = isNodeSelected(nodeId, selectedNodes);
    return isSelected
        ? selectedNodes.filter((id) => id !== nodeId)
        : [...selectedNodes, nodeId];
};

export const updateNodeVisualState = (nodeId, nodes, newSelectedState) => {
    return nodes.map((node) => {
        if (node.id === nodeId) {
            return {
                ...node,
                data: {
                    ...node.data,
                    selected: newSelectedState,
                },
            };
        }
        return node;
    });
};
