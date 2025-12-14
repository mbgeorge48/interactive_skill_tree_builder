export const isNodeSelected = (nodeId, selectedNodes) => {
  return selectedNodes.includes(nodeId);
};

export const updateNodeSelection = (nodeId, selectedNodes, edges = []) => {
  const isSelected = isNodeSelected(nodeId, selectedNodes);

  if (isSelected) {
    // initialise array with the node to be removed
    const toRemove = [nodeId];

    // Loop to find nodes that should be deselected
    let foundMore = true;
    while (foundMore) {
      foundMore = false;
      for (const edge of edges) {
        if (toRemove.includes(edge.source) && !toRemove.includes(edge.target)) {
          toRemove.push(edge.target);
          foundMore = true;
        }
      }
    }

    return selectedNodes.filter((id) => !toRemove.includes(id));
  } else {
    return [...selectedNodes, nodeId];
  }
};

export const updateNodeVisualState = (nodeId, nodes, newSelectedState) => {
  // Updates a nodes data with the new value of `selected`
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
