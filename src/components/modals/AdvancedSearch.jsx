import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchProcedures, fetchProcedure } from "../../API/api_calls";

const initialFilters = {
  procedureName: "",
  entity: "",
  documentSpec: "",
  release: "",
  document_version: "",
};

function AdvancedSearch({ isOpen, onClose, onSelect }) {
  const [procedures, setProcedures] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [procedureNames, setProcedureNames] = useState([]);
  const [entities, setEntities] = useState([]);
  const [documentSpecs, setDocumentSpecs] = useState([]);
  const [releases, setReleases] = useState([]);
  const [document_versions, setDocument_versions] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetchProcedures()
      .then((data) => {
        setProcedures(data);
        setFiltered(flattenProcedures(data));
        setProcedureNames(getUniqueProcedureNames(data));
        setEntities(getUniqueEntities(data));
        setDocumentSpecs(getUniqueSpecs(data));
        setReleases(getUniqueReleases(data));
        setDocument_versions(getUniqueVersions(data));
      })
      .catch((err) => setError("Failed to load procedures."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  function flattenProcedures(data) {
    return data.flatMap((doc) =>
      doc.document_procedures.flatMap((proc) =>
        proc.entity.map((entity) => ({
          procedure_id: proc.procedure_id,
          procedure_name: proc.procedure_name,
          entity,
          document_spec: doc.document_spec,
          document_version: doc.document_version,
          document_release: doc.document_release,
          document_id: doc.document_id,
        }))
      )
    );
  }

  function getUniqueProcedureNames(data) {
    return Array.from(
      new Set(
        data.flatMap((doc) => doc.document_procedures.map((p) => p.procedure_name))
      )
    ).sort();
  }
  function getUniqueEntities(data) {
    return Array.from(
      new Set(
        data.flatMap((doc) => doc.document_procedures.flatMap((p) => p.entity))
      )
    ).sort();
  }
  function getUniqueSpecs(data) {
    return Array.from(new Set(data.map((doc) => doc.document_spec))).sort();
  }
  function getUniqueReleases(data) {
    return Array.from(new Set(data.map((doc) => doc.document_release))).sort((a,b)=>a-b);
  }
  function getUniqueVersions(data) {
    return Array.from(new Set(data.map((doc) => doc.document_version))).sort();
  }

  // Filtering logic
  useEffect(() => {
    if (!procedures.length) return;
    let filteredList = flattenProcedures(procedures);
    if (filters.procedureName)
      filteredList = filteredList.filter((item) =>
        item.procedure_name === filters.procedureName
      );
    if (filters.entity)
      filteredList = filteredList.filter((item) => item.entity === filters.entity);
    if (filters.documentSpec)
      filteredList = filteredList.filter((item) => item.document_spec === filters.documentSpec);
    if (filters.release)
      filteredList = filteredList.filter((item) => String(item.document_release) === String(filters.release));
    if (filters.document_version)
      filteredList = filteredList.filter((item) => item.document_version === filters.document_version);
    setFiltered(filteredList);
    // Update available options for selects based on filteredList
    setProcedureNames(Array.from(new Set(filteredList.map(i=>i.procedure_name))).sort());
    setEntities(Array.from(new Set(filteredList.map(i=>i.entity))).sort());
    setDocumentSpecs(Array.from(new Set(filteredList.map(i=>i.document_spec))).sort());
    setReleases(Array.from(new Set(filteredList.map(i=>i.document_release))).sort((a,b)=>a-b));
    setDocument_versions(Array.from(new Set(filteredList.map(i=>i.document_version))).sort());
  }, [filters, procedures]);

  // Handle select/input changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const handleSelectProcedure = async (item) => {
    try {
      const data = await fetchProcedure(item.procedure_id, item.entity);
      if (data && onSelect) {
        onSelect({
          ...data,
          id: item.procedure_id,
          name: item.procedure_name,
          entity: item.entity,
          document_id: item.document_id,
          spec: item.document_spec,
          release: item.document_release,
          document_version: item.document_version,
        });
        onClose();
      }
    } catch (err) {
      setError("Failed to fetch procedure details.");
    }
  };

  // Modal close on overlay or Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="advanced-search-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Advanced Search</h3>
          <button className="modal-close-btn" onClick={onClose}>&#10005;</button>
        </div>
        <div className="advanced-search-body">
          <div className="advanced-search-filters">
            <label>
              Procedure Name
              <select name="procedureName" value={filters.procedureName} onChange={handleFilterChange}>
                <option value="">Select Procedure</option>
                {procedureNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              Entity
              <select name="entity" value={filters.entity} onChange={handleFilterChange}>
                <option value="">Select Entity</option>
                {entities.map((entity) => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </label>
            <label>
              Document Specification
              <select name="documentSpec" value={filters.documentSpec} onChange={handleFilterChange}>
                <option value="">Select Document</option>
                {documentSpecs.map((spec) => (
                  <option key={spec} value={spec}>TS {spec}</option>
                ))}
              </select>
            </label>
            <label>
              Release
              <select name="release" value={filters.release} onChange={handleFilterChange}>
                <option value="">Select Release</option>
                {releases.map((release) => (
                  <option key={release} value={release}>{release}</option>
                ))}
              </select>
            </label>
            <label>
              Version
              <select name="document_version" value={filters.document_version} onChange={handleFilterChange}>
                <option value="">Select Spec version</option>
                {document_versions.map((document_version) => (
                  <option key={document_version} value={document_version}>{document_version}</option>
                ))}
              </select>
            </label>
            <button className="advanced-search-reset-btn" type="button" onClick={handleReset}>Reset Filters</button>
            {error && <div className="advanced-search-error">{error}</div>}
          </div>
          <div className="advanced-search-list">
            {loading ? (
              <div className="advanced-search-loading">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="advanced-search-no-results">No procedures found.</div>
            ) : (
              filtered.map((item) => (
                <div
                  key={`${item.procedure_id}-${item.entity}`}
                  className="advanced-search-list-item"
                  onClick={() => handleSelectProcedure(item)}
                >
                  <div className="advanced-search-list-title">
                    {item.procedure_name}
                    <span className="advanced-search-entity">{item.entity}</span>
                  </div>
                  <div className="advanced-search-list-meta">
                  <span className="spec">TS {item.document_spec}</span> <span className="doc-version">V{item.document_version}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

AdvancedSearch.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AdvancedSearch;
