/**
 * @file api_calls.test.js
 * @description Unit tests for API call functions. Tests cover:
 * - Individual API endpoint functions:
 *   - fetchProcedures
 *   - fetchProcedure
 *   - insertProcedureGraphChanges
 *   - fetchOriginalGraph
 *   - fetchVersionHistory
 *   - fetchGraphVersion
 *
 * Each function is tested for:
 * - Successful response handling
 * - Proper URL construction
 * - Error cases and null responses
 * - Correct parameter passing
 *
 * Uses Vitest with mocked axios for isolated unit testing of API functions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import {
  fetchProcedures,
  fetchProcedure,
  insertProcedureGraphChanges,
  fetchOriginalGraph,
  fetchVersionHistory,
  fetchGraphVersion,
} from "../../API/api_calls";

// Mock axios
vi.mock("axios");

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("api_calls", () => {
  const procedureId = "test-proc";
  const entity = "amf";

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchProcedures", () => {
    it("should fetch procedures successfully", async () => {
      const mockData = [{ id: 1, name: "Procedure A" }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchProcedures();
      
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/procedures`);
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it("should handle network errors", async () => {
      const error = new Error("Network error");
      axios.get.mockRejectedValueOnce(error);

      await expect(fetchProcedures()).rejects.toThrow("Network error");
    });
  });

  describe("fetchProcedure", () => {
    it("should fetch a specific procedure successfully", async () => {
      const mockData = { id: 2, name: "Procedure B" };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchProcedure(procedureId, entity);
      
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/procedures/${procedureId}/${entity}`
      );
    });

    it("should handle missing parameters", async () => {
      await expect(fetchProcedure()).rejects.toThrow();
    });
  });

  describe("insertProcedureGraphChanges", () => {
    const changes = {
      edited_graph: { nodes: [], edges: [] },
      commit_title: "Test commit",
      commit_message: "Test message",
    };

    it("should insert changes successfully", async () => {
      const mockResponse = { success: true };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await insertProcedureGraphChanges(procedureId, entity, changes);
      
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/procedures/${procedureId}/${entity}`,
        {
          edited_graph: changes.edited_graph,
          commit_title: changes.commit_title,
          commit_message: changes.commit_message,
        }
      );
    });

    it("should handle invalid changes object", async () => {
      await expect(
        insertProcedureGraphChanges(procedureId, entity, {})
      ).rejects.toThrow();
    });
  });

  describe("fetchOriginalGraph", () => {
    it("should return null on error", async () => {
      axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));
      const result = await fetchOriginalGraph(procedureId, entity);
      expect(result).toBeNull();
    });

    it("should handle successful response", async () => {
      const mockGraph = { nodes: [], edges: [] };
      axios.get.mockResolvedValueOnce({ data: mockGraph });
      const result = await fetchOriginalGraph(procedureId, entity);
      expect(result).toEqual(mockGraph);
    });
  });

  describe("fetchVersionHistory", () => {
    it("should fetch version history successfully", async () => {
      const mockHistory = [{ version: "1.0" }, { version: "1.1" }];
      axios.get.mockResolvedValueOnce({ data: mockHistory });
      
      const result = await fetchVersionHistory(procedureId, entity);
      
      expect(result).toEqual(mockHistory);
      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/procedures/${procedureId}/${entity}/history`
      );
    });
  });

  describe("fetchGraphVersion", () => {
    const graphId = "v1";

    it("should fetch specific version successfully", async () => {
      const mockVersion = { version: "1.0", data: {} };
      axios.get.mockResolvedValueOnce({ data: mockVersion });
      
      const result = await fetchGraphVersion(procedureId, entity, graphId);
      
      expect(result).toEqual(mockVersion);
      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/procedures/${procedureId}/${entity}/history/${graphId}`
      );
    });
  });
});