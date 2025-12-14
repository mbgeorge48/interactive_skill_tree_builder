import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  generateInitialSkillTree,
  setLocalStorageSkillTree,
  getLocalStorageSkillTree,
} from "./skillTreeData";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("skillTreeData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateInitialSkillTree", () => {
    const mockHandleClick = vi.fn();

    it("should generate the correct number of nodes and edges", () => {
      const selectedNodes = [];
      const { nodes, edges } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      expect(nodes).toHaveLength(6);
      expect(edges).toHaveLength(5);
    });

    it("should include starting node with correct properties", () => {
      const selectedNodes = [];
      const { nodes } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      const startingNode = nodes.find((node) => node.type === "startingNode");
      expect(startingNode).toEqual({
        id: "node",
        type: "startingNode",
        position: { x: 450, y: 0 },
        data: {},
      });
    });

    it("should include all expected skill nodes with correct structure", () => {
      const selectedNodes = [];
      const { nodes } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      const skillNodes = nodes.filter((node) => node.type === "skillNode");
      expect(skillNodes).toHaveLength(5);

      // Check that each skill node has required properties
      skillNodes.forEach((node) => {
        expect(node).toHaveProperty("id");
        expect(node).toHaveProperty("type", "skillNode");
        expect(node).toHaveProperty("data");
        expect(node.data).toHaveProperty("label");
        expect(node.data).toHaveProperty("description");
        expect(node.data).toHaveProperty("category");
        expect(node.data).toHaveProperty(
          "handleSkillNodeClick",
          mockHandleClick,
        );
        expect(node.data).toHaveProperty("selected");
      });
    });

    it("should set selected state correctly based on selectedNodes array", () => {
      const selectedNodes = ["node-1", "node-3"];
      const { nodes } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      const node1 = nodes.find((n) => n.id === "node-1");
      const node2 = nodes.find((n) => n.id === "node-2");
      const node3 = nodes.find((n) => n.id === "node-3");

      expect(node1.data.selected).toBe(true);
      expect(node2.data.selected).toBe(false);
      expect(node3.data.selected).toBe(true);
    });

    it("should include specific expected nodes", () => {
      const selectedNodes = [];
      const { nodes } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      const nodeLabels = nodes.map((n) => n.data.label).filter(Boolean);
      expect(nodeLabels).toContain("Double Jump");
      expect(nodeLabels).toContain("Safe Landing");
      expect(nodeLabels).toContain("Wall Run");
      expect(nodeLabels).toContain("Heavy Attack");
      expect(nodeLabels).toContain("Parry Strike");
    });

    it("should include correct edges connecting nodes", () => {
      const selectedNodes = [];
      const { edges } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      const expectedEdges = [
        { id: "edge-1", source: "node", target: "node-1" },
        { id: "edge-2", source: "node", target: "node-3" },
        { id: "edge-3", source: "node-1", target: "node-5" },
        { id: "edge-4", source: "node-1", target: "node-2" },
        { id: "edge-5", source: "node-3", target: "node-4" },
      ];

      expectedEdges.forEach((expectedEdge) => {
        expect(edges).toContainEqual(expectedEdge);
      });
    });

    it("should categorize nodes correctly", () => {
      const selectedNodes = [];
      const { nodes } = generateInitialSkillTree(
        mockHandleClick,
        selectedNodes,
      );

      const movementNodes = nodes.filter((n) => n.data.category === "movement");
      const combatNodes = nodes.filter((n) => n.data.category === "combat");

      expect(movementNodes).toHaveLength(3);
      expect(combatNodes).toHaveLength(2);
    });
  });

  describe("setLocalStorageSkillTree", () => {
    it("should save nodes and edges to localStorage", () => {
      const nodes = [
        { id: "node-1", data: { label: "Moon walk" } },
        { id: "node-2", data: { label: "The worm" } },
      ];
      const edges = [{ id: "edge-1", source: "node-1", target: "node-2" }];
      const selectedNodes = ["node-1"];

      setLocalStorageSkillTree(nodes, edges, selectedNodes);

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "skillTreeEdges",
        JSON.stringify(edges),
      );
    });

    it("should update node selected state before saving", () => {
      const nodes = [
        { id: "node-1", data: { label: "Moon walk", selected: false } },
        { id: "node-2", data: { label: "The worm", selected: true } },
      ];
      const edges = [];
      const selectedNodes = ["node-1"];

      setLocalStorageSkillTree(nodes, edges, selectedNodes);

      const savedNodesCall = localStorage.setItem.mock.calls.find(
        (call) => call[0] === "skillTreeNodes",
      );
      const savedNodes = JSON.parse(savedNodesCall[1]);

      expect(savedNodes[0].data.selected).toBe(true); // node-1
      expect(savedNodes[1].data.selected).toBe(false); // node-2
    });

    it("should preserve all other node properties when updating selection", () => {
      const nodes = [
        {
          id: "node-1",
          type: "skillNode",
          position: { x: 100, y: 200 },
          data: {
            label: "Moon walk",
            description: "Cool dance move",
            category: "movement",
            selected: false,
          },
        },
      ];
      const edges = [];
      const selectedNodes = ["node-1"];

      setLocalStorageSkillTree(nodes, edges, selectedNodes);

      const savedNodesCall = localStorage.setItem.mock.calls.find(
        (call) => call[0] === "skillTreeNodes",
      );
      const savedNodes = JSON.parse(savedNodesCall[1]);
      const savedNode = savedNodes[0];

      expect(savedNode.id).toBe("node-1");
      expect(savedNode.type).toBe("skillNode");
      expect(savedNode.position).toEqual({ x: 100, y: 200 });
      expect(savedNode.data.label).toBe("Moon walk");
      expect(savedNode.data.description).toBe("Cool dance move");
      expect(savedNode.data.category).toBe("movement");
      expect(savedNode.data.selected).toBe(true);
    });
  });

  describe("getLocalStorageSkillTree", () => {
    const mockHandleClick = vi.fn();

    it("should return stored data when localStorage contains valid data", () => {
      const storedNodes = [
        { id: "node-1", type: "skillNode", data: { label: "Moon Walk" } },
        { id: "node-2", type: "skillNode", data: { label: "The worm" } },
      ];
      const storedEdges = [
        { id: "edge-1", source: "node-1", target: "node-2" },
      ];

      localStorage.getItem.mockImplementation((key) => {
        if (key === "skillTreeNodes") return JSON.stringify(storedNodes);
        if (key === "skillTreeEdges") return JSON.stringify(storedEdges);
        return null;
      });

      const result = getLocalStorageSkillTree(mockHandleClick, []);

      expect(result.nodes).toEqual(storedNodes);
      expect(result.edges).toEqual(storedEdges);
    });

    it("should return default data when localStorage is empty", () => {
      localStorage.getItem.mockReturnValue(null);

      const result = getLocalStorageSkillTree(mockHandleClick, []);

      // Should match the default generated tree
      expect(result.nodes).toHaveLength(6);
      expect(result.edges).toHaveLength(5);
      expect(result.nodes.find((n) => n.type === "startingNode")).toBeDefined();
    });

    it('should return default data when localStorage contains "null" string', () => {
      localStorage.getItem.mockReturnValue("null");

      const result = getLocalStorageSkillTree(mockHandleClick, []);

      expect(result.nodes).toHaveLength(6);
      expect(result.edges).toHaveLength(5);
    });

    it("should return default data when stored data is empty array", () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === "skillTreeNodes") return JSON.stringify([]);
        if (key === "skillTreeEdges") return JSON.stringify([]);
        return null;
      });

      const result = getLocalStorageSkillTree(mockHandleClick, []);

      expect(result.nodes).toHaveLength(6);
      expect(result.edges).toHaveLength(5);
    });

    it("should return default data when stored data is not an array", () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === "skillTreeNodes")
          return JSON.stringify({ notAnArray: true });
        if (key === "skillTreeEdges") return JSON.stringify("notAnArray");
        return null;
      });

      const result = getLocalStorageSkillTree(mockHandleClick, []);

      expect(result.nodes).toHaveLength(6);
      expect(result.edges).toHaveLength(5);
    });

    it("should handle mix of valid and invalid stored data", () => {
      const validNodes = [
        { id: "valid-1", type: "skillNode", data: { label: "Valid" } },
      ];

      localStorage.getItem.mockImplementation((key) => {
        if (key === "skillTreeNodes") return JSON.stringify(validNodes);
        if (key === "skillTreeEdges") return JSON.stringify([]); // Empty edges
        return null;
      });

      const result = getLocalStorageSkillTree(mockHandleClick, []);

      // Should use valid nodes but default edges
      expect(result.nodes).toEqual(validNodes);
      expect(result.edges).toHaveLength(5); // Default edges
    });

    it("should pass selectedNodes to generateInitialSkillTree for defaults", () => {
      localStorage.getItem.mockReturnValue(null);
      const selectedNodes = ["node-1", "node-3"];

      const result = getLocalStorageSkillTree(mockHandleClick, selectedNodes);

      // Check that selected state is applied to default nodes
      const node1 = result.nodes.find((n) => n.id === "node-1");
      const node2 = result.nodes.find((n) => n.id === "node-2");
      const node3 = result.nodes.find((n) => n.id === "node-3");

      expect(node1?.data.selected).toBe(true);
      expect(node2?.data.selected).toBe(false);
      expect(node3?.data.selected).toBe(true);
    });

    it("should handle malformed JSON gracefully", () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === "skillTreeNodes") return "{ invalid json";
        if (key === "skillTreeEdges") return "[ invalid json";
        return null;
      });

      // Should handle JSON parse errors and return defaults
      let result;
      expect(() => {
        result = getLocalStorageSkillTree(mockHandleClick, []);
      }).not.toThrow();

      // Should fall back to defaults when JSON parsing fails
      expect(result.nodes).toHaveLength(6);
      expect(result.edges).toHaveLength(5);
    });
  });
});
