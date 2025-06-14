import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchProcedure } from "../../API/api_calls";
import CustomSelect from '../../utils/CustomSelect';

const initialFilters = {
  procedureName: "",
  entity: "",
  documentSpec: "",
  release: "",
  document_version: "",
};

function AdvancedSearch({ isOpen, onClose, onSelect, procedures, loading, error }) {
  const [filtered, setFiltered] = useState([]);
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
    if (!isOpen || !procedures.length) return;
    setFiltered(flattenProcedures(procedures));
    setProcedureNames(getUniqueProcedureNames(procedures));
    setEntities(getUniqueEntities(procedures));
    setDocumentSpecs(getUniqueSpecs(procedures));
    setReleases(getUniqueReleases(procedures));
    setDocument_versions(getUniqueVersions(procedures));
  }, [isOpen, procedures]);

  function flattenProcedures(data) {
    return data.flatMap((doc) =>
      (Array.isArray(doc.document_procedures) ? doc.document_procedures : []).flatMap((proc) =>
        (Array.isArray(proc.entity) ? proc.entity : []).map((entity) => ({
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
              <CustomSelect
                name="procedureName"
                value={filters.procedureName}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'Select Procedure' },
                  ...procedureNames.map(name => ({ value: name, label: name }))
                ]}
                placeholder="Select Procedure"
                disabled={loading}
              />
            </label>
            <label>
              Entity
              <CustomSelect
                name="entity"
                value={filters.entity}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'Select Entity' },
                  ...entities.map(entity => ({ value: entity, label: entity }))
                ]}
                placeholder="Select Entity"
                disabled={loading}
              />
            </label>
            <label>
              Document Specification
              <CustomSelect
                name="documentSpec"
                value={filters.documentSpec}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'Select Document' },
                  ...documentSpecs.map(spec => ({ value: spec, label: `TS ${spec}` }))
                ]}
                placeholder="Select Document"
                disabled={loading}
              />
            </label>
            <label>
              Release
              <CustomSelect
                name="release"
                value={filters.release}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'Select Release' },
                  ...releases.map(release => ({ value: release, label: release }))
                ]}
                placeholder="Select Release"
                disabled={loading}
              />
            </label>
            <label>
              Version
              <CustomSelect
                name="document_version"
                value={filters.document_version}
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'Select Spec version' },
                  ...document_versions.map(version => ({ value: version, label: version }))
                ]}
                placeholder="Select Spec version"
                disabled={loading}
              />
            </label>
            <button className="advanced-search-reset-btn" type="button" onClick={handleReset}>Reset Filters</button>
            {error && <div className="advanced-search-error">{error}</div>}
          </div>
          <div className="advanced-search-list">
            {loading ? (
              <div className="advanced-search-loading">Loading...</div>
            ) : error ? (
              <div className="advanced-search-error">{error}</div>
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
                  </div>
                  <div className="advanced-search-list-meta">
                    <span className="advanced-search-entity">{item.entity}</span>
                    <span className="spec">TS {item.document_spec}</span>
                    <span className="doc-version">V{item.document_version}</span>
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
  procedures: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default AdvancedSearch;
