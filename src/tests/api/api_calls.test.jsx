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
// Do not import or mock axios at the top
import {
  fetchProcedures,
  fetchProcedure,
  insertProcedureGraphChanges,
  fetchOriginalGraph,
  fetchVersionHistory,
  fetchGraphVersion,
} from "../../API/api_calls";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("api_calls", () => {
  const procedureId = "test-proc";
  const entity = "amf";

  beforeEach(() => {
    global.axiosGetMock.mockReset();
    global.axiosPostMock.mockReset();
    global.axiosDeleteMock.mockReset();
  });

  afterEach(() => {
    global.axiosGetMock.mockReset();
    global.axiosPostMock.mockReset();
    global.axiosDeleteMock.mockReset();
  });

  describe("fetchProcedures", () => {
    it("should fetch procedures successfully", async () => {
      const mockData = [{ id: 1, name: "Procedure A" }];
      global.axiosGetMock.mockResolvedValueOnce({ data: mockData });

      const result = await fetchProcedures();
      expect(result).toEqual(mockData);
      expect(global.axiosGetMock).toHaveBeenCalledWith(`/procedures`);
      expect(global.axiosGetMock).toHaveBeenCalledTimes(1);
    });

    it("should handle network errors", async () => {
      const error = new Error("Network error");
      global.axiosGetMock.mockRejectedValueOnce(error);

      await expect(fetchProcedures()).rejects.toThrow("Network error");
    });
  });

  describe("fetchProcedure", () => {
    it("should fetch a specific procedure successfully", async () => {
      const mockData = { id: 2, name: "Procedure B" };
      global.axiosGetMock.mockResolvedValueOnce({ data: mockData });

      const result = await fetchProcedure(procedureId, entity);
      expect(result).toEqual(mockData);
      expect(global.axiosGetMock).toHaveBeenCalledWith(
        `/procedures/${procedureId}/${entity}`
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
      global.axiosPostMock.mockResolvedValueOnce({ data: mockResponse });

      const result = await insertProcedureGraphChanges(procedureId, entity, changes);
      expect(result).toEqual(mockResponse);
      expect(global.axiosPostMock).toHaveBeenCalledWith(
        `/procedures/${procedureId}/${entity}`,
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
      global.axiosGetMock.mockRejectedValueOnce(new Error("Failed to fetch"));
      const result = await fetchOriginalGraph(procedureId, entity);
      expect(result).toBeNull();
    });

    it("should handle successful response", async () => {
      const mockGraph = { nodes: [], edges: [] };
      global.axiosGetMock.mockResolvedValueOnce({ data: mockGraph });
      const result = await fetchOriginalGraph(procedureId, entity);
      expect(result).toEqual(mockGraph);
    });
  });

  describe("fetchVersionHistory", () => {
    it("should fetch version history successfully", async () => {
      const mockHistory = [{ version: "1.0" }, { version: "1.1" }];
      global.axiosGetMock.mockResolvedValueOnce({ data: mockHistory });
      const result = await fetchVersionHistory(procedureId, entity);
      expect(result).toEqual(mockHistory);
      expect(global.axiosGetMock).toHaveBeenCalledWith(
        `/procedures/${procedureId}/${entity}/history`
      );
    });
  });

  describe("fetchGraphVersion", () => {
    const graphId = "v1";

    it("should fetch specific version successfully", async () => {
      const mockVersion = { version: "1.0", data: {} };
      global.axiosGetMock.mockResolvedValueOnce({ data: mockVersion });
      const result = await fetchGraphVersion(procedureId, entity, graphId);
      expect(result).toEqual(mockVersion);
      expect(global.axiosGetMock).toHaveBeenCalledWith(
        `/procedures/${procedureId}/${entity}/history/${graphId}`
      );
    });
  });
});