import { describe, it, expect } from "vitest";
import {
  isNodeSelected,
  updateNodeSelection,
  updateNodeVisualState,
} from "./skillTreeUtils";

describe("isNodeSelected", () => {
  it("should return true when node is selected", () => {
    const selectedNodes = ["node-1", "node-2", "node-3"];
    const result = isNodeSelected("node-2", selectedNodes);
    expect(result).toBe(true);
  });

  it("should return false when node is not selected", () => {
    const selectedNodes = ["node-1", "node-2", "node-3"];
    const result = isNodeSelected("node-4", selectedNodes);
    expect(result).toBe(false);
  });

  it("should return false when selectedNodes array is empty", () => {
    const selectedNodes = [];
    const result = isNodeSelected("node-1", selectedNodes);
    expect(result).toBe(false);
  });
});

describe("updateNodeSelection", () => {
  it("should add node to selection when not currently selected", () => {
    const selectedNodes = ["node-1", "node-2"];
    const result = updateNodeSelection("node-3", selectedNodes);
    expect(result).toEqual(["node-1", "node-2", "node-3"]);
  });

  it("should remove node from selection when currently selected", () => {
    const selectedNodes = ["node-1", "node-2", "node-3"];
    const result = updateNodeSelection("node-2", selectedNodes);
    expect(result).toEqual(["node-1", "node-3"]);
  });

  it("should add to empty selection array", () => {
    const selectedNodes = [];
    const result = updateNodeSelection("node-1", selectedNodes);
    expect(result).toEqual(["node-1"]);
  });

  it("should remove last item from single-item array", () => {
    const selectedNodes = ["node-1"];
    const result = updateNodeSelection("node-1", selectedNodes);
    expect(result).toEqual([]);
  });

  it("should handle duplicate nodeId selection attempts", () => {
    const selectedNodes = ["node-1"];
    // First call adds it
    const result1 = updateNodeSelection("node-2", selectedNodes);
    expect(result1).toEqual(["node-1", "node-2"]);
    // Second call removes it
    const result2 = updateNodeSelection("node-2", result1);
    expect(result2).toEqual(["node-1"]);
  });
});

describe("updateNodeVisualState", () => {
  const mockNodes = [
    {
      id: "node-1",
      type: "skillNode",
      position: { x: 100, y: 100 },
      data: { label: "Jump", selected: false, category: "movement" },
    },
    {
      id: "node-2",
      type: "skillNode",
      position: { x: 200, y: 200 },
      data: { label: "Run", selected: true, category: "movement" },
    },
    {
      id: "node-3",
      type: "skillNode",
      position: { x: 300, y: 300 },
      data: { label: "Attack", selected: false, category: "combat" },
    },
  ];

  it("should update the selected state of the target node", () => {
    const result = updateNodeVisualState("node-1", mockNodes, true);
    expect(result[0].data.selected).toBe(true);
    expect(result[1].data.selected).toBe(true);
    expect(result[2].data.selected).toBe(false);
  });

  it("should preserve all other node properties", () => {
    const result = updateNodeVisualState("node-1", mockNodes, true);
    const updatedNode = result[0];

    expect(updatedNode.id).toBe("node-1");
    expect(updatedNode.type).toBe("skillNode");
    expect(updatedNode.data.label).toBe("Jump");
    expect(updatedNode.data.category).toBe("movement");
    expect(updatedNode.data.selected).toBe(true); // only this should change
  });

  it("should not modify nodes that do not match nodeId", () => {
    const result = updateNodeVisualState("node-1", mockNodes, true);
    expect(result[1]).toEqual(mockNodes[1]); // node-2 unchanged
    expect(result[2]).toEqual(mockNodes[2]); // node-3 unchanged
  });

  it("should handle setting selected to false", () => {
    const result = updateNodeVisualState("node-2", mockNodes, false);
    expect(result[1].data.selected).toBe(false);
  });

  it("should return same length array", () => {
    const result = updateNodeVisualState("node-1", mockNodes, true);
    expect(result).toHaveLength(mockNodes.length);
  });

  it("should handle non-existent nodeId gracefully", () => {
    const result = updateNodeVisualState("non-existent", mockNodes, true);
    expect(result).toEqual(mockNodes); // no changes
  });

  it("should preserve nested data properties", () => {
    const nodesWithNestedData = [
      {
        id: "node-1",
        data: {
          selected: false,
          label: "Test",
          metadata: { skill: "jump", level: 1 },
          config: { enabled: true, points: 10 },
        },
      },
    ];

    const result = updateNodeVisualState("node-1", nodesWithNestedData, true);
    expect(result[0].data.selected).toBe(true);
    expect(result[0].data.metadata).toEqual({ skill: "jump", level: 1 });
    expect(result[0].data.config).toEqual({ enabled: true, points: 10 });
  });
});
