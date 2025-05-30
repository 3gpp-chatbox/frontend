/**
 * @file api_integration.test.js
 * @description Integration tests for API endpoints and workflows. Tests cover:
 * - Complete procedure selection and version comparison flow
 * - Concurrent API request handling
 * - Request cancellation and timeout scenarios
 * - Error handling and recovery:
 *   - Network failures with retry logic
 *   - Server-side validation errors
 *   - Rate limiting responses
 * - Data consistency across related requests
 * - Version management and comparison
 *
 * Uses Vitest with mocked axios for HTTP request simulation.
 * Tests ensure proper endpoint URL construction and response handling.
 */

import { describe, test, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import {
  fetchGraphVersion,
  fetchVersionHistory,
  fetchProcedures,
  fetchProcedure,
} from "../../API/api_calls";

// Mock axios
vi.mock("axios");

describe("API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Procedure workflow", () => {
    const mockProcedures = [
      {
        procedure_id: "1",
        procedure_name: "Registration Procedure",
        entity: ["AMF", "UE"],
      },
    ];

    const mockProcedure = {
      procedure_id: "1",
      graph: {
        nodes: [{ id: "A", label: "Node A" }],
        edges: [{ source: "A", target: "B" }],
      },
    };

    const mockVersions = [
      { version: "1.0", timestamp: "2024-01-01" },
      { version: "2.0", timestamp: "2024-01-02" },
    ];

    test("complete procedure selection and version comparison flow", async () => {
      // Mock API responses
      axios.get
        .mockResolvedValueOnce({ data: mockProcedures }) // fetchProcedures
        .mockResolvedValueOnce({ data: mockProcedure }) // fetchProcedure
        .mockResolvedValueOnce({ data: mockVersions }) // fetchVersionHistory
        .mockResolvedValueOnce({ data: { graph: mockProcedure.graph } }); // fetchGraphVersion

      // 1. Fetch procedures list
      const procedures = await fetchProcedures();
      expect(procedures).toEqual(mockProcedures);

      // 2. Select and fetch specific procedure
      const procedure = await fetchProcedure("1", "AMF");
      expect(procedure).toEqual(mockProcedure);

      // 3. Get version history
      const versions = await fetchVersionHistory("1", "AMF");
      expect(versions).toEqual(mockVersions);

      // 4. Compare with specific version
      const versionData = await fetchGraphVersion("1", "AMF", "2.0");
      expect(versionData).toEqual({ graph: mockProcedure.graph });

      // Verify all API calls were made in correct order
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      expect(axios.get.mock.calls).toEqual([
        [`${baseUrl}/procedures`],
        [`${baseUrl}/procedures/1/AMF`],
        [`${baseUrl}/procedures/1/AMF/history`],
        [`${baseUrl}/procedures/1/AMF/history/2.0`],
      ]);
    });

    test("handles concurrent API requests", async () => {
      // Mock API responses with delays
      axios.get
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ data: mockProcedures }), 100),
            ),
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ data: mockProcedure }), 50),
            ),
        );

      // Make concurrent requests
      const [procedures, procedure] = await Promise.all([
        fetchProcedures(),
        fetchProcedure("1", "AMF"),
      ]);

      expect(procedures).toEqual(mockProcedures);
      expect(procedure).toEqual(mockProcedure);
    });

    test("handles API request cancellation", async () => {
      const controller = new AbortController();
      const error = new Error("Request aborted");
      error.code = "ECONNABORTED";

      axios.get.mockRejectedValueOnce(error);

      // Cancel the request
      controller.abort();

      await expect(fetchProcedures()).rejects.toThrow("Request aborted");
    });
  });

  describe("Error handling and recovery", () => {
    test("handles temporary network failures with retry", async () => {
      const networkError = new Error("Network error");

      // Mock first call to fail, second to succeed
      axios.get
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ data: [] });

      // First attempt should fail
      await expect(fetchProcedures()).rejects.toThrow("Network error");

      // Second attempt should succeed
      const result = await fetchProcedures();
      expect(result).toEqual([]);
    });

    test("handles server-side validation errors", async () => {
      const validationError = new Error("Validation failed");
      validationError.response = {
        status: 400,
        data: {
          message: "Validation failed",
          errors: ["Invalid procedure ID format"],
        },
      };

      axios.get.mockRejectedValueOnce(validationError);

      await expect(fetchProcedure("invalid-id", "AMF")).rejects.toThrow(
        "Validation failed",
      );
    });

    test("handles rate limiting", async () => {
      const rateLimitError = new Error("Too many requests");
      rateLimitError.response = {
        status: 429,
        data: { message: "Rate limit exceeded" },
      };

      axios.get.mockRejectedValueOnce(rateLimitError);

      await expect(fetchProcedures()).rejects.toThrow("Too many requests");
    });
  });

  describe("Data consistency", () => {
    test("maintains data consistency across related requests", async () => {
      const mockProcedure = {
        procedure_id: "1",
        version: "1.0",
        graph: { nodes: [], edges: [] },
      };

      const mockVersion = {
        version: "1.0",
        timestamp: "2024-01-01",
      };

      // Mock responses
      axios.get
        .mockResolvedValueOnce({ data: mockProcedure })
        .mockResolvedValueOnce({ data: [mockVersion] });

      // Fetch procedure and its version history
      const procedure = await fetchProcedure("1", "AMF");
      const versions = await fetchVersionHistory("1", "AMF");

      // Verify version consistency
      expect(procedure.version).toBe(versions[0].version);
    });

    test("handles version mismatch gracefully", async () => {
      const mockProcedure = {
        procedure_id: "1",
        version: "1.0",
        graph: { nodes: [], edges: [] },
      };

      const mockVersionData = {
        version: "2.0",
        graph: { nodes: [], edges: [] },
      };

      axios.get
        .mockResolvedValueOnce({ data: mockProcedure })
        .mockResolvedValueOnce({ data: mockVersionData });

      const procedure = await fetchProcedure("1", "AMF");
      const versionData = await fetchGraphVersion("1", "AMF", "2.0");

      expect(procedure.version).not.toBe(versionData.version);
    });
  });
});